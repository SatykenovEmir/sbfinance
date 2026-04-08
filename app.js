(function () {
    const $ = (sel, el = document) => el.querySelector(sel);
    const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

    // Year
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Mobile nav
    const navToggle = $("#navToggle");
    const nav = $("#siteNav");
    if (navToggle && nav) {
        navToggle.addEventListener("click", () => {
            const open = nav.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", open ? "true" : "false");
            navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        });

        // Close nav on link click (mobile)
        $$("#siteNav a").forEach((a) => {
            a.addEventListener("click", () => {
                if (nav.classList.contains("is-open")) {
                    nav.classList.remove("is-open");
                    navToggle.setAttribute("aria-expanded", "false");
                    navToggle.setAttribute("aria-label", "Open menu");
                }
            });
        });
    }

    // Smooth scroll
    document.addEventListener("click", (e) => {
        const a = e.target.closest("a[href^='#']");
        if (!a) return;
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", id);
    });

    // Modal
    const modal = $("#demoModal");
    const openButtons = $$("[data-open-modal='demoModal']");
    const closeButtons = $$("[data-close-modal]");
    let lastFocus = null;

    function openModal() {
        if (!modal) return;
        lastFocus = document.activeElement;
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        const email = $("#email");
        if (email) setTimeout(() => email.focus(), 50);
    }

    function closeModal() {
        if (!modal) return;
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    openButtons.forEach((b) => b.addEventListener("click", openModal));
    closeButtons.forEach((b) => b.addEventListener("click", closeModal));
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && modal.getAttribute("aria-hidden") === "false") closeModal();
    });

    // Mailto send
    const sendBtn = $("#sendEmail");
    if (sendBtn) {
        sendBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const email = ($("#email")?.value || "").trim();
            const note = ($("#note")?.value || "").trim();

            // TODO: Replace with your real email
            const to = "hello@sbfinance.ai";
            const subject = encodeURIComponent("SBfinance demo request");
            const body = encodeURIComponent(
                `Email: ${email || "(not provided)"}\n\nWhat I want to forecast:\n${note || "(not provided)"}\n\nSent from SBfinance landing page.`
            );

            window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
            closeModal();
        });
    }

    // ---- Demo data + chart ----
    const chart = $("#forecastChart");
    const riskNoteEl = $("#riskNote");

    const scenarios = {
        base: {
            risk: "Watch burn rate in months 5–7",
            months: ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"],
            cash: [220, 210, 205, 198, 180, 165, 150, 160, 175, 190, 210, 235],
            rev: [120, 128, 132, 140, 145, 150, 158, 165, 175, 190, 205, 220]
        },
        down: {
            risk: "Downside: cash tight around months 6–8",
            months: ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"],
            cash: [220, 205, 190, 175, 155, 130, 105, 95, 110, 125, 145, 165],
            rev: [120, 115, 112, 108, 105, 110, 112, 118, 125, 135, 150, 162]
        },
        up: {
            risk: "Upside: consider reinvestment vs. buffer",
            months: ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"],
            cash: [220, 215, 218, 225, 240, 255, 270, 290, 315, 345, 380, 420],
            rev: [120, 135, 150, 165, 180, 200, 225, 250, 280, 315, 350, 390]
        }
    };

    let current = "base";
    let customLoaded = false;

    function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

    function renderChart(data) {
        if (!chart) return;

        const W = 800, H = 260;
        const pad = { l: 44, r: 16, t: 18, b: 34 };
        const innerW = W - pad.l - pad.r;
        const innerH = H - pad.t - pad.b;

        const all = data.cash.concat(data.rev);
        const minV = Math.min(...all);
        const maxV = Math.max(...all);
        const yMin = minV - (maxV - minV) * 0.08;
        const yMax = maxV + (maxV - minV) * 0.08;

        const x = (i) => pad.l + (innerW * i) / (data.months.length - 1);
        const y = (v) => pad.t + innerH * (1 - (v - yMin) / (yMax - yMin));

        function pathFrom(values) {
            return values.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(2)} ${y(v).toFixed(2)}`).join(" ");
        }

        // Grid lines
        const yTicks = 4;
        let grid = "";
        for (let i = 0; i <= yTicks; i++) {
            const ty = pad.t + (innerH * i) / yTicks;
            grid += `<line x1="${pad.l}" y1="${ty}" x2="${W - pad.r}" y2="${ty}" stroke="rgba(255,255,255,0.08)" />`;
        }

        // X labels (every 2)
        let xLabels = "";
        for (let i = 0; i < data.months.length; i += 2) {
            xLabels += `<text x="${x(i)}" y="${H - 12}" fill="rgba(255,255,255,0.55)" font-size="12" text-anchor="middle">${data.months[i]}</text>`;
        }

        // Y labels
        let yLabels = "";
        for (let i = 0; i <= yTicks; i++) {
            const val = yMax - ((yMax - yMin) * i) / yTicks;
            const ty = pad.t + (innerH * i) / yTicks;
            yLabels += `<text x="${pad.l - 10}" y="${ty + 4}" fill="rgba(255,255,255,0.55)" font-size="12" text-anchor="end">${Math.round(val)}</text>`;
        }

        const cashPath = pathFrom(data.cash);
        const revPath = pathFrom(data.rev);

        const dots = (values, color) =>
            values.map((v, i) =>
                `<circle cx="${x(i)}" cy="${y(v)}" r="3.2" fill="${color}" opacity="0.95" />`
            ).join("");

        chart.innerHTML = `
      <defs>
        <linearGradient id="gCash" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="rgba(96,165,250,0.95)" />
          <stop offset="1" stop-color="rgba(167,139,250,0.85)" />
        </linearGradient>
        <linearGradient id="gRev" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="rgba(34,197,94,0.95)" />
          <stop offset="1" stop-color="rgba(96,165,250,0.80)" />
        </linearGradient>
      </defs>

      ${grid}

      <path d="${revPath}" fill="none" stroke="url(#gRev)" stroke-width="3.2" />
      ${dots(data.rev, "rgba(34,197,94,0.95)")}

      <path d="${cashPath}" fill="none" stroke="url(#gCash)" stroke-width="3.6" />
      ${dots(data.cash, "rgba(96,165,250,0.95)")}

      <rect x="${pad.l}" y="${pad.t}" width="${innerW}" height="${innerH}" fill="none" stroke="rgba(255,255,255,0.12)"/>

      ${yLabels}
      ${xLabels}
    `;
    }

    function setScenario(name) {
        if (!scenarios[name]) return;
        current = name;
        customLoaded = false;
        const s = scenarios[name];
        if (riskNoteEl) riskNoteEl.textContent = s.risk;
        renderChart(s);
        // aria states
        $$(".seg").forEach(btn => {
            const on = btn.dataset.scenario === name;
            btn.setAttribute("aria-pressed", on ? "true" : "false");
        });
    }

    $$(".seg").forEach((btn) => {
        btn.addEventListener("click", () => setScenario(btn.dataset.scenario));
    });

    // ---- Chat demo ----
    const chatLog = $("#chatLog");
    const chatForm = $("#chatForm");
    const chatInput = $("#chatInput");

    function addMsg(role, text) {
        if (!chatLog) return;
        const wrap = document.createElement("div");
        wrap.className = `msg ${role === "user" ? "msg--user" : "msg--bot"}`;

        const avatar = document.createElement("div");
        avatar.className = "msg__avatar";
        avatar.textContent = role === "user" ? "U" : "SB";

        const bubble = document.createElement("div");
        bubble.className = "msg__bubble";
        bubble.textContent = text;

        wrap.appendChild(avatar);
        wrap.appendChild(bubble);
        chatLog.appendChild(wrap);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    function getDatasetSummary() {
        const s = scenarios[current];
        const cashEnd = s.cash[s.cash.length - 1];
        const cashMin = Math.min(...s.cash);
        const revEnd = s.rev[s.rev.length - 1];
        return { cashEnd, cashMin, revEnd };
    }

    function respond(q) {
        const query = q.toLowerCase().trim();
        const { cashEnd, cashMin, revEnd } = getDatasetSummary();

        // Lightweight “grounded” mock logic: answer based on current scenario numbers.
        if (query.includes("runway") || query.includes("how long")) {
            const note = current === "down"
                ? "Downside scenario shows a tighter runway. Consider reducing burn and building buffer."
                : current === "up"
                    ? "Upside scenario extends runway. Decide between reinvestment and maintaining a safety buffer."
                    : "Base scenario runway looks stable, but monitor burn in the mid-period.";
            return `Based on the current scenario (${current}), cash dips to ~${Math.round(cashMin)} and ends around ~${Math.round(cashEnd)}. ${note}`;
        }

        if (query.includes("risk") || query.includes("what could go wrong")) {
            const risk = scenarios[current].risk;
            return `Key risk in the ${current} scenario: ${risk}. A practical next step is to stress-test expenses and payment terms against that window.`;
        }

        if (query.includes("revenue") || query.includes("sales")) {
            return `In the ${current} scenario, revenue trends toward ~${Math.round(revEnd)} by the end of the horizon. If you share drivers (pricing, volume, churn), SBfinance would model sensitivity and recommend levers.`;
        }

        if (query.includes("recommend") || query.includes("what should we do") || query.includes("actions")) {
            if (current === "down") {
                return "Actions for downside: (1) cut or delay discretionary spend, (2) renegotiate payment terms, (3) test a price/margin lift, (4) prioritize retention to reduce volatility.";
            }
            if (current === "up") {
                return "Actions for upside: (1) allocate a buffer policy, (2) reinvest where ROI is measurable, (3) add guardrails so growth doesn’t increase risk disproportionately.";
            }
            return "Actions for base: (1) define a cash buffer threshold, (2) monitor burn drivers monthly, (3) run a downside stress-test and pre-plan mitigations.";
        }

        return "Ask about runway, risks, revenue, or recommended actions. In the real product, answers would be grounded in your uploaded data and the model assumptions would be visible.";
    }

    function seedChat() {
        if (!chatLog) return;
        addMsg("bot", "Hi — I’m SBfinance. Ask me about runway, risks, or forecasts based on your data.");
        addMsg("user", "What’s our runway in the downside scenario?");
        addMsg("bot", respond("runway downside"));
    }

    if (chatForm && chatInput) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const q = chatInput.value.trim();
            if (!q) return;
            addMsg("user", q);
            chatInput.value = "";
            setTimeout(() => addMsg("bot", respond(q)), 250);
        });
    }

    // ---- CSV upload ----
    const csvInput = $("#csvInput");
    const csvResult = $("#csvResult");
    const loadSampleBtn = $("#loadSample");

    function parseCSV(text) {
        // Minimal parser: expects header and comma-separated values
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) throw new Error("CSV must include header + at least 1 row.");

        const header = lines[0].split(",").map(s => s.trim().toLowerCase());
        const idxMonth = header.indexOf("month");
        const idxRev = header.indexOf("revenue");
        const idxExp = header.indexOf("expenses");
        if (idxMonth === -1 || idxRev === -1 || idxExp === -1) {
            throw new Error("CSV header must include: Month,Revenue,Expenses");
        }

        const months = [];
        const revenue = [];
        const expenses = [];

        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(",").map(s => s.trim());
            if (cols.length < header.length) continue;

            const m = cols[idxMonth];
            const r = Number(cols[idxRev]);
            const ex = Number(cols[idxExp]);

            if (!m || !Number.isFinite(r) || !Number.isFinite(ex)) continue;
            months.push(m);
            revenue.push(r);
            expenses.push(ex);
        }

        if (months.length < 4) throw new Error("Need at least 4 valid rows to render.");

        // Derive a simple cash series from revenue-expenses (scaled for demo chart)
        // This is intentionally a lightweight approximation (demo only).
        let cash = [];
        let c = 200;
        for (let i = 0; i < months.length; i++) {
            const delta = (revenue[i] - expenses[i]) / Math.max(1, revenue[0]) * 40;
            c = clamp(c + delta, 40, 520);
            cash.push(Number(c.toFixed(1)));
        }

        // Normalize revenue for chart scale
        const revNorm = revenue.map(v => clamp((v / Math.max(...revenue)) * 400 + 40, 40, 520));

        return { months: months.map((_, i) => `M${i + 1}`), cash, rev: revNorm, raw: { months, revenue, expenses } };
    }

    function loadCustomFromParsed(parsed) {
        scenarios.base = {
            risk: "Custom dataset loaded — run a downside stress-test next",
            months: parsed.months,
            cash: parsed.cash,
            rev: parsed.rev
        };
        setScenario("base");
        customLoaded = true;

        const raw = parsed.raw;
        const revSum = raw.revenue.reduce((a, b) => a + b, 0);
        const expSum = raw.expenses.reduce((a, b) => a + b, 0);
        const avgMargin = revSum > 0 ? ((revSum - expSum) / revSum) * 100 : 0;

        if (csvResult) {
            csvResult.textContent =
                `Loaded ${raw.months.length} rows. Total revenue: ${Math.round(revSum)} • Total expenses: ${Math.round(expSum)} • Avg margin: ${avgMargin.toFixed(1)}%.`;
        }
    }

    async function readFile(file) {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = () => resolve(String(fr.result || ""));
            fr.onerror = () => reject(new Error("Failed to read file."));
            fr.readAsText(file);
        });
    }

    if (csvInput) {
        csvInput.addEventListener("change", async () => {
            const f = csvInput.files && csvInput.files[0];
            if (!f) return;
            try {
                const text = await readFile(f);
                const parsed = parseCSV(text);
                loadCustomFromParsed(parsed);
            } catch (err) {
                if (csvResult) csvResult.textContent = `Couldn’t load CSV: ${err.message || String(err)}`;
            }
        });
    }

    if (loadSampleBtn) {
        loadSampleBtn.addEventListener("click", () => {
            const sample =
                `Month,Revenue,Expenses
2026-01,120000,90000
2026-02,125000,92000
2026-03,131000,98000
2026-04,138000,103000
2026-05,142000,110000
2026-06,150000,118000
2026-07,156000,123000
2026-08,162000,126000
2026-09,170000,130000
2026-10,182000,136000
2026-11,196000,142000
2026-12,210000,150000`;
            try {
                const parsed = parseCSV(sample);
                loadCustomFromParsed(parsed);
            } catch (err) {
                if (csvResult) csvResult.textContent = `Sample failed: ${err.message || String(err)}`;
            }
        });
    }

    // Init
    setScenario("base");
    seedChat();
})();
