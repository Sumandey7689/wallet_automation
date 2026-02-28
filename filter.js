(async function () {
    let observer = null;
    let running = false;

    let autoItemInterval = null;
    let autoButtonInterval = null;
    let stopRowClicked = false;
    let balanceInterval = null;

    const PANEL_CLASS = 'amount-filter-panel';
    const TARGET_CLASS = 'x-buyList-list';

    let isAllowedUser = false;

    const stopSound = new Audio(
        "https://actions.google.com/sounds/v1/alarms/phone_alerts_and_rings.ogg"
    );
    stopSound.volume = 1;

    function playStopSound() {
        stopSound.currentTime = 0;
        stopSound.play().catch(() => {});
        setTimeout(() => {
            stopSound.pause();
            stopSound.currentTime = 0;
        }, 3000);
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement("script");
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    if (!window.firebase) {
        await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
        await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js");
    }

    if (!firebase.apps.length) {
        firebase.initializeApp({
            apiKey: "AIzaSyCI7WjTsCfYrFU0U38y84PvSE1ysoOmc68",
            projectId: "wallet-automation-a59da"
        });
    }

    async function updateUserBalance() {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const memberId = userInfo?.value?.memberId || userInfo?.value?.memberld;
            const balance = userInfo?.balance ?? userInfo?.value?.balance;

            if (!memberId || balance === undefined || balance === null) return;

            const snap = await firebase.firestore()
                .collection("members")
                .where("walletUserId", "==", String(memberId))
                .limit(1)
                .get();

            if (snap.empty) return;

            const doc = snap.docs[0];

            await firebase.firestore()
                .collection("members")
                .doc(doc.id)
                .update({
                    balance: Number(balance),
                    balanceUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });

        } catch {}
    }

    function startBalanceSync() {
        if (balanceInterval) return;
        updateUserBalance();
        balanceInterval = setInterval(updateUserBalance, 15000);
    }

    async function checkAllowedFromFirebase() {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const memberId = userInfo?.value?.memberId || userInfo?.value?.memberld;
            if (!memberId) return false;

            const snap = await firebase.firestore()
                .collection("members")
                .where("walletUserId", "==", String(memberId))
                .where("active", "==", true)
                .limit(1)
                .get();

            return !snap.empty;
        } catch {
            return false;
        }
    }

    function isTargetAvailable() {
        return document.querySelector(`.${TARGET_CLASS}`) !== null;
    }

    function updatePanelVisibility() {
        panel.style.display = isTargetAvailable() ? 'block' : 'none';
    }

    function filterAmount() {
        if (!isTargetAvailable()) {
            stopFilter(true);
            updatePanelVisibility();
            return;
        }

        const allowed = amountInput.value.trim();

        document.querySelectorAll(`.${TARGET_CLASS} *`).forEach(el => {
            if (el.closest(`.${PANEL_CLASS}`)) return;
            if (el.innerText?.includes('₹')) {
                el.style.display =
                    el.innerText.includes(`₹${allowed}`) &&
                    !el.innerText.includes(`₹${allowed}0`)
                        ? ''
                        : 'none';
            }
        });
    }

    function isVisible(el) {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.top < window.innerHeight && r.bottom > 0;
    }

    function startAutoItemClick() {
        if (autoItemInterval) return;
        autoItemInterval = setInterval(() => {
            const activeItem = document.querySelector('.item.active');
            if (activeItem) activeItem.click();
        }, 1300);
    }

    function startAutoButtonClick() {
        if (autoButtonInterval) return;
        autoButtonInterval = setInterval(() => {
            document.querySelectorAll('div.x-row.x-row-middle button')
                .forEach(btn => {
                    if (isVisible(btn)) btn.click();
                });
        }, 300);
    }

    function stopAutoClicks() {
        clearInterval(autoItemInterval);
        clearInterval(autoButtonInterval);
        autoItemInterval = null;
        autoButtonInterval = null;
    }

    function clickStopRowOnce() {
        if (stopRowClicked) return;
        stopRowClicked = true;

        let tries = 0;
        const timer = setInterval(() => {
            const el = document.querySelector('div.x-row.x-row-between.bgfreo');
            if (el) {
                el.click();
                clearInterval(timer);
            } else if (++tries >= 10) {
                clearInterval(timer);
            }
        }, 200);
    }

    function startFilter() {
        if (!isAllowedUser || running) return;
        if (!isTargetAvailable()) return;

        running = true;
        stopRowClicked = false;

        filterAmount();

        observer = new MutationObserver(filterAmount);
        observer.observe(document.body, { childList: true, subtree: true });

        statusText.textContent = 'Active';
        statusDot.style.background = '#22c55e';

        startAutoItemClick();
        startAutoButtonClick();
    }

    function stopFilter(isAuto = false) {
        if (!running) return;
        running = false;

        stopAutoClicks();
        if (observer) observer.disconnect();

        clickStopRowOnce();

        if (isAuto) playStopSound();

        statusText.textContent = 'Stopped';
        statusDot.style.background = '#ef4444';
    }

    const panel = document.createElement('div');
    panel.className = PANEL_CLASS;
    panel.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #fff;
        border-radius: 12px;
        padding: 14px;
        width: 220px;
        font-family: system-ui;
        box-shadow: 0 12px 28px rgba(0,0,0,.15);
        z-index: 999999;
        display: none;
    `;

    const header = document.createElement('div');
    header.textContent = 'AR Wallet';
    header.style.cssText = 'display:flex;justify-content:space-between;font-weight:600;margin-bottom:8px';

    const statusDot = document.createElement('span');
    statusDot.style.cssText = 'width:10px;height:10px;border-radius:50%;background:#ef4444';
    header.appendChild(statusDot);

    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.value = '1000';
    amountInput.style.cssText = `
        width:100%;
        padding:8px;
        margin-bottom:10px;
        border:1px solid #d1d5db;
        border-radius:6px;
        background:#fff;
        color:#111;
        font-size:14px;
    `;

    const btnWrap = document.createElement('div');
    btnWrap.style.cssText = 'display:flex;gap:8px';

    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start';
    startBtn.style.cssText = 'flex:1;background:#22c55e;color:#fff;border:none;padding:8px;border-radius:8px';

    const stopBtn = document.createElement('button');
    stopBtn.textContent = 'Stop';
    stopBtn.style.cssText = 'flex:1;background:#ef4444;color:#fff;border:none;padding:8px;border-radius:8px';

    const statusText = document.createElement('div');
    statusText.style.cssText = 'margin-top:10px;font-size:12px;text-align:center';

    isAllowedUser = await checkAllowedFromFirebase();
    startBalanceSync();

    statusText.textContent = isAllowedUser ? 'Stopped' : 'Access denied';

    startBtn.onclick = startFilter;
    stopBtn.onclick = () => stopFilter(false);

    btnWrap.append(startBtn, stopBtn);
    panel.append(header, amountInput, btnWrap, statusText);
    document.body.appendChild(panel);

    new MutationObserver(updatePanelVisibility)
        .observe(document.body, { childList: true, subtree: true });

    updatePanelVisibility();
})();
