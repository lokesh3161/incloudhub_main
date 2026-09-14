/**
 * MEDHAS — Global Application Shell & Intro Engine
 * Brand: MEDHAS (Learn. Think. Build.)
 */

// Global Searchable Resource Index
const ICH_SEARCH_INDEX = [
    { id: "1styearmaths", title: "Mathematics", category: "Academics", url: "1styearmaths.html", icon: "📐", meta: "Matrices, Calculus, Vectors & ODE • 1st Year" },
    { id: "1styearphysics", title: "Applied Physics", category: "Academics", url: "1styearphysics.html", icon: "⚛️", meta: "Optics, Quantum Mechanics & Lasers • 1st Year" },
    { id: "1styearchemistry", title: "Engineering Chemistry", category: "Academics", url: "1styearchemistry.html", icon: "🧪", meta: "Polymers, Water Tech & Electrochemistry • 1st Year" },
    { id: "1styearbeee", title: "BEEE — Basic Electrical", category: "Academics", url: "1styearbeee.html", icon: "⚡", meta: "AC/DC Circuits, Machines & Diodes • 1st Year" },
    { id: "1styearclanguage", title: "C Programming", category: "Academics", url: "1styearclanguage.html", icon: "💻", meta: "Pointers, Structures, Arrays & Functions • 1st Year" },
    { id: "1styeardatastructures", title: "Data Structures & Algorithms", category: "Academics", url: "1styeardatastructures.html", icon: "🌳", meta: "Linked Lists, Stacks, Queues, Trees & Graphs • 1st Year" },
    { id: "1styearenglish", title: "Communicative English", category: "Academics", url: "1styearenglish.html", icon: "📖", meta: "Grammar, Vocabulary & Report Writing • 1st Year" },
    { id: "1styearbcme", title: "BCME — Basic Civil & Mech", category: "Academics", url: "1styearbcme.html", icon: "🏗️", meta: "Surveying, Materials & IC Engines • 1st Year" },
    { id: "first-year", title: "1st Year All Subjects Hub", category: "Academics", url: "first-year.html", icon: "📚", meta: "Complete 1st Year Foundation Directory" },
    { id: "select-year", title: "Academic Year Selection", category: "Academics", url: "select-year.html", icon: "🎓", meta: "1st, 2nd, 3rd, 4th Year Curriculum" },
    { id: "dept-cse", title: "Computer Science (CSE)", category: "Departments", url: "select-year.html", icon: "💻", meta: "CSE Curriculum & Year Materials" },
    { id: "dept-aids", title: "AI & Data Science (AIDS)", category: "Departments", url: "select-year.html", icon: "⚛️", meta: "AIDS Curriculum & Year Materials" },
    { id: "dept-aiml", title: "AI & Machine Learning (AIML)", category: "Departments", url: "select-year.html", icon: "🤖", meta: "AIML Curriculum & Year Materials" },
    { id: "dept-ece", title: "Electronics (ECE)", category: "Departments", url: "select-year.html", icon: "📡", meta: "ECE Curriculum & Year Materials" },
    { id: "dept-it", title: "Information Technology (IT)", category: "Departments", url: "select-year.html", icon: "🌐", meta: "IT Curriculum & Year Materials" },
    { id: "dept-mech", title: "Mechanical Engineering (MECH)", category: "Departments", url: "select-year.html", icon: "⚙️", meta: "MECH Curriculum & Year Materials" },
    { id: "dept-civil", title: "Civil Engineering (CIVIL)", category: "Departments", url: "select-year.html", icon: "🏗️", meta: "CIVIL Curriculum & Year Materials" },
    { id: "dept-eee", title: "Electrical Engineering (EEE)", category: "Departments", url: "select-year.html", icon: "🔌", meta: "EEE Curriculum & Year Materials" },
    { id: "ai-hub", title: "MEDHAS AI Hub — Student Tools", category: "AI Tools", url: "ai-hub.html", icon: "🤖", meta: "NotebookLM, ChatGPT, Claude, Perplexity & v0" },
    { id: "attendance", title: "Attendance & Bunk Calculator", category: "Utilities", url: "attendance.html", icon: "📊", meta: "Track 75%/80% Eligibility & Safe Leaves" },
    { id: "admin", title: "MEDHAS Admin & Faculty Portal", category: "Utilities", url: "admin.html", icon: "🔐", meta: "Upload & Manage Notes for Students" }
];

let selectedSearchIndex = 0;
let currentSearchCategory = 'all';

// Client-Side Recents Tracker (localStorage)
function recordRecentSubject(subjectId, title, url, icon = '📘') {
    try {
        let recents = getRecentSubjects();
        recents = recents.filter(item => item.id !== subjectId);
        recents.unshift({ id: subjectId, title, url, icon, time: Date.now() });
        if (recents.length > 5) recents = recents.slice(0, 5);
        localStorage.setItem('medhas_recents', JSON.stringify(recents));
    } catch (e) {
        console.warn('Recents storage error:', e);
    }
}

function getRecentSubjects() {
    try {
        const raw = localStorage.getItem('medhas_recents') || localStorage.getItem('incloudhub_recents');
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

/**
 * MEDHAS Premium Intro Animation Initializer
 * Plays on first session entry (~1.8s) or on demand when forced.
 */
function initMedhasIntro(force = false) {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const urlParams = new URLSearchParams(window.location.search);
    const shouldForce = force || urlParams.has('intro') || urlParams.has('replay');

    // Check if intro has already played in this browser session
    if (!shouldForce && sessionStorage.getItem('medhas_intro_seen') === 'true') {
        return;
    }

    const existing = document.getElementById('medhas-intro-overlay');
    if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
    }

    const introHTML = `
    <div id="medhas-intro-overlay" role="presentation" aria-hidden="true">
        <div class="medhas-intro-content">
            <div class="medhas-core-symbol">
                <div class="medhas-orbit-ring"></div>
                <div class="medhas-orbit-ring-inner"></div>
                <div class="medhas-core-node">M</div>
            </div>
            <div class="medhas-intro-brand">
                MED<span>HAS</span>
            </div>
            <div class="medhas-intro-tagline">
                Learn. Think. Build.
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', introHTML);
    const overlay = document.getElementById('medhas-intro-overlay');

    sessionStorage.setItem('medhas_intro_seen', 'true');

    // Smooth transition out at ~1.8 seconds
    setTimeout(() => {
        if (overlay) {
            overlay.classList.add('medhas-intro-exit');
            setTimeout(() => {
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 500);
        }
    }, 1800);
}

// Global hook to manually replay intro animation anytime
window.replayMedhasIntro = function() {
    initMedhasIntro(true);
};

function renderGlobalNav(activePage = 'home') {
    const user = typeof getAuthSession === 'function' ? getAuthSession() : null;
    const userName = user && user.name ? user.name : 'Student';
    const userBranch = user && user.branch ? user.branch : 'Campus';
    const userInitial = userName.charAt(0).toUpperCase();

    const navHTML = `
    <nav class="ich-navbar" id="ich-global-nav">
        <div class="ich-container ich-nav-inner">
            <a href="home.html" class="ich-brand">
                <div class="ich-brand-logo">M</div>
                <div class="ich-brand-text">MED<span>HAS</span></div>
                <span class="ich-brand-badge">STUDENT HUB</span>
            </a>

            <div class="ich-nav-links">
                <a href="home.html" class="ich-nav-item ${activePage === 'home' ? 'active' : ''}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    Home
                </a>
                <a href="select-year.html" class="ich-nav-item ${activePage === 'academics' ? 'active' : ''}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
                    Academics
                </a>
                <a href="ai-hub.html" class="ich-nav-item ${activePage === 'ai' ? 'active' : ''}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="M2 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="M12 22v-4"/><path d="m19.07 19.07-2.83-2.83"/><path d="M22 12h-4"/><path d="m19.07 4.93-2.83 2.83"/><circle cx="12" cy="12" r="3"/></svg>
                    AI Hub
                </a>
                <a href="attendance.html" class="ich-nav-item ${activePage === 'attendance' ? 'active' : ''}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    Attendance
                </a>
            </div>

            <div class="ich-nav-actions">
                <button class="ich-search-trigger" onclick="openSearchModal()" title="Search (Ctrl+K)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <span>Search notes, subjects...</span>
                    <span class="ich-kbd">⌘K</span>
                </button>

                <div class="ich-user-pill">
                    <div class="ich-user-avatar">${userInitial}</div>
                    <div class="ich-user-details">
                        <span class="ich-user-name">${userName}</span>
                        <span class="ich-user-meta">${userBranch}</span>
                    </div>
                    <button class="ich-logout-btn" onclick="handleLogout()" title="Log out">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Mobile Bottom Navigation Bar -->
    <div class="ich-mobile-bottom-nav">
        <a href="home.html" class="ich-mobile-nav-item ${activePage === 'home' ? 'active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Home</span>
        </a>
        <a href="select-year.html" class="ich-mobile-nav-item ${activePage === 'academics' ? 'active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
            <span>Study</span>
        </a>
        <a href="ai-hub.html" class="ich-mobile-nav-item ${activePage === 'ai' ? 'active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/></svg>
            <span>AI Hub</span>
        </a>
        <a href="attendance.html" class="ich-mobile-nav-item ${activePage === 'attendance' ? 'active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            <span>Attendance</span>
        </a>
        <a href="javascript:void(0)" onclick="openSearchModal()" class="ich-mobile-nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span>Search</span>
        </a>
    </div>

    <!-- Enhanced Global Search Modal -->
    <div class="ich-modal-backdrop" id="ich-search-modal" onclick="if(event.target === this) closeSearchModal()">
        <div class="ich-search-modal">
            <div class="ich-search-input-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ich-primary)" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" id="ich-search-field" class="ich-search-input" placeholder="Search notes, subjects, papers, AI tools..." oninput="handleSearchQuery(this.value)" autocomplete="off">
                <button class="ich-btn ich-btn-ghost ich-btn-sm" onclick="closeSearchModal()">Esc</button>
            </div>
            <div class="ich-search-filter-chips">
                <button class="ich-search-chip active" onclick="setSearchFilter('all', this)">All</button>
                <button class="ich-search-chip" onclick="setSearchFilter('Academics', this)">Notes & Subjects</button>
                <button class="ich-search-chip" onclick="setSearchFilter('AI Tools', this)">AI Tools</button>
                <button class="ich-search-chip" onclick="setSearchFilter('Departments', this)">Departments</button>
                <button class="ich-search-chip" onclick="setSearchFilter('Utilities', this)">Utilities</button>
            </div>
            <div class="ich-search-results" id="ich-search-results-list">
                <!-- Search results rendered dynamically -->
            </div>
        </div>
    </div>
    `;

    const navContainer = document.getElementById('ich-nav-mount');
    if (navContainer) {
        navContainer.innerHTML = navHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', navHTML);
    }
}

function renderGlobalFooter(mountId = 'ich-footer-mount') {
    const footerHTML = `
    <footer class="ich-footer">
        <div class="ich-container">
            <div style="font-weight: 800; color: #FFF; margin-bottom: 4px; letter-spacing: 0.05em;">MEDHAS — Learn. Think. Build.</div>
            <div>Unified Campus Knowledge Platform • Designed for 1,800+ College Students</div>
            <div class="ich-footer-links">
                <a href="home.html">Dashboard</a>
                <a href="select-year.html">Academics</a>
                <a href="ai-hub.html">AI Hub</a>
                <a href="attendance.html">Attendance</a>
                <a href="admin.html">Faculty Portal</a>
                <a href="mailto:thanalalokesh5@gmail.com">Contact Support</a>
            </div>
        </div>
    </footer>
    `;
    const mount = document.getElementById(mountId);
    if (mount) mount.innerHTML = footerHTML;
}

function renderBreadcrumbs(crumbs, mountId = 'ich-breadcrumbs-mount') {
    if (!crumbs || !crumbs.length) return;
    let html = `<nav class="ich-breadcrumbs" aria-label="Breadcrumb">`;
    crumbs.forEach((crumb, idx) => {
        if (idx === crumbs.length - 1) {
            html += `<span class="ich-breadcrumb-current">${crumb.label}</span>`;
        } else {
            html += `<a href="${crumb.url}" class="ich-breadcrumb-link">${crumb.label}</a>`;
            html += `<span class="ich-breadcrumb-sep">/</span>`;
        }
    });
    html += `</nav>`;
    const mount = document.getElementById(mountId);
    if (mount) mount.innerHTML = html;
}

function handleLogout() {
    if (typeof clearAuthSession === 'function') {
        clearAuthSession();
    } else {
        sessionStorage.clear();
    }
    window.location.href = 'login.html';
}

function openSearchModal() {
    const modal = document.getElementById('ich-search-modal');
    if (modal) {
        modal.classList.add('open');
        const input = document.getElementById('ich-search-field');
        if (input) {
            input.value = '';
            input.focus();
            selectedSearchIndex = 0;
            handleSearchQuery('');
        }
    }
}

function closeSearchModal() {
    const modal = document.getElementById('ich-search-modal');
    if (modal) modal.classList.remove('open');
}

function setSearchFilter(cat, btn) {
    currentSearchCategory = cat;
    document.querySelectorAll('.ich-search-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const input = document.getElementById('ich-search-field');
    handleSearchQuery(input ? input.value : '');
}

function handleSearchQuery(query) {
    const container = document.getElementById('ich-search-results-list');
    if (!container) return;
    
    const q = (query || '').trim().toLowerCase();
    let pool = ICH_SEARCH_INDEX;
    if (currentSearchCategory !== 'all') {
        pool = pool.filter(item => item.category === currentSearchCategory);
    }

    let results = q ? pool.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q) || 
        item.meta.toLowerCase().includes(q)
    ) : pool;

    if (!q && currentSearchCategory === 'all') {
        const recents = getRecentSubjects();
        if (recents.length > 0) {
            let html = `<div class="ich-search-category-header">Recently Viewed</div>`;
            html += recents.map((item, idx) => `
                <a href="${item.url}" class="ich-search-result-item ${idx === selectedSearchIndex ? 'selected' : ''}" onclick="closeSearchModal()">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 1.3rem;">${item.icon || '📘'}</span>
                        <div>
                            <div class="ich-search-result-title">${escapeHtml(item.title)}</div>
                            <div class="ich-search-result-subtitle">Recent Activity</div>
                        </div>
                    </div>
                    <span class="ich-badge ich-badge-orange">Resume</span>
                </a>
            `).join('');
            html += `<div class="ich-search-category-header" style="margin-top: 10px;">Suggested Destinations</div>`;
            html += pool.slice(0, 4).map((item, idx) => `
                <a href="${item.url}" class="ich-search-result-item" onclick="closeSearchModal()">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 1.3rem;">${item.icon || '📘'}</span>
                        <div>
                            <div class="ich-search-result-title">${escapeHtml(item.title)}</div>
                            <div class="ich-search-result-subtitle">${escapeHtml(item.meta)}</div>
                        </div>
                    </div>
                    <span class="ich-badge ich-badge-gray">${item.category}</span>
                </a>
            `).join('');
            container.innerHTML = html;
            return;
        }
    }

    if (results.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 36px 12px; color: var(--ich-text-muted);">
                <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
                <div style="font-weight: 600; color: #FFF; margin-bottom: 4px;">No matching results</div>
                <div style="font-size: 0.85rem;">Try searching for a subject like "Maths", "Physics", or tool like "AI Hub"</div>
            </div>
        `;
        return;
    }

    const groups = {};
    results.forEach(item => {
        if (!groups[item.category]) groups[item.category] = [];
        groups[item.category].push(item);
    });

    let html = '';
    let globalIdx = 0;
    for (const [catName, items] of Object.entries(groups)) {
        html += `<div class="ich-search-category-header">${catName}</div>`;
        items.forEach(item => {
            const isSelected = globalIdx === selectedSearchIndex;
            const highlightedTitle = highlightMatch(item.title, q);
            html += `
                <a href="${item.url}" class="ich-search-result-item ${isSelected ? 'selected' : ''}" data-index="${globalIdx}" onclick="closeSearchModal()">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 1.3rem;">${item.icon || '📘'}</span>
                        <div>
                            <div class="ich-search-result-title">${highlightedTitle}</div>
                            <div class="ich-search-result-subtitle">${escapeHtml(item.meta)}</div>
                        </div>
                    </div>
                    <span class="ich-badge ${item.category === 'Academics' ? 'ich-badge-orange' : 'ich-badge-gray'}">${item.category}</span>
                </a>
            `;
            globalIdx++;
        });
    }

    container.innerHTML = html;
}

function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escaped.replace(regex, '<mark>$1</mark>');
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Global Keyboard Navigation
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('ich-search-modal');
    const isOpen = modal && modal.classList.contains('open');

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) closeSearchModal();
        else openSearchModal();
    } else if (e.key === 'Escape' && isOpen) {
        closeSearchModal();
    } else if (isOpen) {
        const items = document.querySelectorAll('.ich-search-result-item');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedSearchIndex = (selectedSearchIndex + 1) % items.length;
            updateSearchSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedSearchIndex = (selectedSearchIndex - 1 + items.length) % items.length;
            updateSearchSelection(items);
        } else if (e.key === 'Enter') {
            const selected = document.querySelector('.ich-search-result-item.selected');
            if (selected) {
                e.preventDefault();
                selected.click();
            }
        }
    }
});

function updateSearchSelection(items) {
    items.forEach((item, idx) => {
        item.classList.toggle('selected', idx === selectedSearchIndex);
        if (idx === selectedSearchIndex) {
            item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    });
}

// Automatically trigger intro if first visit in this session
window.addEventListener('DOMContentLoaded', () => {
    initMedhasIntro();
});
