const time = document.querySelector('#clock-time');
const date = document.querySelector('#clock-date');
const timeZone = 'America/New_York';

const timeFormat = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
});

const dateFormat = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
});

function updateClock() {
    const now = new Date();
    time.textContent = timeFormat.format(now);
    time.dateTime = now.toISOString();
    date.textContent = dateFormat.format(now);
    date.dateTime = now.toLocaleDateString('sv-SE', { timeZone });
}

updateClock();
document.querySelector('.clock').hidden = false;
setInterval(updateClock, 1000);
