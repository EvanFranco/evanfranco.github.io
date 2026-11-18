const chart = document.querySelector('.career-chart');
const slider = document.querySelector('#career-date');
const dateLabel = document.querySelector('#career-date-label');
const tracks = document.querySelector('.chart-tracks');
const yearScale = document.querySelector('.chart-years');
const entries = [...document.querySelectorAll('details[data-start]')];
const day = 86400000;
const firstDay = Date.parse(entries[0].dataset.start);
const easternDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/New_York' });
const today = Date.parse(easternDate.format(new Date()));
const todayStep = Math.max(1, Math.round((today - firstDay) / day));
const axisSteps = Math.ceil(todayStep * 1.04);
const formatDate = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric'
});
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let animation;

function percentage(date) {
    return 100 * (date - firstDay) / (day * axisSteps);
}

for (let year = new Date(firstDay).getUTCFullYear(); Date.UTC(year, 0, 1) <= today; year += 1) {
    const tick = document.createElement('span');
    tick.textContent = year;
    tick.style.left = percentage(Math.max(firstDay, Date.UTC(year, 0, 1))) + '%';
    yearScale.append(tick);
}

const rows = entries.map((entry, index) => {
    const { start, end, label } = entry.dataset;
    const startDate = Date.parse(start);
    const endDate = end ? Date.parse(end) : today;
    const row = document.createElement('div');
    row.className = 'chart-row';
    row.dataset.track = index;
    const link = document.createElement('a');
    link.className = 'chart-role';
    link.href = '#' + entry.id;
    const mark = entry.querySelector('.organization-mark').cloneNode(true);
    link.append(mark, document.createTextNode(label));
    const rail = document.createElement('div');
    rail.className = 'chart-rail';
    rail.setAttribute('aria-hidden', 'true');
    const bar = document.createElement('span');
    bar.className = 'chart-bar';
    bar.style.setProperty('--start', percentage(startDate) + '%');
    bar.style.setProperty('--length', Math.max(0, percentage(endDate) - percentage(startDate)) + '%');
    rail.append(bar);
    row.append(link, rail);
    tracks.append(row);
    return { row, entry, startDate, endDate };
});

function showDate(step) {
    const selected = firstDay + step * day;
    const label = step === todayStep ? 'Today · ' + formatDate.format(selected) : formatDate.format(selected);
    if (dateLabel.textContent !== label) dateLabel.textContent = label;
    slider.setAttribute('aria-valuetext', label);
    for (const item of rows) {
        item.row.classList.toggle('is-active', activeOn(item, selected));
    }
    updateSnapshot(selected);
}

function animateToDate(target, duration) {
    cancelAnimationFrame(animation);
    const initial = Number(slider.value);
    if (reducedMotion.matches || initial === target) {
        slider.value = target;
        showDate(target);
        return;
    }
    let started;
    function move(now) {
        started ??= now;
        const progress = Math.min((now - started) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        const step = Math.round(initial + (target - initial) * eased);
        slider.value = step;
        showDate(step);
        if (progress < 1) animation = requestAnimationFrame(move);
    }
    animation = requestAnimationFrame(move);
}

const snapshotTitle = document.querySelector('#snapshot-title');
const snapshotText = document.querySelector('#snapshot-text');
const snapshotItems = document.querySelector('#snapshot-items');
const monthFormat = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long', year: 'numeric' });

function activeOn(row, date) {
    return date >= row.startDate && date < row.endDate;
}

let snapshotKey;

function updateSnapshot(selected) {
    const date = new Date(selected);
    const month = date.getUTCMonth();
    const year = date.getUTCFullYear();
    const active = rows.filter(row => activeOn(row, selected));
    const key = [year, month, ...active.map(row => row.entry.id)].join(':');
    if (key === snapshotKey) return;
    snapshotKey = key;
    const inCollege = active.some(row => row.entry.id === 'uconn');
    const workCount = active.length - Number(inCollege);
    const firstMonth = month === 7 && year === 2022;
    const lastMonth = month === 4 && year === 2026;
    let intro;

    if (firstMonth) {
        intro = 'I was just starting computer science at UConn and figuring out my first college semester.';
    } else if (lastMonth) {
        intro = 'I was wrapping up my last semester at UConn, probably with finals and project deadlines sharing the calendar.';
    } else if (inCollege && month === 4) {
        intro = 'It was May at UConn, so I was probably studying for finals.';
    } else if (inCollege) {
        intro = workCount ? 'I was studying computer science at UConn alongside the roles below.' :
            'I was studying computer science at UConn.';
    } else if (workCount) {
        intro = 'College was behind me, and this was what I was working on.';
    } else {
        intro = 'There\u2019s no dated entry for this point in my timeline.';
    }
    if (workCount && inCollege && month === 4) {
        intro += ' I was also juggling ' + workCount + (workCount === 1 ? ' role.' : ' roles.');
    }

    snapshotTitle.textContent = monthFormat.format(date);
    snapshotText.textContent = intro;
    snapshotItems.replaceChildren();
    for (const { entry, row } of active) {
        const item = document.createElement('li');
        item.dataset.track = row.dataset.track;
        const link = document.createElement('a');
        link.href = '#' + entry.id;
        link.textContent = entry.querySelector('summary strong').textContent;
        const period = document.createElement('span');
        period.textContent = entry.querySelector('.role-date').textContent;
        item.append(link, period);
        snapshotItems.append(item);
    }
}

function selectLuckyDate() {
    const current = Number(slider.value);
    const candidates = [];
    for (let step = 0; step <= todayStep; step += 1) {
        const date = firstDay + step * day;
        if (step !== current && rows.some(row => activeOn(row, date))) candidates.push(step);
    }
    const next = candidates[Math.floor(Math.random() * candidates.length)] ?? current;
    animateToDate(next, 750);
}

document.querySelector('#career-lucky').addEventListener('click', selectLuckyDate);

const gallery = document.querySelector('#experience-gallery');
const previous = document.querySelector('#gallery-prev');
const next = document.querySelector('#gallery-next');
const galleryPosition = document.querySelector('#gallery-position');
let frameIndex = 0;

function currentFrame() {
    return Math.min(entries.length - 1, Math.round(gallery.scrollLeft / (gallery.clientWidth || 1)));
}

function showFrame(index, smoothly = true) {
    frameIndex = Math.max(0, Math.min(entries.length - 1, index));
    entries[frameIndex].open = true;
    gallery.scrollTo({
        left: frameIndex * gallery.clientWidth,
        behavior: smoothly && !reducedMotion.matches ? 'smooth' : 'instant'
    });
    updateGalleryControls(frameIndex);
}

function updateGalleryControls(index) {
    const position = (index + 1) + ' / ' + entries.length;
    if (galleryPosition.textContent !== position) galleryPosition.textContent = position;
    previous.disabled = index === 0;
    next.disabled = index === entries.length - 1;
}

previous.addEventListener('click', () => showFrame(frameIndex - 1));
next.addEventListener('click', () => showFrame(frameIndex + 1));
gallery.addEventListener('scroll', () => updateGalleryControls(currentFrame()), { passive: true });
gallery.addEventListener('scrollend', () => { frameIndex = currentFrame(); });
gallery.addEventListener('pointerdown', () => { frameIndex = currentFrame(); });
gallery.addEventListener('keydown', event => {
    if (event.target !== gallery || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    showFrame(currentFrame() + (event.key === 'ArrowRight' ? 1 : -1));
});
updateGalleryControls(frameIndex);
document.querySelector('.gallery-buttons').hidden = false;

function openLinkedEntry() {
    const entry = entries.find(item => '#' + item.id === location.hash);
    if (!entry) return;
    showFrame(entries.indexOf(entry), false);
    entry.querySelector('summary').focus({ preventScroll: true });
}

document.querySelector('#career-today').addEventListener('click', () => animateToDate(todayStep, 1000));
slider.addEventListener('input', () => {
    cancelAnimationFrame(animation);
    showDate(Number(slider.value));
});
window.addEventListener('hashchange', openLinkedEntry);
document.querySelector('#careers').addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link && link.hash === location.hash) openLinkedEntry();
});
for (const logo of document.querySelectorAll('.organization-mark img')) {
    const reveal = () => { logo.hidden = false; };
    if (logo.complete && logo.naturalWidth > 0) reveal();
    else logo.addEventListener('load', reveal, { once: true });
}
slider.max = todayStep;
chart.hidden = false;
showDate(0);
animateToDate(todayStep, 1000);
openLinkedEntry();
