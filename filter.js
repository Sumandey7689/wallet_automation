(function () {
    let observer = null;
    let running = false;

    const PANEL_CLASS = 'amount-filter-panel';
    const TARGET_CLASS = 'x-buyList-list';

    /* 🔔 SOUND SETUP (ADDED) */
    const sound = new Audio("https://actions.google.com/sounds/v1/alarms/phone_alerts_and_rings.ogg");
    sound.loop = true;
    sound.volume = 1;

    function playAutoStopSound() {
        sound.currentTime = 0;
        sound.play().catch(() => {});
        setTimeout(() => {
            sound.pause();
            sound.currentTime = 0;
        }, 2000);
    }
    /* 🔔 END SOUND SETUP */

    function isTargetAvailable() {
        return document.querySelector(`.${TARGET_CLASS}`) !== null;
    }

    function updatePanelVisibility() {
        panel.style.display = isTargetAvailable() ? 'block' : 'none';
    }

    function getAllowedAmount() {
        return amountInput.value.trim();
    }

    function filterAmount() {
        if (!isTargetAvailable()) {
            stopFilter(true); // 👈 auto stop
            updatePanelVisibility();
            return;
        }

        const allowed = getAllowedAmount();

        document.querySelectorAll(`.${TARGET_CLASS} *`).forEach(el => {
            if (el.closest(`.${PANEL_CLASS}`)) return;

            if (el.innerText && el.innerText.includes('₹')) {
                if (
                    (el.innerText.includes(`₹${allowed}`) || el.innerText.includes(`₹ ${allowed}`)) &&
                    !el.innerText.includes(`₹${allowed}0`) &&
                    !el.innerText.includes(`₹ ${allowed}0`)
                ) {
                    el.style.display = '';
                } else if (el.innerText.match(/₹\s*\d+/)) {
                    el.style.display = 'none';
                }
            }
        });
    }

    function startFilter() {
        if (running) return;

        if (!isTargetAvailable()) {
            updatePanelVisibility();
            return;
        }

        running = true;

        filterAmount();

        observer = new MutationObserver(() => {
            updatePanelVisibility();
            filterAmount();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        statusText.textContent = 'Active';
        statusDot.style.background = '#22c55e';
    }

    function stopFilter(isAuto = false) {
        if (!running) return;
        running = false;

        if (observer) observer.disconnect();

        const target = document.querySelector(`.${TARGET_CLASS}`);
        if (target) {
            target.querySelectorAll('*').forEach(el => {
                if (el.closest(`.${PANEL_CLASS}`)) return;
                el.style.display = '';
            });
        }

        statusText.textContent = 'Stopped';
        statusDot.style.background = '#ef4444';

        /* 🔔 PLAY SOUND ONLY ON AUTO STOP */
        if (isAuto) {
            playAutoStopSound();
        }
    }

    const panel = document.createElement('div');
    panel.className = PANEL_CLASS;
    panel.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #ffffff;
        border-radius: 12px;
        padding: 14px;
        width: 200px;
        font-family: system-ui;
        box-shadow: 0 12px 28px rgba(0,0,0,0.15);
        z-index: 999999;
        display: none;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        font-weight: 600;
        font-size: 14px;
    `;
    header.textContent = 'AR Wallet';

    const statusDot = document.createElement('span');
    statusDot.style.cssText = `
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ef4444;
    `;
    header.appendChild(statusDot);

    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.value = '1000';
    amountInput.style.cssText = `
        width: 100%;
        padding: 6px 8px;
        margin-bottom: 10px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 13px;
    `;

    const btnWrap = document.createElement('div');
    btnWrap.style.cssText = `display: flex; gap: 8px;`;

    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start';
    startBtn.style.cssText = `
        flex: 1;
        background: #22c55e;
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 8px 0;
        font-size: 13px;
        cursor: pointer;
    `;

    const stopBtn = document.createElement('button');
    stopBtn.textContent = 'Stop';
    stopBtn.style.cssText = `
        flex: 1;
        background: #ef4444;
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 8px 0;
        font-size: 13px;
        cursor: pointer;
    `;

    const statusText = document.createElement('div');
    statusText.textContent = 'Stopped';
    statusText.style.cssText = `
        margin-top: 10px;
        font-size: 12px;
        text-align: center;
        color: #6b7280;
    `;

    startBtn.onclick = startFilter;
    stopBtn.onclick = () => stopFilter(false); // manual stop → no sound

    btnWrap.appendChild(startBtn);
    btnWrap.appendChild(stopBtn);

    panel.appendChild(header);
    panel.appendChild(amountInput);
    panel.appendChild(btnWrap);
    panel.appendChild(statusText);

    document.body.appendChild(panel);

    const globalObserver = new MutationObserver(updatePanelVisibility);
    globalObserver.observe(document.body, { childList: true, subtree: true });

    updatePanelVisibility();
})();

