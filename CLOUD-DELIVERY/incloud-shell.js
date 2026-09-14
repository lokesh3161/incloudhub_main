/**
 * MEDHAS — Global Application Shell & Intro Engine
 * Brand: MEDHAS (Your first year, figured out.)
 */

// Global Searchable Resource Index across Academics, AI Hub, and Career
const ICH_SEARCH_INDEX = [
    // --- ACADEMICS: 1ST YEAR SUBJECTS ---
    { id: "1styearmaths", title: "Mathematics", category: "Academics", url: "1styearmaths.html", icon: "📐", meta: "Matrices, Calculus, Vectors & Differential Equations • 1st Year Core" },
    { id: "1styearphysics", title: "Applied Physics", category: "Academics", url: "1styearphysics.html", icon: "⚛️", meta: "Optics, Quantum Mechanics & Lasers • 1st Year Core" },
    { id: "1styearchemistry", title: "Engineering Chemistry", category: "Academics", url: "1styearchemistry.html", icon: "🧪", meta: "Polymers, Water Tech & Electrochemistry • 1st Year Core" },
    { id: "1styearbeee", title: "BEEE — Basic Electrical & Electronics", category: "Academics", url: "1styearbeee.html", icon: "⚡", meta: "AC/DC Circuits, Machines & Semiconductor Diodes • 1st Year Core" },
    { id: "1styearclanguage", title: "C Programming", category: "Academics", url: "1styearclanguage.html", icon: "💻", meta: "Pointers, Structures, Arrays & Functions • 1st Year Core" },
    { id: "1styeardatastructures", title: "Data Structures & Algorithms", category: "Academics", url: "1styeardatastructures.html", icon: "🌳", meta: "Linked Lists, Stacks, Queues, Trees & Graphs • 1st Year Core" },
    { id: "1styearenglish", title: "Communicative English", category: "Academics", url: "1styearenglish.html", icon: "📖", meta: "Grammar, Technical Vocabulary & Report Writing • 1st Year Core" },
    { id: "1styearbcme", title: "BCME — Basic Civil & Mechanical", category: "Academics", url: "1styearbcme.html", icon: "🏗️", meta: "Surveying, Materials & IC Engines • 1st Year Core" },
    { id: "first-year", title: "1st Year Academics Hub", category: "Academics", url: "first-year.html", icon: "📚", meta: "1st Year Core Subjects, Notes & Question Papers" },
    { id: "select-year", title: "All Academic Years", category: "Academics", url: "select-year.html", icon: "🎓", meta: "1st, 2nd, 3rd, 4th Year Curriculum Directory" },

    // --- AI HUB: TASK SHORTCUTS & TOOLS ---
    { id: "ai-concept", title: "AI: Concept Simplifier", category: "AI Tools", url: "ai-hub.html?task=study", icon: "🧠", meta: "Explain complex engineering topics with simple analogies (NotebookLM / Claude)" },
    { id: "ai-debug", title: "AI: Code Debugger & Explainer", category: "AI Tools", url: "ai-hub.html?task=coding", icon: "🐛", meta: "Find bugs, dry-run algorithms & explain syntax errors (ChatGPT / Claude)" },
    { id: "ai-exam", title: "AI: 10-Mark Exam Question Generator", category: "AI Tools", url: "ai-hub.html?task=study", icon: "📝", meta: "Generate probable university exam questions from syllabus (ChatGPT / Gemini)" },
    { id: "ai-notes", title: "AI: Lecture Notes Summarizer", category: "AI Tools", url: "ai-hub.html?task=study", icon: "📑", meta: "Condense long textbook chapters into crisp bullet points (NotebookLM)" },
    { id: "ai-research", title: "AI: Literature & Topic Explorer", category: "AI Tools", url: "ai-hub.html?task=research", icon: "🔍", meta: "Explore research topics & paper summaries with citations (Perplexity)" },
    { id: "ai-presentation", title: "AI: Presentation Slide Outliner", category: "AI Tools", url: "ai-hub.html?task=presentations", icon: "📊", meta: "Draft 5-minute technical seminar presentations (ChatGPT / Claude)" },
    { id: "ai-hub-main", title: "MEDHAS AI Hub — Task Directory", category: "AI Tools", url: "ai-hub.html", icon: "🤖", meta: "Explore all AI tasks for Study, Coding, Writing & Research" },

    // --- CAREER: LINKEDIN STARTER TEMPLATES ---
    { id: "career-headline", title: "Career: LinkedIn Headline Builder", category: "Career", url: "career.html#headline", icon: "💼", meta: "Craft a high-converting first-year engineering headline" },
    { id: "career-about", title: "Career: About Section Narrative", category: "Career", url: "career.html#about", icon: "✍️", meta: "Write a compelling bio highlighting your curiosity & tech focus" },
    { id: "career-firstpost", title: "Career: First LinkedIn Post Template", category: "Career", url: "career.html#first-post", icon: "🚀", meta: "Introduce yourself, your college journey & learning goals" },
    { id: "career-networking", title: "Career: Senior Outreach Message", category: "Career", url: "career.html#networking", icon: "🤝", meta: "Polite message template to connect with seniors & alumni" },
    { id: "career-project", title: "Career: Project Showcase Template", category: "Career", url: "career.html#project", icon: "🛠️", meta: "Turn your mini-project or code repo into a professional post" },
    { id: "career-main", title: "MEDHAS Career & LinkedIn Starter", category: "Career", url: "career.html", icon: "🌟", meta: "Build your professional identity from your first year" },

    // --- UTILITIES ---
    { id: "attendance", title: "Attendance & Bunk Calculator", category: "Utilities", url: "attendance.html", icon: "📊", meta: "Calculate 75% eligibility & safe leaves" },
    { id: "profile", title: "Student Profile & Session", category: "Utilities", url: "profile.html", icon: "👤", meta: "View enrolled department, registration details & settings" }
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
 * Global Copy-to-Clipboard with Toast Notification
 */
window.copyToClipboard = function(text, btnElement, feedbackMsg = 'Copied!') {
    if (!text) return;
    
    // Immediate UI feedback
    showToast(feedbackMsg);
    if (btnElement) {
        const originalText = btnElement.innerHTML;
        btnElement.classList.add('copied');
        btnElement.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> <span>${feedbackMsg}</span>`;
        setTimeout(() => {
            btnElement.classList.remove('copied');
            btnElement.innerHTML = originalText;
        }, 2000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {
            // Fallback for non-secure / headless contexts
            try {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            } catch(e) {}
        });
    } else {
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        } catch(e) {}
    }
};

function showToast(message) {
    let toast = document.getElementById('medhas-global-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'medhas-global-toast';
        toast.className = 'medhas-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2400);
}

/**
 * MEDHAS Application Shell Navigation
 */
function renderGlobalNav(activePage = 'home') {
    const user = typeof getAuthSession === 'function' ? getAuthSession() : null;
    const userName = user && user.name ? user.name : 'Student';
    const userBranch = user && user.branch ? user.branch : 'Campus';
    const userInitial = userName.charAt(0).toUpperCase();

    const navHTML = `
    <nav class="ich-navbar" id="ich-global-nav">
        <div class="ich-container ich-nav-inner">
            <a href="home.html" class="ich-brand" title="MEDHAS — Your first year, figured out.">
                <div class="ich-brand-logo">M</div>
                <div class="ich-brand-text">MED<span>HAS</span></div>
                <span class="ich-brand-badge">FIRST-YEAR HUB</span>
            </a>

            <div class="ich-nav-links">
                <a href="home.html" class="ich-nav-item ${activePage === 'home' ? 'active' : ''}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    Home
                </a>
                <a href="first-year.html" class="ich-nav-item ${activePage === 'academics' ? 'active' : ''}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
                    Academics
                </a>
                <a href="ai-hub.html" class="ich-nav-item ${activePage === 'ai' ? 'active' : ''}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="M2 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="M12 22v-4"/><path d="m19.07 19.07-2.83-2.83"/><path d="M22 12h-4"/><path d="m19.07 4.93-2.83 2.83"/></svg>
                    AI Hub
                </a>
                <a href="career.html" class="ich-nav-item ${activePage === 'career' ? 'active' : ''}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    Career
                </a>
            </div>

            <div class="ich-nav-actions">
                <button class="ich-search-trigger" onclick="openSearchModal()" title="Search (Ctrl+K)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <span>Search notes, AI tools, career...</span>
                    <span class="ich-kbd">⌘K</span>
                </button>

                <a href="profile.html" class="ich-user-pill ${activePage === 'profile' ? 'active-profile' : ''}" title="View Student Profile">
                    <div class="ich-user-avatar">${userInitial}</div>
                    <div class="ich-user-details">
                        <span class="ich-user-name">${userName}</span>
                        <span class="ich-user-meta">${userBranch}</span>
                    </div>
                </a>
            </div>
        </div>
    </nav>

    <!-- Mobile Bottom Navigation Bar (5-Pillar Touch Targets) -->
    <div class="ich-mobile-bottom-nav">
        <a href="home.html" class="ich-mobile-nav-item ${activePage === 'home' ? 'active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Home</span>
        </a>
        <a href="first-year.html" class="ich-mobile-nav-item ${activePage === 'academics' ? 'active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
            <span>Academics</span>
        </a>
        <a href="ai-hub.html" class="ich-mobile-nav-item ${activePage === 'ai' ? 'active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/></svg>
            <span>AI Hub</span>
        </a>
        <a href="career.html" class="ich-mobile-nav-item ${activePage === 'career' ? 'active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            <span>Career</span>
        </a>
        <a href="profile.html" class="ich-mobile-nav-item ${activePage === 'profile' ? 'active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Profile</span>
        </a>
    </div>

    <!-- Global Command Search Modal -->
    <div class="ich-modal-backdrop" id="ich-search-modal" onclick="if(event.target === this) closeSearchModal()">
        <div class="ich-search-modal">
            <div class="ich-search-input-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ich-primary)" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" id="ich-search-field" class="ich-search-input" placeholder="Search notes, subjects, AI tasks, LinkedIn prompts..." oninput="handleSearchQuery(this.value)" autocomplete="off">
                <button class="ich-btn ich-btn-ghost ich-btn-sm" onclick="closeSearchModal()">Esc</button>
            </div>
            <div class="ich-search-filter-chips">
                <button class="ich-search-chip active" onclick="setSearchFilter('all', this)">All</button>
                <button class="ich-search-chip" onclick="setSearchFilter('Academics', this)">Academics</button>
                <button class="ich-search-chip" onclick="setSearchFilter('AI Tools', this)">AI Hub</button>
                <button class="ich-search-chip" onclick="setSearchFilter('Career', this)">Career</button>
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
            <div style="font-weight: 800; color: #FFF; margin-bottom: 4px; letter-spacing: 0.05em;">MEDHAS — Your first year, figured out.</div>
            <div style="color: var(--ich-text-secondary); font-size: 0.88rem; margin-bottom: 12px;">Academics • AI Productivity • Career Starter for First-Year Engineering Students</div>
            <div class="ich-footer-links">
                <a href="home.html">Home</a>
                <a href="first-year.html">Academics</a>
                <a href="ai-hub.html">AI Hub</a>
                <a href="career.html">Career</a>
                <a href="attendance.html">Attendance</a>
                <a href="profile.html">Profile</a>
                <a href="admin.html">Faculty Upload</a>
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
                <div style="font-weight: 600; color: #FFF; margin-bottom: 4px;">No matching results found</div>
                <div style="font-size: 0.85rem; color: var(--ich-text-secondary);">Try searching for a subject like "Maths", "Data Structures", an AI task like "Debug code", or a LinkedIn prompt.</div>
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
            const badgeClass = catName === 'Academics' ? 'ich-badge-orange' : (catName === 'AI Tools' ? 'ich-badge-blue' : 'ich-badge-gray');
            html += `
                <a href="${item.url}" class="ich-search-result-item ${isSelected ? 'selected' : ''}" data-index="${globalIdx}" onclick="closeSearchModal()">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 1.3rem;">${item.icon || '📘'}</span>
                        <div>
                            <div class="ich-search-result-title">${highlightedTitle}</div>
                            <div class="ich-search-result-subtitle">${escapeHtml(item.meta)}</div>
                        </div>
                    </div>
                    <span class="ich-badge ${badgeClass}">${item.category}</span>
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
