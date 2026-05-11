// --- 基礎財務設定 ---
const baseIncome = 63091;

// --- 年度獎金與福利設定 ---
const taxReportTotalIncome = 819216;
const welfareFund = 16080;
const potentialBonusCut = 13000; // 今年可能會砍的員工旅遊獎金
const annualBaseIncome = baseIncome * 12;
const estimatedExtraBonus = taxReportTotalIncome - annualBaseIncome;
const totalAnnualPower = taxReportTotalIncome + welfareFund - potentialBonusCut;

// 已經為您移除了假日租車，僅保留固定與平日花費
const financeData = [
    {
        title: "鐵打必扣支出 (固定/半固定)",
        icon: "fa-lock",
        total: "NT$ 32,699",
        items: [
            { name: "房租", value: "15,000" },
            { name: "信仰奉獻", value: "6,300" },
            { name: "電話費", value: "799" },
            { name: "機車路邊停車 (月租)", value: "300" },
            { name: "機車油錢 (75x4)", value: "300" },
            { name: "固定投資 (共同基金)", value: "10,000" }
        ]
    },
    {
        title: "生活餐飲費估算",
        icon: "fa-utensils",
        total: "NT$ 18,500",
        note: "不吃早餐；平日午餐≤200；平日晚餐抓350；週末吃較好",
        items: [
            { name: "平日餐費 (約22天)", value: "12,100" },
            { name: "週末餐費 (約8天, 抓800/天)", value: "6,400" }
        ]
    },
    {
        title: "交通與平日租車",
        icon: "fa-car",
        total: "NT$ 1,120",
        note: "僅包含平日週三共享租車 (假日採彈性計算)",
        items: [
            { name: "週三租車 (約280x4)", value: "1,120" }
        ]
    }
];

// 計算總基礎開銷 (已移除年度帳單的每月預扣)
const totalFixedExpenses = 32699 + 18500 + 1120;
// 基礎剩餘閒錢
const baseFlexibleFund = baseIncome - totalFixedExpenses;

// --- 版本紀錄配置 ---
const changelogData = [
    {
        version: "v1.5.0",
        date: "2026-05-11",
        description: "新增：全新的「年度獎金與總體檢」區塊！根據稅單總薪資（819,216）與福利金（16,080），獨立計算出約 7.8 萬的額外年度資金，與每月基礎薪資分開展示，讓大筆資金（如旅遊、投資）的運用更清晰安全。"
    },
    {
        version: "v1.4.1",
        date: "2026-05-11",
        description: "資料更新：根據最新資訊，更新年度所得稅預估為 18,040 元（每月預扣調整為 1,503 元）。"
    },
    {
        version: "v1.4.0",
        date: "2026-05-11",
        description: "重大升級：UI 現代化設計重構！引入 Google Fonts (Inter & Noto Sans TC)、全新漸層色彩、深邃午夜藍暗黑模式、流暢的微動畫與更精緻的卡片立體陰影。"
    },
    {
        version: "v1.3.0",
        date: "2026-05-11",
        description: "修復：暗黑模式切換完全失效的根本原因 — data-theme 屬性原設在 body 上，但 CSS 變數定義在 :root (html)，導致變數無法被覆蓋。改為在 html 元素上設定 data-theme，確保切換即時生效。CSS 選擇器也同步加入 html[data-theme] 與 body[data-theme] 的多重保險。"
    },
    {
        version: "v1.2.0",
        date: "2026-05-11",
        description: "修復：初次開啟時自動偵測系統深色模式（prefers-color-scheme），不再強制預設白天。新增：系統主題變更時即時跟隨（未手動設定時）。重構：暗黑模式邏輯統一由 applyTheme() 處理，避免重複代碼。"
    },
    {
        version: "v1.1.0",
        date: "2026-05-10",
        description: "修復：修正暗黑模式切換時圖示無法正確變更的 Bug。新增：加入「互動試算工具」，移除寫死的假日租車，讓使用者能手動輸入假日租車與娛樂費用，即時計算本月結餘。"
    },
    {
        version: "v1.0.0",
        date: "2026-05-10",
        description: "初始版本：建立個人財務 Dashboard，匯入 4~5 月分析數據。"
    }
];

// --- 渲染財務細節 ---
function renderFinanceDetails() {
    const container = document.getElementById('finance-details');
    container.innerHTML = '';

    financeData.forEach(category => {
        let itemsHtml = '';
        category.items.forEach(item => {
            itemsHtml += `
                <li>
                    <span class="item-name">${item.name}</span>
                    <span class="item-value">NT$ ${item.value}</span>
                </li>
            `;
        });

        const noteHtml = category.note ? `<p class="note">${category.note}</p>` : '';

        const cardHtml = `
            <div class="card">
                <h3><span class="icon-wrapper"><i class="fas ${category.icon}"></i></span> ${category.title}</h3>
                <p class="amount">${category.total}</p>
                ${noteHtml}
                <ul class="detail-list">
                    ${itemsHtml}
                </ul>
            </div>
        `;
        container.innerHTML += cardHtml;
    });

    // 確保介面顯示正確的基礎剩餘
    document.getElementById('base-flexible').textContent = `NT$ ${baseFlexibleFund.toLocaleString()}`;
    document.getElementById('final-savings').textContent = `NT$ ${baseFlexibleFund.toLocaleString()}`;
}

// --- 渲染年度獎金與福利 ---
function renderAnnualBonus() {
    const container = document.getElementById('annual-bonus-container');
    if (!container) return;
    
    const annualInsurance = 14245;
    const annualTax = 18040;
    const annualMonsterBills = annualInsurance + annualTax;
    
    const actualExtraFund = estimatedExtraBonus + welfareFund - potentialBonusCut - annualMonsterBills;
    const actualExtraFundWan = (actualExtraFund / 10000).toFixed(1);
    
    // 計算兩種存款情境
    const annualBaseSavingsIdeal = baseFlexibleFund * 12;
    const annualBaseSavingsConservative = (baseFlexibleFund * 0.5) * 12;
    const estimatedAnnualSurplusIdeal = annualBaseSavingsIdeal + actualExtraFund;
    const estimatedAnnualSurplusConservative = annualBaseSavingsConservative + actualExtraFund;
    
    container.innerHTML = `
        <div class="bonus-header">
            <h3><span class="icon-wrapper bonus-icon"><i class="fas fa-trophy"></i></span> 全年真實財力：NT$ ${totalAnnualPower.toLocaleString()}</h3>
            <p class="note" style="margin-top: 10px; font-size: 1rem; color: var(--text-color);">💡 除了每月薪水，您一年還有大約 <strong>${actualExtraFundWan} 萬</strong> 的非固定大筆資金！<br><span style="color: var(--text-muted); font-size: 0.9rem;">(強烈建議將這筆錢存做「緊急預備金」、「年度旅遊基金」或「大額單筆投資」，勿攤入每月日常開銷中)</span></p>
        </div>
        <div class="bonus-details" style="margin-top: 20px;">
            <ul class="detail-list">
                <li>
                    <span class="item-name">全年基礎薪資 (63,091 × 12)</span>
                    <span class="item-value">NT$ ${annualBaseIncome.toLocaleString()}</span>
                </li>
                <li>
                    <span class="item-name">年終獎金 (稅單總額 - 基礎年薪)</span>
                    <span class="item-value" style="color: var(--bonus-color); font-weight: 800;">+ NT$ ${estimatedExtraBonus.toLocaleString()}</span>
                </li>
                <li>
                    <span class="item-name">職工福利金 (稅單外加)</span>
                    <span class="item-value" style="color: var(--bonus-color); font-weight: 800;">+ NT$ ${welfareFund.toLocaleString()}</span>
                </li>
                <li>
                    <span class="item-name">預期縮減 (如：今年可能砍旅遊金)</span>
                    <span class="item-value" style="color: var(--highlight-color); font-weight: 800;">- NT$ ${potentialBonusCut.toLocaleString()}</span>
                </li>
                <li>
                    <span class="item-name">年度魔王帳單一次扣除 (保險 14k + 所得稅 18k)</span>
                    <span class="item-value" style="color: var(--highlight-color); font-weight: 800;">- NT$ ${annualMonsterBills.toLocaleString()}</span>
                </li>
                <li style="border-top: 2px dashed var(--border-color); margin-top: 10px; padding-top: 15px; flex-direction: column; align-items: flex-start; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; width: 100%;">
                        <span class="item-name" style="font-size: 1.1rem; color: var(--primary-color);">🌟 最高存款潛力 (每月閒錢 100% 存下)</span>
                        <span class="item-value" style="font-size: 1.3rem; color: var(--success-color);">NT$ ${estimatedAnnualSurplusIdeal.toLocaleString()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 100%;">
                        <span class="item-name" style="font-size: 1rem; color: var(--text-muted);">🛡️ 保守預估存款 (每月閒錢僅存 50%)</span>
                        <span class="item-value" style="font-size: 1.1rem; color: var(--text-color);">NT$ ${estimatedAnnualSurplusConservative.toLocaleString()}</span>
                    </div>
                </li>
            </ul>
        </div>
    `;
}

// --- 渲染版本紀錄 ---
function renderChangelog() {
    const list = document.getElementById('changelog-list');
    list.innerHTML = '';

    changelogData.forEach(log => {
        list.innerHTML += `
            <li>
                <span class="version">${log.version}</span>
                <span class="date">${log.date}</span>
                <p class="desc" style="margin-top: 5px; color: var(--text-color);">${log.description}</p>
            </li>
        `;
    });
}

// --- 彈性花費互動試算邏輯 ---
function setupCalculator() {
    const inputRental = document.getElementById('input-rental');
    const inputFun = document.getElementById('input-fun');
    const finalSavingsEl = document.getElementById('final-savings');

    function calculateTotal() {
        const rentalCost = parseInt(inputRental.value) || 0;
        const funCost = parseInt(inputFun.value) || 0;
        
        const finalAmount = baseFlexibleFund - rentalCost - funCost;
        
        finalSavingsEl.textContent = `NT$ ${finalAmount.toLocaleString()}`;
        
        // 變色提示
        if (finalAmount < 0) {
            finalSavingsEl.style.color = 'var(--highlight-color)'; // 變紅代表透支
        } else {
            finalSavingsEl.style.color = 'var(--success-color)'; // 綠色代表安全
        }
    }

    inputRental.addEventListener('input', calculateTotal);
    inputFun.addEventListener('input', calculateTotal);
}

// --- 暗黑模式切換邏輯 ---
function applyTheme(isDark) {
    const icon = document.querySelector('#theme-toggle i');
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        icon.className = 'fas fa-sun';
    } else {
        document.documentElement.removeAttribute('data-theme');
        icon.className = 'fas fa-moon';
    }
}

function setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');

    // 優先讀使用者手動設定，其次跟隨系統深色模式
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme === 'dark');
    } else {
        applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    // 跟隨系統主題變化（未手動設定時）
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches);
        }
    });

    toggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        applyTheme(!isDark);
        localStorage.setItem('theme', !isDark ? 'dark' : 'light');
    });
}

// --- 初始化 ---
document.addEventListener('DOMContentLoaded', () => {
    renderFinanceDetails();
    renderAnnualBonus();
    renderChangelog();
    setupCalculator();
    setupThemeToggle();
});