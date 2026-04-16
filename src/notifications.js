(function () {
    const SETTINGS_STORAGE_KEY = 'frn_notification_settings';
    const OUTBOX_STORAGE_KEY = 'frn_email_outbox';

    const DEFAULT_SETTINGS = {
        version: 1,
        emailDomain: 'epa.gov',
        defaultCc: '',
        replyTo: '',
        transport: {
            mode: 'outbox',
            endpoint: '',
            mailbox: ''
        },
        channels: {
            stage_start: {
                enabled: true,
                body: 'A document has entered a new review stage and is now assigned to you. Please open the FRN workflow system, review the package materials, and begin your stage review.'
            },
            ready_for_approval: {
                enabled: true,
                body: 'This FRN document has completed its current review work and is ready for your approval action. Please review the package, comments, and attachments, then approve or reject the document as appropriate.'
            },
            document_approved: {
                enabled: true,
                body: 'Your FRN document has been approved and advanced to the next stage of the workflow. Please review the updated stage assignment and any follow-on actions that may now be required.'
            },
            document_rejected: {
                enabled: true,
                body: 'This FRN document has been rejected and returned for correction. Please review the rejection notes, update the document package, and resubmit it when the required changes have been completed.'
            }
        }
    };

    function cloneDefaults() {
        return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    }

    function mergeSettings(stored) {
        const defaults = cloneDefaults();
        if (!stored || typeof stored !== 'object') {
            return defaults;
        }

        return {
            ...defaults,
            ...stored,
            channels: {
                ...defaults.channels,
                ...(stored.channels || {})
            }
        };
    }

    function readJson(key, fallback) {
        try {
            const stored = window.localStorage.getItem(key);
            if (!stored) {
                return fallback;
            }
            return JSON.parse(stored);
        } catch (error) {
            console.warn(`Unable to read ${key} from localStorage.`, error);
            return fallback;
        }
    }

    function writeJson(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Unable to persist ${key} to localStorage.`, error);
        }
    }

    function loadSettings() {
        return mergeSettings(readJson(SETTINGS_STORAGE_KEY, null));
    }

    function saveSettings(nextSettings) {
        const merged = mergeSettings(nextSettings);
        writeJson(SETTINGS_STORAGE_KEY, merged);
        return merged;
    }

    function loadOutbox() {
        const stored = readJson(OUTBOX_STORAGE_KEY, []);
        return Array.isArray(stored) ? stored : [];
    }

    function saveOutbox(messages) {
        writeJson(OUTBOX_STORAGE_KEY, messages);
    }

    function slugify(value) {
        return String(value || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function sanitizeForEmail(value) {
        return slugify(value).replace(/-/g, '.');
    }

    function splitRecipients(value) {
        return String(value || '')
            .split(/[;,]/)
            .map(item => item.trim())
            .filter(Boolean);
    }

    function getStageConfig(stageNumber) {
        const stages = (((window.FRN_DATA || {}).processSettings || {}).stages || []);
        return stages.find(stage => Number(stage.stageNumber) === Number(stageNumber)) || null;
    }

    function getCurrentUser() {
        if (typeof window.getFRNCurrentUser === 'function') {
            return window.getFRNCurrentUser() || {};
        }
        return window.FRN_CURRENT_USER || {};
    }

    function getCurrentRouteHref(doc, route) {
        const safeRoute = route || 'dashboard';
        const docParam = doc && doc.id ? `?doc=${encodeURIComponent(doc.id)}` : '';
        return `${window.location.origin}${window.location.pathname}#${safeRoute}${docParam}`;
    }

    function formatPersonEmail(name, emailDomain) {
        const cleaned = String(name || '').trim();
        if (!cleaned) {
            return '';
        }
        if (cleaned.includes('@')) {
            return cleaned;
        }

        const words = cleaned
            .replace(/\b(dr|mr|mrs|ms)\.?\b/gi, '')
            .split(/\s+/)
            .map(word => word.replace(/[^a-zA-Z0-9]/g, ''))
            .filter(Boolean);

        if (!words.length) {
            return '';
        }

        if (words.length >= 2 && words.every(word => /^[a-z0-9]+$/i.test(word))) {
            const localPart = `${words[0]}.${words[words.length - 1]}`.toLowerCase();
            return `${localPart}@${emailDomain}`;
        }

        return `${sanitizeForEmail(cleaned)}@${emailDomain}`;
    }

    function getDocumentOwnerEmails(doc, settings) {
        const recipients = [];
        if (doc && doc.submittedByUPN) {
            recipients.push(doc.submittedByUPN);
        }
        if (doc && doc.submittedBy) {
            recipients.push(formatPersonEmail(doc.submittedBy, settings.emailDomain));
        }
        return recipients.filter(Boolean);
    }

    function uniqueRecipients(recipients) {
        return [...new Set((recipients || []).map(item => String(item || '').trim()).filter(Boolean))];
    }

    function resolveRecipients(eventType, context, settings) {
        const doc = context.doc || {};
        const actionUser = context.actionUser || {};
        const currentStageConfig = getStageConfig(doc.stageNumber || context.currentStageNumber);
        const nextStageConfig = getStageConfig(context.nextStageNumber);
        const documentOwners = getDocumentOwnerEmails(doc, settings);
        const stageOwnerEmail = formatPersonEmail(doc.stageOwner || doc.assignee, settings.emailDomain);
        const currentApproverEmail = formatPersonEmail((currentStageConfig && currentStageConfig.approver) || doc.stageOwner, settings.emailDomain);
        const nextAssigneeEmail = formatPersonEmail(context.nextAssignee || doc.assignee || doc.stageOwner, settings.emailDomain);
        const nextApproverEmail = formatPersonEmail((nextStageConfig && nextStageConfig.approver) || doc.nextReviewer, settings.emailDomain);
        const actionUserEmail = actionUser.userPrincipalName || formatPersonEmail(actionUser.fullName, settings.emailDomain);
        const ccRecipients = splitRecipients(settings.defaultCc);

        switch (eventType) {
        case 'ready_for_approval':
            return {
                to: uniqueRecipients([currentApproverEmail, stageOwnerEmail].filter(Boolean)),
                cc: uniqueRecipients([...documentOwners, actionUserEmail, ...ccRecipients])
            };
        case 'stage_start':
            return {
                to: uniqueRecipients([nextAssigneeEmail, nextApproverEmail].filter(Boolean)),
                cc: uniqueRecipients([...documentOwners, actionUserEmail, ...ccRecipients])
            };
        case 'document_approved':
            return {
                to: uniqueRecipients([...documentOwners, actionUserEmail]),
                cc: uniqueRecipients([nextAssigneeEmail, nextApproverEmail, ...ccRecipients])
            };
        case 'document_rejected':
            return {
                to: uniqueRecipients([stageOwnerEmail, ...documentOwners]),
                cc: uniqueRecipients([actionUserEmail, ...ccRecipients])
            };
        default:
            return {
                to: uniqueRecipients([...documentOwners, actionUserEmail]),
                cc: uniqueRecipients(ccRecipients)
            };
        }
    }

    function buildTemplateContext(eventType, context) {
        const doc = context.doc || {};
        const actionUser = context.actionUser || {};
        return {
            eventType,
            documentId: doc.id || '',
            documentTitle: doc.title || '',
            currentStage: context.currentStage || doc.currentStage || '',
            nextStage: context.nextStage || '',
            stageOwner: doc.stageOwner || doc.assignee || '',
            nextReviewer: doc.nextReviewer || '',
            submittedBy: doc.submittedBy || '',
            actionUser: actionUser.fullName || '',
            rejectionNotes: context.rejectionNotes || '',
            approvalSubmittedBy: doc.approvalSubmittedBy || '',
            documentLink: context.documentLink || getCurrentRouteHref(doc, context.route)
        };
    }

    function renderTemplate(template, templateContext) {
        return String(template || '').replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
            const value = templateContext[key];
            return value == null ? '' : String(value);
        });
    }

    function buildSubject(eventType, templateContext) {
        const documentLabel = templateContext.documentId || 'FRN Document';
        switch (eventType) {
        case 'ready_for_approval':
            return `${documentLabel} ready for approval`;
        case 'stage_start':
            return `${documentLabel} entered ${templateContext.nextStage || 'the next stage'}`;
        case 'document_approved':
            return `${documentLabel} approved${templateContext.nextStage ? ` for ${templateContext.nextStage}` : ''}`;
        case 'document_rejected':
            return `${documentLabel} rejected for correction`;
        default:
            return `${documentLabel} workflow notification`;
        }
    }

    function queueMessage(message) {
        const outbox = loadOutbox();
        outbox.unshift(message);
        saveOutbox(outbox.slice(0, 100));
    }

    function buildDebugSummary(message, context, extra) {
        const doc = (context && context.doc) || {};
        return {
            eventType: message && message.eventType,
            messageId: message && message.id,
            documentId: doc.id || '',
            documentTitle: doc.title || '',
            currentStage: (context && context.currentStage) || doc.currentStage || '',
            nextStage: (context && context.nextStage) || '',
            actionUser: ((context && context.actionUser) || {}).fullName || '',
            transportMode: extra.transportMode,
            transportEndpoint: extra.transportEndpoint,
            mailbox: extra.mailbox,
            recipients: {
                to: (message && message.to) || [],
                cc: (message && message.cc) || [],
                replyTo: (message && message.replyTo) || ''
            },
            status: message && message.status
        };
    }

    function logNotification(label, details, context) {
        const title = `[FRN Notifications] ${label}`;
        if (console.groupCollapsed) {
            console.groupCollapsed(title);
            console.log(details);
            if (context) {
                console.log('Context:', context);
            }
            console.groupEnd();
            return;
        }
        console.log(title, details, context || '');
    }

    function isBrowserSafeJsonEndpoint(endpoint) {
        if (!endpoint) {
            return false;
        }

        try {
            const target = new URL(endpoint, window.location.href);
            const current = new URL(window.location.href);
            return target.origin === current.origin
                || target.hostname === '127.0.0.1'
                || target.hostname === 'localhost';
        } catch (error) {
            console.warn('Unable to inspect notification endpoint URL.', error);
            return false;
        }
    }

    function buildPowerAutomatePayload(message, context, settings) {
        const doc = (context && context.doc) || {};
        const actionUser = (context && context.actionUser) || {};
        return {
            eventType: message.eventType,
            notificationId: message.id,
            createdAt: message.createdAt,
            transportMode: 'power_automate',
            mailbox: ((settings || {}).transport || {}).mailbox || '',
            recipients: {
                to: message.to || [],
                cc: message.cc || [],
                replyTo: message.replyTo || ''
            },
            message: {
                subject: message.subject || '',
                body: message.body || ''
            },
            document: {
                id: doc.id || '',
                title: doc.title || '',
                currentStage: (context && context.currentStage) || doc.currentStage || '',
                nextStage: (context && context.nextStage) || '',
                submittedBy: doc.submittedBy || '',
                stageOwner: doc.stageOwner || doc.assignee || '',
                nextReviewer: doc.nextReviewer || '',
                link: (message.context && message.context.documentLink) || ''
            },
            actionUser: {
                fullName: actionUser.fullName || '',
                userPrincipalName: actionUser.userPrincipalName || '',
                objectId: actionUser.objectId || '',
                tenantId: actionUser.tenantId || ''
            },
            templateContext: message.context || {}
        };
    }

    async function dispatchMessage(message, context) {
        const settings = loadSettings();
        const transportConfig = settings.transport || {};
        const transport = window.FRN_EMAIL_TRANSPORT;
        const transportMode = transport && typeof transport.send === 'function'
            ? 'custom'
            : (transportConfig.mode || 'outbox');
        const transportEndpoint = transportConfig.endpoint || '';
        const mailbox = transportConfig.mailbox || '';

        logNotification('Dispatch requested', buildDebugSummary(message, context, {
            transportMode,
            transportEndpoint,
            mailbox
        }), context);

        if (transport && typeof transport.send === 'function') {
            try {
                await transport.send(message);
                logNotification('Dispatch completed', buildDebugSummary({
                    ...message,
                    status: 'sent'
                }, context, {
                    transportMode,
                    transportEndpoint,
                    mailbox
                }));
                return 'sent';
            } catch (error) {
                console.warn('Configured email transport failed. Falling back to queued outbox record.', error);
                logNotification('Dispatch fallback', buildDebugSummary({
                    ...message,
                    status: 'queued'
                }, context, {
                    transportMode,
                    transportEndpoint,
                    mailbox
                }), { error: error.message });
                return 'queued';
            }
        }
        if (transportConfig.mode === 'relay' && transportConfig.endpoint) {
            try {
                const response = await window.fetch(transportConfig.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        mailbox: transportConfig.mailbox || '',
                        message
                    })
                });
                if (!response.ok) {
                    throw new Error(`Relay returned HTTP ${response.status}`);
                }
                logNotification('Dispatch completed', buildDebugSummary({
                    ...message,
                    status: 'sent'
                }, context, {
                    transportMode,
                    transportEndpoint,
                    mailbox
                }));
                return 'sent';
            } catch (error) {
                console.warn('Configured Outlook relay failed. Falling back to queued outbox record.', error);
                logNotification('Dispatch fallback', buildDebugSummary({
                    ...message,
                    status: 'queued'
                }, context, {
                    transportMode,
                    transportEndpoint,
                    mailbox
                }), { error: error.message });
                return 'queued';
            }
        }
        if (transportConfig.mode === 'power_automate' && transportConfig.endpoint) {
            try {
                const payload = JSON.stringify(buildPowerAutomatePayload(message, context, settings));
                const useJsonRequest = isBrowserSafeJsonEndpoint(transportConfig.endpoint);
                const response = await window.fetch(transportConfig.endpoint, useJsonRequest
                    ? {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        keepalive: true,
                        body: payload
                    }
                    : {
                        method: 'POST',
                        mode: 'no-cors',
                        keepalive: true,
                        body: payload
                    });
                if (useJsonRequest && !response.ok) {
                    throw new Error(`Power Automate endpoint returned HTTP ${response.status}`);
                }
                logNotification('Dispatch completed', buildDebugSummary({
                    ...message,
                    status: 'sent'
                }, context, {
                    transportMode,
                    transportEndpoint,
                    mailbox
                }));
                return 'sent';
            } catch (error) {
                console.warn('Configured Power Automate endpoint failed. Falling back to queued outbox record.', error);
                logNotification('Dispatch fallback', buildDebugSummary({
                    ...message,
                    status: 'queued'
                }, context, {
                    transportMode,
                    transportEndpoint,
                    mailbox
                }), { error: error.message });
                return 'queued';
            }
        }
        logNotification('Dispatch queued locally', buildDebugSummary({
            ...message,
            status: 'queued'
        }, context, {
            transportMode,
            transportEndpoint,
            mailbox
        }));
        return 'queued';
    }

    async function notify(eventType, context) {
        const settings = loadSettings();
        const channel = settings.channels[eventType];
        if (!channel || !channel.enabled) {
            logNotification('Skipped trigger', {
                eventType,
                reason: 'disabled',
                documentId: ((context || {}).doc || {}).id || ''
            }, context);
            return { skipped: true, reason: 'disabled' };
        }

        const templateContext = buildTemplateContext(eventType, context);
        const recipients = resolveRecipients(eventType, context, settings);
        if (!recipients.to.length) {
            logNotification('Skipped trigger', {
                eventType,
                reason: 'no-recipients',
                documentId: ((context || {}).doc || {}).id || '',
                recipients
            }, context);
            return { skipped: true, reason: 'no-recipients' };
        }

        const message = {
            id: `email-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            eventType,
            createdAt: new Date().toISOString(),
            to: recipients.to,
            cc: recipients.cc,
            replyTo: settings.replyTo || '',
            subject: buildSubject(eventType, templateContext),
            body: renderTemplate(channel.body, templateContext),
            context: templateContext,
            status: 'queued'
        };

        logNotification('Trigger fired', buildDebugSummary(message, context, {
            transportMode: ((settings.transport || {}).mode) || 'outbox',
            transportEndpoint: ((settings.transport || {}).endpoint) || '',
            mailbox: ((settings.transport || {}).mailbox) || ''
        }), context);

        const status = await dispatchMessage(message, context);
        message.status = status;
        queueMessage(message);
        logNotification('Message stored', buildDebugSummary(message, context, {
            transportMode: ((settings.transport || {}).mode) || 'outbox',
            transportEndpoint: ((settings.transport || {}).endpoint) || '',
            mailbox: ((settings.transport || {}).mailbox) || ''
        }));
        window.dispatchEvent(new window.CustomEvent('frn:email-dispatched', { detail: message }));
        return { skipped: false, message };
    }

    window.FRN_NOTIFICATIONS = {
        DEFAULT_SETTINGS,
        loadSettings,
        saveSettings,
        loadOutbox,
        notify,
        formatPersonEmail
    };
})();
