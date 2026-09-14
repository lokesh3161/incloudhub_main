/**
 * InCloudHub V2 — Notes Client (Polished)
 * Resilient notes fetcher with Skeleton loaders, Unit Tabs & Auto Recents Registration.
 */

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbykSgV6Q6CncMUeV-4JSgv7Cck_2JxhEuwh6JXLplxMDy5PtRqEyqtPnDq-px6Dx_C1/exec';

let cachedSubjectNotes = [];
let currentSelectedUnit = 'all';

const SUBJECT_METADATA = {
    '1styearmaths': { name: 'Mathematics', icon: '📐', url: '1styearmaths.html' },
    '1styearphysics': { name: 'Applied Physics', icon: '⚛️', url: '1styearphysics.html' },
    '1styearchemistry': { name: 'Engineering Chemistry', icon: '🧪', url: '1styearchemistry.html' },
    '1styearbeee': { name: 'BEEE', icon: '⚡', url: '1styearbeee.html' },
    '1styearclanguage': { name: 'C Programming', icon: '💻', url: '1styearclanguage.html' },
    '1styeardatastructures': { name: 'Data Structures', icon: '🌳', url: '1styeardatastructures.html' },
    '1styearenglish': { name: 'Communicative English', icon: '📖', url: '1styearenglish.html' },
    '1styearbcme': { name: 'BCME', icon: '🏗️', url: '1styearbcme.html' }
};

async function fetchNotesFromServer() {
    try {
        const res = await fetch(APPS_SCRIPT_URL + '?t=' + Date.now(), { redirect: 'follow' });
        if (!res.ok) throw new Error('Network response was not ok');
        const text = await res.text();
        const data = JSON.parse(text);
        return Array.isArray(data) ? data : null;
    } catch (err) {
        console.warn('Google Apps Script fetch error, checking fallback local data:', err);
        try {
            const localRes = await fetch('/notes');
            if (localRes.ok) {
                const localData = await localRes.json();
                if (Array.isArray(localData) && localData.length > 0) return localData;
            }
        } catch (localErr) {
            console.error('All fetch strategies exhausted:', localErr);
        }
        return null;
    }
}

function renderSkeletonLoading(container) {
    container.innerHTML = `
        <div class="ich-skeleton-card">
            <div class="ich-skeleton ich-skeleton-line" style="width: 60%;"></div>
            <div class="ich-skeleton ich-skeleton-line" style="width: 35%;"></div>
        </div>
        <div class="ich-skeleton-card">
            <div class="ich-skeleton ich-skeleton-line" style="width: 75%;"></div>
            <div class="ich-skeleton ich-skeleton-line" style="width: 40%;"></div>
        </div>
        <div class="ich-skeleton-card">
            <div class="ich-skeleton ich-skeleton-line" style="width: 50%;"></div>
            <div class="ich-skeleton ich-skeleton-line" style="width: 30%;"></div>
        </div>
    `;
}

function renderUnitTabs(notes, subject) {
    const tabsMount = document.getElementById('unit-tabs-mount');
    if (!tabsMount) return;

    const units = Array.from(new Set(notes.map(n => n.unit).filter(Boolean)));
    if (units.length <= 1) {
        tabsMount.innerHTML = '';
        return;
    }

    let html = `<div class="ich-unit-tabs">`;
    html += `<button class="ich-unit-tab ${currentSelectedUnit === 'all' ? 'active' : ''}" onclick="selectUnitFilter('all', '${subject}')">All Units (${notes.length})</button>`;
    units.forEach(u => {
        const count = notes.filter(n => n.unit === u).length;
        html += `<button class="ich-unit-tab ${currentSelectedUnit === u ? 'active' : ''}" onclick="selectUnitFilter('${escapeHtml(u)}', '${subject}')">${escapeHtml(u)} (${count})</button>`;
    });
    html += `</div>`;
    tabsMount.innerHTML = html;
}

function selectUnitFilter(unit, subject) {
    currentSelectedUnit = unit;
    renderSubjectNotes(cachedSubjectNotes, subject);
}

function renderSubjectNotes(notes, subject, searchQuery = '') {
    const listContainer = document.getElementById('notes-list-container') || document.querySelector('ul');
    if (!listContainer) return;

    let filtered = notes.filter(n => {
        const s = String(n.subject || '').trim().toLowerCase();
        const t = String(subject || '').trim().toLowerCase();
        return s === t;
    });

    renderUnitTabs(filtered, subject);

    if (currentSelectedUnit !== 'all') {
        filtered = filtered.filter(n => n.unit === currentSelectedUnit);
    }

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(n => 
            (n.title && n.title.toLowerCase().includes(q)) ||
            (n.unit && n.unit.toLowerCase().includes(q))
        );
    }

    if (filtered.length === 0) {
        listContainer.innerHTML = `
            <div class="ich-state-box">
                <div class="ich-state-icon">📚</div>
                <div class="ich-state-title">No resources found</div>
                <div class="ich-state-desc">No study materials match your selected unit or search term. Try selecting "All Units".</div>
                <button onclick="selectUnitFilter('all', '${subject}')" class="ich-btn ich-btn-secondary ich-btn-sm">Show All Units</button>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = filtered.map(n => {
        const unitBadge = n.unit ? `<span class="ich-badge ich-badge-orange">${escapeHtml(n.unit)}</span>` : '';
        const icon = n.icon || '📄';
        return `
            <div class="ich-card ich-card-elevated" style="margin-bottom: 12px; padding: 18px 22px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
                <div style="display: flex; align-items: center; gap: 14px; flex: 1;">
                    <div style="font-size: 1.6rem; min-width: 36px; text-align: center;">${icon}</div>
                    <div>
                        <div style="font-weight: 700; font-size: 1.05rem; color: #FFF; margin-bottom: 4px;">${escapeHtml(n.title)}</div>
                        <div style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--ich-text-muted);">
                            <span>Academic Resource</span>
                            ${unitBadge}
                        </div>
                    </div>
                </div>
                <a href="${escapeHtml(n.link)}" target="_blank" rel="noopener noreferrer" class="ich-btn ich-btn-primary ich-btn-sm" style="min-width: 120px;">
                    <span>Open Material</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                </a>
            </div>
        `;
    }).join('');
}

async function loadDynamicNotes(subject) {
    const listContainer = document.getElementById('notes-list-container') || document.querySelector('ul');
    if (!listContainer) return;

    // Auto-record in recent activity
    if (SUBJECT_METADATA[subject] && typeof recordRecentSubject === 'function') {
        const meta = SUBJECT_METADATA[subject];
        recordRecentSubject(subject, meta.name, meta.url, meta.icon);
    }

    renderSkeletonLoading(listContainer);
    
    const notes = await fetchNotesFromServer();
    
    if (!notes) {
        listContainer.innerHTML = `
            <div class="ich-state-box" style="border-color: rgba(239, 68, 68, 0.3);">
                <div class="ich-state-icon" style="color: var(--ich-danger);">⚠️</div>
                <div class="ich-state-title">Unable to load resources</div>
                <div class="ich-state-desc">There was a network timeout reaching the cloud server. Please check your connection and retry.</div>
                <button class="ich-btn ich-btn-primary ich-btn-sm" onclick="loadDynamicNotes('${subject}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                    Try Again
                </button>
            </div>
        `;
        return;
    }
    
    cachedSubjectNotes = notes;
    renderSubjectNotes(notes, subject);
}

function filterSubjectNotesLive(subject, query) {
    renderSubjectNotes(cachedSubjectNotes, subject, query);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
