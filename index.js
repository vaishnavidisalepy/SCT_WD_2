let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let resetBtn = document.getElementById('reset');
let lapBtn = document.getElementById('lap');
let hour = 0;
let minute = 0;
let second = 0;
let count = 0;
let laps = [];
let timer = false;
// Load stored laps from localStorage on start
function loadLapsFromStorage() {
    try {
        const stored = localStorage.getItem('laps');
        if (stored) {
            laps = JSON.parse(stored) || [];
            renderLaps();
        }
    } catch (e) {
        console.error('Failed to load laps from storage', e);
    }
}

function saveLapsToStorage() {
    try {
        localStorage.setItem('laps', JSON.stringify(laps));
    } catch (e) {
        console.error('Failed to save laps to storage', e);
    }
}

function renderLaps() {
    const lapList = document.getElementById('lapList');
    if (!lapList) return;
    lapList.innerHTML = '';
    laps.forEach((t, i) => {
        const li = document.createElement('li');
        li.textContent = `Lap ${i + 1} - ${t}`;
        lapList.appendChild(li);
    });
}

function clearStoredLaps() {
    laps = [];
    saveLapsToStorage();
    renderLaps();
}

function exportLaps() {
    if (!laps.length) return;
    const content = laps.map((t, i) => `Lap ${i+1},${t}`).join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'laps.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
startBtn.addEventListener('click', function () {
    timer = true;
    stopWatch();
});
stopBtn.addEventListener('click', function () {
    timer = false;
});
lapBtn.addEventListener('click', function () {
    if (timer) {
        recordLap();
    }
});
resetBtn.addEventListener('click', function () {
    timer = false;
    hour = 0;
    minute = 0;
    second = 0;
    count = 0;
    document.getElementById('hr').innerHTML = "00";
    document.getElementById('min').innerHTML = "00";
    document.getElementById('sec').innerHTML = "00";
    document.getElementById('count').innerHTML = "00";
    // keep stored laps unless user clears them explicitly
    const lapList = document.getElementById('lapList');
    if (lapList) lapList.innerHTML = '';
});

function stopWatch() {
    if (timer) {
        count++;

        if (count == 100) {
            second++;
            count = 0;
        }

        if (second == 60) {
            minute++;
            second = 0;
        }

        if (minute == 60) {
            hour++;
            minute = 0;
            second = 0;
        }

        let hrString = hour;
        let minString = minute;
        let secString = second;
        let countString = count;

        if (hour < 10) {
            hrString = "0" + hrString;
        }

        if (minute < 10) {
            minString = "0" + minString;
        }

        if (second < 10) {
            secString = "0" + secString;
        }

        if (count < 10) {
            countString = "0" + countString;
        }

        document.getElementById('hr').innerHTML = hrString;
        document.getElementById('min').innerHTML = minString;
        document.getElementById('sec').innerHTML = secString;
        document.getElementById('count').innerHTML = countString;
        setTimeout(stopWatch, 10);
    }
}

function recordLap() {
    const hr = hour < 10 ? '0' + hour : '' + hour;
    const min = minute < 10 ? '0' + minute : '' + minute;
    const sec = second < 10 ? '0' + second : '' + second;
    const cnt = count < 10 ? '0' + count : '' + count;
    const timeStr = hr + ':' + min + ':' + sec + '.' + cnt;
    laps.push(timeStr);
    const lapList = document.getElementById('lapList');
    if (lapList) {
        const li = document.createElement('li');
        li.textContent = `Lap ${laps.length} - ` + timeStr;
        lapList.appendChild(li);
    }
    saveLapsToStorage();
}

// Wire up control buttons after DOM
document.addEventListener('DOMContentLoaded', function () {
    loadLapsFromStorage();
    const clearBtn = document.getElementById('clearStored');
    if (clearBtn) clearBtn.addEventListener('click', clearStoredLaps);
    const exportBtn = document.getElementById('export');
    if (exportBtn) exportBtn.addEventListener('click', exportLaps);
});
