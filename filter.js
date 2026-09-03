(async function () {

    // =========================
    // Cyber Panel Styles
    // =========================
    const style = document.createElement("style");
    style.innerHTML = `
    #cyberPanel{ 
        position:fixed; 
        right:20px; 
        bottom:20px; 
        width:280px; 
        z-index:999999; 
        background:rgba(10, 15, 31, 0.9); 
        border:1px solid #00f7ff33; 
        border-radius:16px; 
        backdrop-filter:blur(16px); 
        box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 15px #00f7ff22; 
        overflow:hidden; 
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
    } 
    
    .cyber-header{ 
        padding:10px 15px; 
        background:linear-gradient(90deg,#00f7ff15,#7a00ff15); 
        color:#00f7ff; 
        font-size: 11px;
        letter-spacing: 1px;
        font-weight:bold; 
        text-align:center; 
        cursor:move; 
        border-bottom:1px solid #00f7ff22; 
        user-select:none;
        text-transform: uppercase;
    } 
    
    .cyber-body{ 
        padding:15px; 
    } 
    
    .cyber-label{ 
        color:#8defff; 
        font-size:10px; 
        margin-bottom:6px; 
        display:block; 
        text-transform: uppercase;
        letter-spacing: 0.5px;
        opacity: 0.8;
    } 
    
    .cyber-input{ 
        width:100%; 
        box-sizing:border-box; 
        padding:8px 12px; 
        background:rgba(17, 24, 39, 0.5); 
        border:1px solid #00f7ff33; 
        border-radius:10px; 
        color:#fff; 
        font-size:14px; 
        outline:none; 
        transition: all 0.3s ease;
    } 
    
    .cyber-input:focus{ 
        border-color: #00f7ff88;
        box-shadow:0 0 12px #00f7ff33; 
    } 
    
    .cyber-buttons{ 
        display:flex; 
        gap:10px; 
        margin-top:12px; 
    } 
    
    .cyber-btn{ 
        flex:1; 
        border:none; 
        padding:8px; 
        border-radius:8px; 
        cursor:pointer; 
        font-size: 11px;
        font-weight:bold; 
        transition:all .2s ease; 
        text-transform: uppercase;
        letter-spacing: 0.5px;
    } 
    
    .start-btn{ 
        background:#00f7ff; 
        color:#000; 
    } 
    
    .start-btn:hover{ 
        transform:translateY(-1px); 
        box-shadow:0 0 12px #00f7ff88; 
    } 
    
    .stop-btn{ 
        background:rgba(255, 45, 85, 0.2); 
        color:#ff2d55; 
        border: 1px solid #ff2d5544;
    } 
    
    .stop-btn:hover{ 
        background:rgba(255, 45, 85, 0.3); 
        transform:translateY(-1px); 
        box-shadow:0 0 12px #ff2d5533; 
    } 
    
    .cyber-status{ 
        margin-top:12px; 
        background:rgba(17, 24, 39, 0.6); 
        border-radius:10px; 
        padding:8px 12px; 
        display: flex;
        align-items: center;
        justify-content: center;
        text-align:center; 
        color:#00ff95; 
        font-size:11px; 
        border:1px solid #00ff9533; 
        min-height: 36px;
        box-shadow: inset 0 0 5px #00ff9511;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        transition: all 0.3s ease;
    } 

    /* Toggle Switch Styles */
    .toggle-container {
        display: flex;
        background: #111827;
        border: 1px solid #00f7ff33;
        border-radius: 10px;
        margin-bottom: 12px;
        padding: 3px;
        gap: 3px;
    }

    .toggle-option {
        flex: 1;
        padding: 6px;
        text-align: center;
        color: #8defff;
        font-size: 11px;
        font-weight: bold;
        cursor: pointer;
        border-radius: 6px;
        transition: .3s;
        user-select: none;
    }

    .toggle-option.active {
        background: #00f7ff;
        color: #000;
        box-shadow: 0 0 8px #00f7ff66;
    }

    #overlay-status-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
    }

    #overlay-live-status {
        font-size: 18px;
        color: #00ff95;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 5px;
        text-shadow: 0 0 10px #00ff95aa;
    }
    `;
    document.head.appendChild(style);

    // =========================
    // Cyber Panel UI
    // =========================
    let overlay = document.getElementById("cyberOverlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "cyberOverlay";
        overlay.style.cssText = `
            position:fixed;
            inset:0;
            background:rgba(0,0,0,0.85);
            backdrop-filter:blur(12px);
            z-index:999998;
            display:none;
            align-items:center;
            justify-content:center;
            color:#00f7ff;
            font-family:Arial,sans-serif;
            text-shadow:0 0 10px #00f7ff;
        `;
        overlay.innerHTML = `
        <div id="overlay-status-container">
            <div id="overlay-live-status">INITIALIZING...</div>
            <h1 style="font-size:24px;letter-spacing:8px;margin:0;opacity:0.6;">SYSTEM ACTIVE</h1>
        </div>`;
        document.body.appendChild(overlay);
    }

    const overlayLiveStatus = document.getElementById("overlay-live-status");

    let panel = document.getElementById("cyberPanel");
    if (!panel) {
        panel = document.createElement("div");
        panel.id = "cyberPanel";
        panel.innerHTML = `
        <div class="cyber-header"> 
            ⚡ AUTO BUY PANEL 
        </div> 
    
        <div class="cyber-body"> 
            
            <label class="cyber-label"> 
                Payment Type 
            </label>
            <div class="toggle-container" id="orderTypeToggle">
                <div class="toggle-option active" data-value="1">UPI</div>
                <div class="toggle-option" data-value="2">BANK</div>
            </div>

            <label class="cyber-label"> 
                Amount 
            </label> 
    
            <input 
                type="text" 
                id="buyAmount" 
                class="cyber-input" 
                value="2000"
                min="1" 
                oninput="this.value=this.value.replace(/[^0-9]/g,'')"
            > 
    
            <div class="cyber-buttons"> 
                <button 
                    id="startBtn" 
                    class="cyber-btn start-btn" 
                > 
                    START 
                </button> 
    
                <button 
                    id="stopBtn" 
                    class="cyber-btn stop-btn" 
                > 
                    STOP 
                </button> 
            </div> 
    
            <div 
                class="cyber-status" 
                id="cyberStatus" 
            > 
                Ready 
            </div> 
    
        </div>`;
        document.body.appendChild(panel);
    }

    const statusEl = document.getElementById("cyberStatus");
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const amountInput = document.getElementById("buyAmount");
    const orderTypeToggle = document.getElementById("orderTypeToggle");

    let isRunning = false;
    let selectedOrderType = 1;
    let isPremiumMember = false;

    // Toggle logic
    orderTypeToggle.querySelectorAll(".toggle-option").forEach(opt => {
        opt.onclick = () => {
            orderTypeToggle.querySelector(".active").classList.remove("active");
            opt.classList.add("active");
            selectedOrderType = Number(opt.dataset.value);
            console.log("Selected Order Type:", selectedOrderType === 1 ? "UPI" : "BANK");
        };
    });

    function setStatus(msg) {
        console.log(msg);
        if (statusEl) {
            statusEl.innerText = msg;
            
            // Check for error or warning keywords
            const isError = /denied|not found|Error|Stopped|🔴/i.test(msg);
            const isSuccess = /SUCCESS|🟢/i.test(msg);
            
            if (isError) {
                statusEl.style.color = "#ff2d55";
                statusEl.style.borderColor = "#ff2d5544";
                statusEl.style.boxShadow = "inset 0 0 5px #ff2d5511";
            } else if (isSuccess) {
                statusEl.style.color = "#00ff95";
                statusEl.style.borderColor = "#00ff9544";
                statusEl.style.boxShadow = "inset 0 0 5px #00ff9511";
            } else {
                statusEl.style.color = "#00f7ff";
                statusEl.style.borderColor = "#00f7ff33";
                statusEl.style.boxShadow = "inset 0 0 5px #00f7ff11";
            }
        }
        if (overlayLiveStatus) {
            overlayLiveStatus.innerText = msg;
            const isError = /denied|not found|Error|Stopped|🔴/i.test(msg);
            overlayLiveStatus.style.color = isError ? "#ff2d55" : "#00ff95";
            overlayLiveStatus.style.textShadow = isError ? "0 0 10px #ff2d55aa" : "0 0 10px #00ff95aa";
        }
    }

    
    // =========================
    // FIREBASE
    // =========================

    async function loadScript(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement("script");
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    if (!window.firebase) {
        await loadScript(
            "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
        );

        await loadScript(
            "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"
        );
    }

    if (!firebase.apps.length) {
        firebase.initializeApp({
            apiKey: "AIzaSyCI7WjTsCfYrFU0U38y84PvSE1ysoOmc68",
            projectId: "wallet-automation-a59da"
        });
    }

    let balanceInterval = null;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // =========================
    // TOKEN FETCH
    // =========================
    let token = null;

    try {

        const userCheckResult = await checkAllowedFromFirebase();
        const isAllowedUser = userCheckResult.allowed;
        isPremiumMember = userCheckResult.isPremium;

        startBalanceSync();

        if (!isAllowedUser) {

            setStatus("Access denied");

            return;
        }

        // Initialize amount and button state
        function updateStartButtonState() {
            const amount = Number(amountInput.value);
            if (!isPremiumMember) {
                if (amount < 2000) {
                    startBtn.disabled = true;
                    startBtn.style.opacity = "0.5";
                    startBtn.style.cursor = "not-allowed";
                } else {
                    startBtn.disabled = false;
                    startBtn.style.opacity = "1";
                    startBtn.style.cursor = "pointer";
                }
            } else {
                startBtn.disabled = false;
                startBtn.style.opacity = "1";
                startBtn.style.cursor = "pointer";
            }
        }

        // Set default amount to 2000 for non-premium members
        if (!isPremiumMember) {
            amountInput.value = "2000";
        }

        // Add input listener to update button state
        amountInput.addEventListener('input', updateStartButtonState);

        // Initialize button state
        updateStartButtonState();

        const rawToken = localStorage.getItem("token");

        if (rawToken) {
            try {
                token = JSON.parse(rawToken)?.value || rawToken;
            } catch {
                token = rawToken;
            }
        }

        if (!token && window.token?.value) {
            token = window.token.value;
        }

    } catch (e) {
        console.log(e);
    }

    if (!token) {
        setStatus("Token not found");
        return;
    }

    // =========================
    // DEVICE CODE
    // =========================
    const deviceCode =
        localStorage.getItem("arb_device_code") ||
        crypto.randomUUID().replace(/-/g, "");

    localStorage.setItem("arb_device_code", deviceCode);

    const headers = {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json",
        "authorization": `Bearer ${token}`,
        "deviceId": "undefined",
        "deviceType": "3",
        "page": "Arb",
        "deviceCode": deviceCode
    };

    // =========================
    // BUTTON LOGIC
    // =========================
    startBtn.onclick = () => {
        if (isRunning) return;

        const amount = Number(amountInput.value);
        if (!amount) {
            setStatus("Enter amount");
            return;
        }

        if (!isPremiumMember && amount < 2000) {
            setStatus("Minimum order value is 2000");
            return;
        }

        isRunning = true;
        overlay.style.display = "flex";
        setStatus("🟢 Running | Amount ₹" + amount);
        runMainLoop(amount, selectedOrderType);
    };

    stopBtn.onclick = () => {
        isRunning = false;
        overlay.style.display = "none";
        setStatus("🔴 Stopped");
    };

    // =========================
    // DRAGGABLE LOGIC
    // =========================
    (function () {
        const header = panel.querySelector(".cyber-header");
        let drag = false;
        let x = 0;
        let y = 0;

        header.addEventListener("mousedown", e => {
            drag = true;
            x = e.clientX - panel.offsetLeft;
            y = e.clientY - panel.offsetTop;
        });

        document.addEventListener("mouseup", () => {
            drag = false;
        });

        document.addEventListener("mousemove", e => {
            if (!drag) return;
            panel.style.left = (e.clientX - x) + "px";
            panel.style.top = (e.clientY - y) + "px";
            panel.style.right = "auto";
            panel.style.bottom = "auto";
        });
    })();

    // =========================
    // MAIN LOOP
    // =========================
    async function runMainLoop(targetAmount, type) {
        while (isRunning) {

            try {

                const typeLabel = type === 1 ? "UPI" : "BANK";
                setStatus(`Checking ${typeLabel} orders for ₹${targetAmount}...`);

                const listRes = await fetch(
                    "https://apiweb.apiarbpay.com/ar-wallet/buyCenter/buyList", {
                        method: "POST",
                        headers,
                        body: JSON.stringify({
                            orderType: type,
                            pageNo: 1
                        })
                    }
                );

                const listData = await listRes.json();
                const orders = listData?.data?.list || [];

                if (!orders.length) {
                    setStatus("No orders found...");
                    await sleep(300);
                    continue;
                }

                const candidates = orders.filter(
                    item => Number(item.amount) === targetAmount
                );

                if (!candidates.length) {
                    setStatus(`Waiting for order ₹${targetAmount}`);
                    await sleep(300);
                    continue;
                }

                for (const order of candidates) {
                    if (!isRunning) break;

                    setStatus(`Trying ₹${order.amount}`);

                    const payload = {
                        amount: order.amount,
                        platformOrder: order.platformOrder,
                        payType: order.payType,
                        orderType: order.orderType
                    };

                    try {
                        const beforeBuyRes = await fetch(
                            "https://apiweb.apiarbpay.com/ar-wallet/buyCenter/beforeBuy", {
                                method: "POST",
                                headers,
                                body: JSON.stringify(payload)
                            }
                        );

                        const beforeBuyData = await beforeBuyRes.json();

                        if (beforeBuyData.code !== "1") {
                            continue;
                        }

                        const buyRes = await fetch(
                            "https://apiweb.apiarbpay.com/ar-wallet/buyCenter/buy", {
                                method: "POST",
                                headers,
                                body: JSON.stringify({
                                    amount: order.amount,
                                    platformOrder: order.platformOrder,
                                    payType: order.payType,
                                    orderType: order.orderType,
                                    buyBankCode: "paytm",
                                    buyerKycId: ""
                                })
                            }
                        );

                        const buyData = await buyRes.json();

                        if (buyData.code === "1" || buyData.msg === "Success") {
                            setStatus(`SUCCESS ₹${order.amount}`);
                            location.reload();
                            return;
                        }

                    } catch (err) {
                        console.error(err);
                    }
                }

                await sleep(300);

            } catch (e) {
                console.error(e);
                setStatus("Error. Retrying...");
                await sleep(500);
            }
        }
    }

    

    // =========================
    // BALANCE UPDATE
    // =========================

    async function updateUserBalance() {

        try {

            const userInfo = JSON.parse(
                localStorage.getItem("userInfo")
            );

            const memberId =
                userInfo?.value?.memberId ||
                userInfo?.value?.memberld;

            const balance =
                userInfo?.balance ?? userInfo?.value?.balance;

            if (
                !memberId ||
                balance === undefined ||
                balance === null
            ) {
                return;
            }

            const db = firebase.firestore();

            const snap = await db
                .collection("members")
                .where(
                    "walletUserId",
                    "==",
                    String(memberId)
                )
                .limit(1)
                .get();

            if (snap.empty) {
                return;
            }

            const doc = snap.docs[0];

            const docRef = db
                .collection("members")
                .doc(doc.id);

            const memberData = doc.data();

            const previousBalance = Number(
                memberData.balance ?? 0
            );

            const updatedBalance = Number(balance);

            if (previousBalance === updatedBalance) {
                return;
            }

            const difference =
                updatedBalance - previousBalance;

            await db.collection("transactions").add({
                walletUserId: String(memberId),
                previousBalance,
                updatedBalance,
                amount: Math.abs(difference),
                type: difference > 0 ?
                    "credit" :
                    "debit",
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            await docRef.update({
                balance: updatedBalance,
                balanceUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

        } catch (err) {

            console.error(
                "Balance sync error:",
                err
            );

        }
    }

    // =========================
    // START BALANCE SYNC
    // =========================

    function startBalanceSync() {

        if (balanceInterval) {
            return;
        }

        updateUserBalance();

        balanceInterval = setInterval(
            updateUserBalance,
            15000
        );
    }

    // =========================
    // CHECK ALLOWED USER
    // =========================

    async function checkAllowedFromFirebase() {

        try {

            const userInfo = JSON.parse(
                localStorage.getItem("userInfo")
            );

            const memberId =
                userInfo?.value?.memberId ||
                userInfo?.value?.memberld;

            if (!memberId) {
                return { allowed: false, isPremium: false };
            }

            const snap = await firebase
                .firestore()
                .collection("members")
                .where(
                    "walletUserId",
                    "==",
                    String(memberId)
                )
                .where(
                    "active",
                    "==",
                    true
                )
                .limit(1)
                .get();

            if (snap.empty) {
                return { allowed: false, isPremium: false };
            }

            const memberData = snap.docs[0].data();
            return { 
                allowed: true, 
                isPremium: memberData.is_premium === true 
            };

        } catch {

            return { allowed: false, isPremium: false };

        }
    }

})();
