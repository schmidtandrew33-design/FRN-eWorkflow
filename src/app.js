/**
 * EPA FRN Approval System — SPA Router
 * Power Apps Code App entry: index.html
 *
 * How it works:
 *   1. Nav clicks update the URL hash and call navigate()
 *   2. navigate() fetches the target HTML file
 *   3. Extracts .content-wrapper from the fetched DOM
 *   4. Injects page-specific <style> tags into #page-styles
 *   5. Injects extracted content into #app
 *   6. Re-executes any inline <script> tags from the page
 *   7. Updates nav active states
 */

/* ─── Route → HTML file mapping ─────────────────────────────────────────── */
const ROUTES = {
    'dashboard':         'dashboard.html',
    'new-notice':        'new-notice.html',
    'update-notice':     'update-notice.html',
    'document-library':  'DocumentLibrary.html',
    'document-review':   'DocumentReview.html',
    'my-tasks':          'my-tasks.html',
    'active-reviews':    'Active-Reviews.html',
    'pending-approvals': 'pending-approvals.html',
    'analytics':         'analytics.html',
    'calendar':          'calendar.html',
    'leaderboards':      'leaderboards.html',
    'team':              'team.html',
    'reports':           'reports.html',
    'settings':          'settings.html',
    'admin-relay':       'admin-relay.html',
    'notifications-escalations': 'notifications-escalations.html',
    'help':              'help.html',
};

const DEFAULT_ROUTE = 'dashboard';

/* ─── Power Apps host user context ──────────────────────────────────────── */
function createLocalFallbackContext() {
    const fallbackName = (window.FRN_DATA && window.FRN_DATA.currentAssignee) || 'Local User';
    return {
        app: {
            appId: '',
            appSettings: {},
            environmentId: '',
            queryParams: {}
        },
        host: {
            sessionId: ''
        },
        user: {
            fullName: fallbackName,
            objectId: '',
            tenantId: '',
            userPrincipalName: ''
        }
    };
}

function getUserInitials(fullName) {
    const parts = (fullName || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2);
    if (!parts.length) {
        return 'EU';
    }
    return parts.map(part => part[0].toUpperCase()).join('');
}

function renderSidebarUserProfile() {
    const nameEl = document.getElementById('sidebar-user-name');
    const avatarEl = document.getElementById('sidebar-user-avatar');
    const avatarImgEl = document.getElementById('sidebar-user-avatar-img');
    const fallbackEl = document.getElementById('sidebar-user-avatar-fallback');
    if (!nameEl || !avatarEl || !avatarImgEl || !fallbackEl) {
        return;
    }

    const currentUser = window.FRN_CURRENT_USER || {};
    const fullName = currentUser.fullName || 'EPA User';
    const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
    const displayName = nameParts.length >= 2
        ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}`
        : fullName;

    nameEl.textContent = displayName;
    fallbackEl.textContent = getUserInitials(displayName);

    if (currentUser.photoDataUrl) {
        avatarImgEl.src = currentUser.photoDataUrl;
        avatarEl.classList.add('has-photo');
    } else {
        avatarImgEl.removeAttribute('src');
        avatarEl.classList.remove('has-photo');
    }

    renderAdminNavVisibility();
}

function isRelayAdminUser() {
    const currentUser = window.FRN_CURRENT_USER || {};
    return String(currentUser.fullName || '').trim().toLowerCase() === 'andrew schmidt';
}

function renderAdminNavVisibility() {
    const adminNav = document.getElementById('nav-admin-relay');
    if (!adminNav) {
        return;
    }
    adminNav.hidden = !isRelayAdminUser();
}

function createPowerAppsBridge() {
    const messageChannel = new window.MessageChannel();
    const state = {
        antiCSRFToken: '',
        callbackId: 0,
        callbacks: {},
        instanceId: Date.now().toString(),
        port: null,
        queue: []
    };

    function send(message) {
        if (!state.port) {
            state.queue.push(message);
            return;
        }
        state.port.postMessage(message);
    }

    function nextCallbackId(pluginName) {
        return `instanceId=${state.instanceId}_${pluginName}${state.callbackId++}`;
    }

    messageChannel.port1.onmessage = event => {
        const message = event.data;
        if (message && message.messageType === 'initCommunication') {
            state.antiCSRFToken = message.antiCSRFToken || '';
            state.port = messageChannel.port1;
            state.queue.forEach(queuedMessage => {
                queuedMessage.antiCSRFToken = state.antiCSRFToken;
                state.port.postMessage(queuedMessage);
            });
            state.queue = [];
            return;
        }

        if (!message || typeof message.isPluginCall !== 'boolean' || !message.isPluginCall) {
            return;
        }

        const callback = state.callbacks[message.callbackId];
        if (!callback) {
            return;
        }

        if (message.keepCallback) {
            if (callback.onUpdate) {
                callback.onUpdate(message.args && message.args[0]);
            }
            return;
        }

        if (message.status === 1) {
            callback.resolve(message.args && message.args[0]);
        } else {
            callback.reject(message.args || []);
        }

        delete state.callbacks[message.callbackId];
    };

    window.parent.postMessage({
        messageType: 'initCommunicationWithPort',
        instanceId: state.instanceId
    }, '*', [messageChannel.port2]);

    return {
        executePluginAsync(pluginName, pluginAction, params = [], onUpdate) {
            return new Promise((resolve, reject) => {
                const callbackId = nextCallbackId(pluginName);
                state.callbacks[callbackId] = { resolve, reject, onUpdate };
                send({
                    isPluginCall: true,
                    callbackId,
                    service: pluginName,
                    action: pluginAction,
                    actionArgs: params,
                    antiCSRFToken: state.antiCSRFToken
                });
            });
        }
    };
}

async function initializeHostContext() {
    if (window.FRN_HOST_CONTEXT) {
        return window.FRN_HOST_CONTEXT;
    }

    let context = createLocalFallbackContext();

    try {
        if (window.parent && window.parent !== window) {
            const bridge = createPowerAppsBridge();
            const hostContext = await bridge.executePluginAsync('AppLifecycle', 'getContext');
            if (hostContext && hostContext.user) {
                context = hostContext;
            }
        }
    } catch (error) {
        console.warn('[Power Apps] Falling back to local user context.', error);
    }

    const user = context.user || {};
    window.FRN_HOST_CONTEXT = context;
    window.FRN_CURRENT_USER = {
        fullName: user.fullName || '',
        objectId: user.objectId || '',
        tenantId: user.tenantId || '',
        userPrincipalName: user.userPrincipalName || '',
        photoDataUrl: user.photoDataUrl || ''
    };
    window.getFRNCurrentUser = () => window.FRN_CURRENT_USER;

    if (window.FRN_DATA && window.FRN_CURRENT_USER.fullName) {
        window.FRN_DATA.currentAssignee = window.FRN_CURRENT_USER.fullName;
    }

    renderSidebarUserProfile();

    return context;
}

window.FRN_HOST_CONTEXT_PROMISE = initializeHostContext();

/* ─── Loading indicator ─────────────────────────────────────────────────── */
const loadingBar = document.getElementById('app-loading');
function showLoading()  { loadingBar.style.display = 'block'; }
function hideLoading()  { loadingBar.style.display = 'none'; }

/* ─── Update nav active state ────────────────────────────────────────────── */
function setActiveNav(route) {
    document.querySelectorAll('.nav-item').forEach(a => {
        a.classList.toggle('active', a.dataset.route === route);
    });
}

/* ─── Execute scripts extracted from a fetched page ─────────────────────── */
function runPageScripts(scripts) {
    // Remove previously injected page scripts
    document.querySelectorAll('script[data-page-script]').forEach(s => s.remove());

    scripts.forEach(src => {
        const script = document.createElement('script');
        script.textContent = `(function () {\n${src}\n})();`;
        script.setAttribute('data-page-script', 'true');
        document.body.appendChild(script);
    });
}

/* ─── Inject page-specific styles ──────────────────────────────────────────
   Some pages bundle layout rules together with repeated nav/sidebar CSS.
   Skipping whole style blocks breaks those pages, so we inject them as-is.
   ─────────────────────────────────────────────────────────────────────────── */
function injectPageStyles(styleBlocks) {
    const slot = document.getElementById('page-styles');
    slot.textContent = styleBlocks.join('\n\n');
}

function renderDocumentLibraryPage() {
    const documents = (window.FRN_DATA && window.FRN_DATA.documents) || [];
    const list = document.getElementById('document-library-list');
    const sidebar = document.getElementById('library-sidebar-stats');
    const search = document.getElementById('library-search');
    const searchButton = document.getElementById('library-search-btn');
    const statusFilter = document.getElementById('library-status-filter');
    const typeFilter = document.getElementById('library-type-filter');
    const officeFilter = document.getElementById('library-office-filter');
    const dateFilter = document.getElementById('library-date-filter');
    const sortFilter = document.getElementById('library-sort-filter');

    if (!list || !sidebar || !search || !statusFilter || !typeFilter || !officeFilter || !dateFilter || !sortFilter) {
        return;
    }

    const parseDate = value => {
        const date = new Date(value + 'T00:00:00');
        date.setHours(0, 0, 0, 0);
        return date;
    };

    const formatDate = value => parseDate(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const matchesDateRange = (doc, range) => {
        if (range === 'all') return true;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const ageDays = Math.round((now - parseDate(doc.lastUpdated)) / 86400000);
        if (range === 'week') return ageDays <= 7;
        if (range === 'month') return ageDays <= 31;
        if (range === 'quarter') return ageDays <= 93;
        if (range === 'year') return ageDays <= 366;
        return true;
    };

    const renderStats = () => {
        const active = documents.filter(doc => doc.status === 'active').length;
        const published = documents.filter(doc => doc.status === 'completed').length;
        const pending = documents.filter(doc => doc.status === 'pending').length;

        sidebar.innerHTML = `
            <h3>Library Statistics</h3>
            <div class="quick-stat">
                <div class="stat-value">${documents.length}</div>
                <div class="stat-label">Total Documents</div>
            </div>
            <div class="quick-stat">
                <div class="stat-value">${active}</div>
                <div class="stat-label">Active Reviews</div>
            </div>
            <div class="quick-stat">
                <div class="stat-value">${published}</div>
                <div class="stat-label">Published</div>
            </div>
            <div class="quick-stat">
                <div class="stat-value">${pending}</div>
                <div class="stat-label">Pending Approval</div>
            </div>
        `;
    };

    const renderDetailRecord = (label, value) => `
        <div class="detail-record">
            <div class="detail-label">${label}</div>
            <div class="detail-value">${value || 'Not Provided'}</div>
        </div>
    `;

    const renderDocuments = () => {
        const query = search.value.trim().toLowerCase();
        const filtered = documents.filter(doc => {
            const matchesQuery = !query || [
                doc.id,
                doc.title,
                doc.currentStage,
                doc.assignee,
                doc.submittedBy,
                doc.office,
                doc.typeLabel
            ].join(' ').toLowerCase().includes(query);

            return matchesQuery
                && (statusFilter.value === 'all' || doc.status === statusFilter.value)
                && (typeFilter.value === 'all' || doc.type === typeFilter.value)
                && (officeFilter.value === 'all' || doc.officeCode === officeFilter.value)
                && matchesDateRange(doc, dateFilter.value);
        }).sort((a, b) => {
            const aTime = parseDate(a.lastUpdated).getTime();
            const bTime = parseDate(b.lastUpdated).getTime();
            return sortFilter.dataset.sortOrder === 'oldest' ? aTime - bTime : bTime - aTime;
        });

        list.innerHTML = filtered.length ? filtered.map((doc, index) => `
            <div class="doc-card">
                <div class="doc-main">
                    <div class="doc-info">
                        <div class="doc-header-row">
                            <div class="doc-id">${doc.id}</div>
                            <div class="doc-status ${doc.status === 'completed' ? 'status-completed' : doc.status === 'pending' ? 'status-pending' : 'status-active'}">${doc.statusLabel}</div>
                        </div>
                        <div class="doc-title">${doc.title}</div>
                        <div class="doc-meta">
                            <div class="meta-item">
                                <div class="meta-label">Current Version</div>
                                <div class="meta-value">${doc.currentVersion}</div>
                            </div>
                            <div class="meta-item">
                                <div class="meta-label">Current Stage</div>
                                <div class="meta-value">${doc.currentStage}</div>
                            </div>
                            <div class="meta-item">
                                <div class="meta-label">Last Updated</div>
                                <div class="meta-value">${formatDate(doc.lastUpdated)}</div>
                            </div>
                            <div class="meta-item">
                                <div class="meta-label">Submitted By</div>
                                <div class="meta-value">${doc.submittedBy}</div>
                            </div>
                        </div>
                    </div>
                    <button class="expand-btn" id="btn-doc-${index}" type="button" onclick="window.toggleDocumentLibraryDetails(event, '${index}')">Details</button>
                </div>
                <div class="doc-details" id="details-doc-${index}">
                    <div class="details-content">
                        <div class="details-section">
                            <div class="details-title">General Information</div>
                            <div class="details-grid">
                                ${renderDetailRecord('Document Type', doc.typeLabel)}
                                ${renderDetailRecord('Originating Office', doc.originatingOffice)}
                                ${renderDetailRecord('Current Stage', doc.currentStage)}
                                ${renderDetailRecord('Stage Owner', doc.stageOwner)}
                                ${renderDetailRecord('Submitted Date', formatDate(doc.submittedDate))}
                                ${renderDetailRecord('Due Date', formatDate(doc.dueDate))}
                                ${renderDetailRecord('Last Updated', formatDate(doc.lastUpdated))}
                                ${renderDetailRecord('Submitted By', doc.submittedBy)}
                                ${renderDetailRecord('Current Version', doc.currentVersion)}
                                ${renderDetailRecord('Status', doc.statusLabel)}
                            </div>
                        </div>
                        <div class="details-section">
                            <div class="details-title">Summary</div>
                            <div class="summary-panel">${doc.summary}</div>
                        </div>
                        <div class="details-actions">
                            <a class="review-doc-btn" href="#active-reviews" onclick="window.openDocumentReview(event, '${encodeURIComponent(doc.id)}')">Review Document</a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('') : `
            <div class="doc-card">
                <div class="doc-main">
                    <div class="doc-info">
                        <div class="doc-title">No documents match the current filters.</div>
                    </div>
                </div>
            </div>
        `;
    };

    [statusFilter, typeFilter, officeFilter, dateFilter].forEach(el => {
        el.onchange = renderDocuments;
    });
    sortFilter.onclick = () => {
        const nextOrder = sortFilter.dataset.sortOrder === 'oldest' ? 'newest' : 'oldest';
        sortFilter.dataset.sortOrder = nextOrder;
        sortFilter.title = nextOrder === 'oldest' ? 'Sort: Oldest First' : 'Sort: Newest First';
        sortFilter.setAttribute('aria-label', nextOrder === 'oldest' ? 'Sort documents oldest first' : 'Sort documents newest first');
        renderDocuments();
    };
    search.oninput = renderDocuments;
    searchButton.onclick = renderDocuments;

    renderStats();
    renderDocuments();
}

window.toggleDocumentLibraryDetails = (event, suffix) => {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const details = document.getElementById('details-doc-' + suffix);
    const button = document.getElementById('btn-doc-' + suffix);
    if (!details || !button) {
        return;
    }
    const willExpand = !details.classList.contains('expanded');
    details.classList.toggle('expanded', willExpand);
    button.classList.toggle('expanded', willExpand);
    details.style.maxHeight = willExpand ? `${details.scrollHeight || 420}px` : '0px';
};

window.openDocumentReview = (event, encodedDocId) => {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const targetHref = `Active-Reviews.html?doc=${encodedDocId}`;
    if (typeof window.navigateFRN === 'function') {
        window.navigateFRN('active-reviews', targetHref);
    } else {
        window.location.href = targetHref;
    }
};

/* ─── Main navigate function ─────────────────────────────────────────────── */
async function navigate(route, targetHref = null) {
    const file = targetHref || ROUTES[route];
    if (!file) {
        showError(route, `No route registered for "${route}".`);
        return;
    }

    if (route === 'admin-relay' && !isRelayAdminUser()) {
        showError(route, 'This page is only available to the relay administrator.');
        return;
    }

    if (route === 'document-review') {
        const currentQuery = targetHref && targetHref.includes('?') ? targetHref.slice(targetHref.indexOf('?')) : '';
        const redirectedHref = `Active-Reviews.html${currentQuery}`;
        navigate('active-reviews', redirectedHref);
        return;
    }

    showLoading();
    setActiveNav(route);

    try {
        window.__FRN_CURRENT_PAGE_HREF = file;
        window.__FRN_CURRENT_PAGE_QUERY = file.includes('?') ? file.slice(file.indexOf('?')) : '';

        const manifest = window.FRN_PAGE_MANIFEST || {};
        const manifestKey = file.split('?')[0];
        let htmlText = manifest[manifestKey];

        if (!htmlText) {
            const cacheBustedFile = `${file}${file.includes('?') ? '&' : '?'}_ts=${Date.now()}`;
            const resp = await fetch(cacheBustedFile, { cache: 'no-store' });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            htmlText = await resp.text();
        }

        // Parse the fetched HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // ── Collect page-specific styles ──
        const styleBlocks = [...doc.querySelectorAll('head style')].map(s => s.textContent);
        injectPageStyles(styleBlocks);

        // Collect scripts before moving nodes out of the fetched document.
        const scripts = [...doc.querySelectorAll('body script')]
            .map(s => s.textContent)
            .filter(Boolean);

        // ── Extract content regions ──
        const contentWrapper = doc.querySelector('.content-wrapper');

        // Build the app fragment
        const appDiv = document.getElementById('app');
        appDiv.innerHTML = '';

        if (contentWrapper) {
            appDiv.appendChild(document.adoptNode(contentWrapper));
        } else {
            // Fallback: grab everything inside <body> after <nav>
            const bodyContent = doc.body;
            const navEl = bodyContent.querySelector('nav.left-sidebar');
            if (navEl) navEl.remove();
            appDiv.innerHTML = bodyContent.innerHTML;
        }

        // Fix internal page links (e.g. href="dashboard.html" → data-route="dashboard")
        appDiv.querySelectorAll('a[href*=".html"]').forEach(a => {
            const href = a.getAttribute('href');
            const routeKey = hrefToRoute(href);
            if (routeKey) {
                a.href = '#' + routeKey;
                a.dataset.internalLink = routeKey;
                a.dataset.internalHref = href;
            }
        });

        runPageScripts(scripts);

        if (route === 'document-library') {
            renderDocumentLibraryPage();
        }

        // Update URL hash without triggering popstate
        if (location.hash !== '#' + route || !history.state || history.state.href !== file) {
            history.pushState({ route, href: file }, '', '#' + route);
        }

    } catch (err) {
        console.error('[Router] Failed to load page:', route, err);
        showError(route, err.message);
    } finally {
        hideLoading();
    }
}

/* ─── Map an .html href to a route key ──────────────────────────────────── */
function hrefToRoute(href) {
    const fileMap = {
        'dashboard.html':         'dashboard',
        'new-notice.html':        'new-notice',
        'update-notice.html':     'update-notice',
        'DocumentLibrary.html':   'document-library',
        'DocumentReview.html':    'document-review',
        'my-tasks.html':          'my-tasks',
        'active-reviews.html':    'active-reviews',
        'Active-Reviews.html':    'active-reviews',
        'Active Reviews.html':    'active-reviews',
        'Active_Reviews.html':    'active-reviews',
        'pending-approvals.html': 'pending-approvals',
        'analytics.html':         'analytics',
        'calendar.html':          'calendar',
        'leaderboards.html':      'leaderboards',
        'team.html':              'team',
        'reports.html':           'reports',
        'settings.html':          'settings',
        'admin-relay.html':       'admin-relay',
        'notifications-escalations.html': 'notifications-escalations',
        'help.html':              'help',
    };
    const filename = href.split('/').pop().split('?')[0];
    return fileMap[filename] || null;
}

/* ─── Show error state ───────────────────────────────────────────────────── */
function showError(route, message) {
    document.getElementById('page-styles').innerHTML = '';
    document.getElementById('app').innerHTML = `
        <div class="page-error">
            <h2>Page Not Found</h2>
            <p><strong>${route}</strong> could not be loaded.</p>
            <p style="color:var(--gray); font-size:0.9rem;">${message}</p>
            <p style="margin-top:1.5rem;">
                <a href="#dashboard" style="color:var(--navy); font-weight:700;">← Return to Dashboard</a>
            </p>
        </div>
    `;
}

/* ─── Wire up nav clicks ─────────────────────────────────────────────────── */
document.querySelectorAll('.nav-item[data-route]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        navigate(a.dataset.route);
    });
});

// Expose router navigation for page-level actions inside injected screens.
window.navigateFRN = (route, href = null) => navigate(route, href);

/* ─── Wire up internal page links (delegated — catches dynamically loaded links) */
document.getElementById('app').addEventListener('click', e => {
    const link = e.target.closest('a[data-internal-link]');
    if (link) {
        e.preventDefault();
        navigate(link.dataset.internalLink, link.dataset.internalHref || null);
    }
});

/* ─── Handle browser back / forward ─────────────────────────────────────── */
window.addEventListener('popstate', e => {
    const route = (e.state && e.state.route) || getRouteFromHash();
    const href = e.state && e.state.href;
    navigate(route, href || null);
});

/* ─── Utility: read route from URL hash ─────────────────────────────────── */
function getRouteFromHash() {
    const hash = location.hash.replace('#', '').split('?')[0].trim();
    return ROUTES[hash] ? hash : DEFAULT_ROUTE;
}

/* ─── Initial page load ──────────────────────────────────────────────────── */
window.FRN_HOST_CONTEXT_PROMISE
    .catch(() => null)
    .finally(() => {
        navigate(getRouteFromHash());
    });
