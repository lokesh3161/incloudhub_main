const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyam1LPuzycXTwOj_4ANdSSWDWN7ofzNhFfqTHmmCoIqj8F-Ekdr0dgbE_QpcRzqawH/exec';

async function fetchNotesFromServer() {
    try {
        const res = await fetch(APPS_SCRIPT_URL + '?t=' + Date.now(), { redirect: 'follow' });
        if (!res.ok) throw new Error('Failed to fetch notes');
        const text = await res.text();
        console.log('Raw response:', text.substring(0, 200));
        const data = JSON.parse(text);
        return Array.isArray(data) ? data : null;
    } catch (err) {
        console.error('fetchNotesFromServer error:', err);
        return null;
    }
}

function getLinkClass() {
    const style = document.documentElement.innerHTML;
    if (style.includes('resource-link')) return 'resource-link';
    if (style.includes('file-link')) return 'file-link';
    return 'note-link';
}

function renderSubjectNotes(notes, subject) {
    const filtered = notes.filter(n => {
        const s = String(n.subject || '').trim().toLowerCase();
        const t = String(subject || '').trim().toLowerCase();
        return s === t;
    });
    const ul = document.querySelector('ul');
    const linkClass = getLinkClass();
    ul.innerHTML = '';
    if (filtered.length === 0) {
        ul.innerHTML = '<li style="color:#888;text-align:center;padding:20px;">No notes added yet.</li>';
        return;
    }
    filtered.forEach(n => {
        const li = document.createElement('li');
        li.innerHTML = `<a class="${linkClass}" href="${n.link}" target="_blank">${n.icon || '📄'} ${n.title}${n.unit ? ' – ' + n.unit : ''}</a>`;
        ul.appendChild(li);
    });
}

async function loadDynamicNotes(subject) {
    const ul = document.querySelector('ul');
    ul.innerHTML = '<li style="color:#888;text-align:center;padding:20px;">Loading...</li>';
    
    console.log('Fetching notes for subject:', subject);
    
    let notes = await fetchNotesFromServer();
    
    console.log('Notes received:', notes);
    
    if (!notes) {
        ul.innerHTML = '<li style="color:#ff6b6b;text-align:center;padding:20px;">Failed to load notes. Please refresh.</li>';
        return;
    }
    
    console.log('Filtered for subject:', notes.filter(n => String(n.subject).trim() === String(subject).trim()));
    
    renderSubjectNotes(notes, subject);
}
