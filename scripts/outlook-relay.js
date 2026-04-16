const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const PORT = Number(process.env.FRN_OUTLOOK_RELAY_PORT || 3001);
const ALLOWED_ORIGIN = process.env.FRN_OUTLOOK_RELAY_ORIGIN || '*';
const CONFIG_PATH = path.join(process.cwd(), 'relay.config.json');

const ENV_CONFIG = {
    tenantId: process.env.M365_TENANT_ID || '',
    clientId: process.env.M365_CLIENT_ID || '',
    clientSecret: process.env.M365_CLIENT_SECRET || '',
    defaultMailbox: process.env.M365_MAILBOX_USER || ''
};

let relayConfig = loadRelayConfig();

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Private-Network': 'true'
    });
    res.end(JSON.stringify(payload));
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
            if (body.length > 1024 * 1024) {
                reject(new Error('Request body too large.'));
                req.destroy();
            }
        });
        req.on('end', () => resolve(body));
        req.on('error', reject);
    });
}

function sanitizeConfig(input) {
    if (!input || typeof input !== 'object') {
        return {};
    }

    return {
        tenantId: String(input.tenantId || '').trim(),
        clientId: String(input.clientId || '').trim(),
        clientSecret: String(input.clientSecret || ''),
        defaultMailbox: String(input.defaultMailbox || '').trim(),
        updatedAt: input.updatedAt || ''
    };
}

function readConfigFile() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) {
            return {};
        }
        const stored = fs.readFileSync(CONFIG_PATH, 'utf8');
        return sanitizeConfig(JSON.parse(stored));
    } catch (error) {
        console.warn('[Outlook Relay] Unable to read relay.config.json:', error.message);
        return {};
    }
}

function mergeConfig(fileConfig) {
    return {
        tenantId: fileConfig.tenantId || ENV_CONFIG.tenantId,
        clientId: fileConfig.clientId || ENV_CONFIG.clientId,
        clientSecret: fileConfig.clientSecret || ENV_CONFIG.clientSecret,
        defaultMailbox: fileConfig.defaultMailbox || ENV_CONFIG.defaultMailbox,
        updatedAt: fileConfig.updatedAt || ''
    };
}

function loadRelayConfig() {
    return mergeConfig(readConfigFile());
}

function persistRelayConfig(nextConfig) {
    const sanitized = sanitizeConfig(nextConfig);
    const payload = {
        tenantId: sanitized.tenantId,
        clientId: sanitized.clientId,
        clientSecret: sanitized.clientSecret,
        defaultMailbox: sanitized.defaultMailbox,
        updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(payload, null, 2) + '\n', 'utf8');
    relayConfig = mergeConfig(payload);
    return relayConfig;
}

function getPublicConfig() {
    return {
        tenantId: relayConfig.tenantId,
        clientId: relayConfig.clientId,
        defaultMailbox: relayConfig.defaultMailbox,
        hasClientSecret: Boolean(relayConfig.clientSecret),
        relayConfigured: Boolean(relayConfig.tenantId && relayConfig.clientId && relayConfig.clientSecret && relayConfig.defaultMailbox),
        updatedAt: relayConfig.updatedAt || '',
        configPath: CONFIG_PATH
    };
}

async function getGraphToken(config) {
    if (!config.tenantId || !config.clientId || !config.clientSecret) {
        throw new Error('Relay is missing Microsoft 365 credentials. Open Notifications and Escalations in the app and save the tenant ID, client ID, and client secret.');
    }

    const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(config.tenantId)}/oauth2/v2.0/token`;
    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            grant_type: 'client_credentials',
            scope: 'https://graph.microsoft.com/.default'
        })
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Token request failed with HTTP ${response.status}: ${text}`);
    }

    const payload = await response.json();
    if (!payload.access_token) {
        throw new Error('Token response did not include an access_token.');
    }

    return payload.access_token;
}

function toGraphRecipients(recipients) {
    return (Array.isArray(recipients) ? recipients : [])
        .map(address => String(address || '').trim())
        .filter(Boolean)
        .map(address => ({
            emailAddress: {
                address
            }
        }));
}

async function sendMailWithGraph(config, mailbox, message) {
    const token = await getGraphToken(config);
    const sender = mailbox || config.defaultMailbox;
    if (!sender) {
        throw new Error('No mailbox configured. Save the service mailbox in the notification settings or relay configuration before sending mail.');
    }

    const graphResponse = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: {
                subject: message.subject,
                body: {
                    contentType: 'Text',
                    content: message.body
                },
                toRecipients: toGraphRecipients(message.to),
                ccRecipients: toGraphRecipients(message.cc),
                replyTo: toGraphRecipients(message.replyTo ? [message.replyTo] : [])
            },
            saveToSentItems: true
        })
    });

    if (!graphResponse.ok) {
        const text = await graphResponse.text();
        throw new Error(`Graph sendMail failed with HTTP ${graphResponse.status}: ${text}`);
    }
}

function sanitizeGraphFilterValue(value) {
    return String(value || '').replace(/'/g, "''");
}

async function searchEntraUsers(config, searchTerm) {
    const trimmedSearch = String(searchTerm || '').trim();
    if (!trimmedSearch) {
        return [];
    }

    const token = await getGraphToken(config);
    const escaped = sanitizeGraphFilterValue(trimmedSearch);
    const filter = [
        'accountEnabled eq true',
        `(startsWith(displayName,'${escaped}') or startsWith(mail,'${escaped}') or startsWith(userPrincipalName,'${escaped}') or startsWith(givenName,'${escaped}') or startsWith(surname,'${escaped}'))`
    ].join(' and ');

    const graphUrl = new URL('https://graph.microsoft.com/v1.0/users');
    graphUrl.searchParams.set('$select', 'id,displayName,mail,userPrincipalName,jobTitle,department');
    graphUrl.searchParams.set('$top', '12');
    graphUrl.searchParams.set('$filter', filter);

    const response = await fetch(graphUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Graph user search failed with HTTP ${response.status}: ${text}`);
    }

    const payload = await response.json();
    const users = Array.isArray(payload.value) ? payload.value : [];

    return users.map(user => ({
        id: user.id || '',
        displayName: user.displayName || '',
        mail: user.mail || '',
        userPrincipalName: user.userPrincipalName || '',
        jobTitle: user.jobTitle || '',
        department: user.department || ''
    }));
}

async function handleSendMail(req, res) {
    try {
        const rawBody = await readBody(req);
        const payload = rawBody ? JSON.parse(rawBody) : {};
        const mailbox = payload.mailbox || relayConfig.defaultMailbox;
        const message = payload.message || {};

        if (!Array.isArray(message.to) || !message.to.length) {
            sendJson(res, 400, { error: 'At least one recipient is required.' });
            return;
        }
        if (!message.subject || !message.body) {
            sendJson(res, 400, { error: 'subject and body are required.' });
            return;
        }

        await sendMailWithGraph(relayConfig, mailbox, message);
        sendJson(res, 202, {
            status: 'accepted',
            mailbox,
            recipients: message.to
        });
    } catch (error) {
        console.error('[Outlook Relay] send-mail failed:', error);
        sendJson(res, 500, { error: error.message });
    }
}

async function handleGetConfig(res) {
    sendJson(res, 200, getPublicConfig());
}

async function handleSaveConfig(req, res) {
    try {
        const rawBody = await readBody(req);
        const payload = rawBody ? JSON.parse(rawBody) : {};
        const currentFileConfig = readConfigFile();
        const nextConfig = {
            tenantId: String(payload.tenantId || '').trim(),
            clientId: String(payload.clientId || '').trim(),
            clientSecret: payload.clientSecret === ''
                ? currentFileConfig.clientSecret || relayConfig.clientSecret || ''
                : String(payload.clientSecret || currentFileConfig.clientSecret || relayConfig.clientSecret || ''),
            defaultMailbox: String(payload.defaultMailbox || '').trim()
        };

        if (payload.clearClientSecret) {
            nextConfig.clientSecret = '';
        }

        const saved = persistRelayConfig(nextConfig);
        sendJson(res, 200, {
            status: 'saved',
            config: getPublicConfig(),
            savedFields: {
                tenantId: Boolean(saved.tenantId),
                clientId: Boolean(saved.clientId),
                clientSecret: Boolean(saved.clientSecret),
                defaultMailbox: Boolean(saved.defaultMailbox)
            }
        });
    } catch (error) {
        console.error('[Outlook Relay] save-config failed:', error);
        sendJson(res, 500, { error: error.message });
    }
}

async function handleTestConfig(req, res) {
    try {
        const rawBody = await readBody(req);
        const payload = rawBody ? JSON.parse(rawBody) : {};
        const configForTest = {
            tenantId: String(payload.tenantId || relayConfig.tenantId || '').trim(),
            clientId: String(payload.clientId || relayConfig.clientId || '').trim(),
            clientSecret: payload.clientSecret === ''
                ? relayConfig.clientSecret
                : String(payload.clientSecret || relayConfig.clientSecret || ''),
            defaultMailbox: String(payload.defaultMailbox || relayConfig.defaultMailbox || '').trim()
        };

        await getGraphToken(configForTest);
        sendJson(res, 200, {
            status: 'ok',
            mailbox: configForTest.defaultMailbox || '',
            authenticatedTenant: configForTest.tenantId
        });
    } catch (error) {
        console.error('[Outlook Relay] test-config failed:', error);
        sendJson(res, 500, { error: error.message });
    }
}

async function handleSearchEntraUsers(req, res, url) {
    try {
        const search = url.searchParams.get('search') || '';
        if (String(search).trim().length < 2) {
            sendJson(res, 400, { error: 'Provide at least 2 characters to search Microsoft Entra ID.' });
            return;
        }

        const users = await searchEntraUsers(relayConfig, search);
        sendJson(res, 200, {
            status: 'ok',
            count: users.length,
            users
        });
    } catch (error) {
        console.error('[Outlook Relay] entra-users failed:', error);
        sendJson(res, 500, { error: error.message });
    }
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'OPTIONS') {
        sendJson(res, 204, {});
        return;
    }

    if (req.method === 'GET' && url.pathname === '/healthz') {
        sendJson(res, 200, {
            status: 'ok',
            relayConfigured: getPublicConfig().relayConfigured
        });
        return;
    }

    if (req.method === 'GET' && url.pathname === '/api/relay-config') {
        await handleGetConfig(res);
        return;
    }

    if (req.method === 'POST' && url.pathname === '/api/relay-config') {
        await handleSaveConfig(req, res);
        return;
    }

    if (req.method === 'POST' && url.pathname === '/api/relay-config/test') {
        await handleTestConfig(req, res);
        return;
    }

    if (req.method === 'GET' && url.pathname === '/api/entra-users') {
        await handleSearchEntraUsers(req, res, url);
        return;
    }

    if (req.method === 'POST' && url.pathname === '/api/send-mail') {
        await handleSendMail(req, res);
        return;
    }

    sendJson(res, 404, { error: 'Not found.' });
});

server.listen(PORT, () => {
    console.log(`[Outlook Relay] Listening on http://127.0.0.1:${PORT}`);
    console.log(`[Outlook Relay] Config path: ${CONFIG_PATH}`);
});
