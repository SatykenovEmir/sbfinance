// Этот скрипт предназначен для запуска в консоли браузера на странице контактов LinkedIn.
// https://www.linkedin.com/mynetwork/invite-connect/connections/

(async function() {
    // 1. Шаблон сообщения. {{name}} будет заменено на имя контакта.
    const template = `Hi {{name}}, thanks for connecting.

I’m building SBFinance — a privacy-first AI financial analyst for finance teams, founders, and accounting firms.

The idea is simple: instead of spending hours cleaning spreadsheets and preparing reports, a team can upload CSV/XLSX exports locally and get:

• cashflow and KPI analysis
• anomaly and duplicate detection
• auto-generated dashboards
• plain-English executive summaries
• PDF reports
• data chat grounded in their own files

The important part: the data stays on the user’s machine. No cloud upload, no third-party API access to raw financial data.

Here’s the landing page:
https://sbfinance.me

I’m currently looking for early users who can share real workflow pain and test the demo. Would it make sense to show you a 10-minute walkthrough?`;

    // Функция для создания пауз (защита от блокировки)
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // Находим все карточки контактов
    const cards = document.querySelectorAll('.mn-connection-card');
    console.log(`Найдено ${cards.length} контактов. Начинаем...`);

    for (let card of cards) {
        try {
            const nameEl = card.querySelector('.mn-connection-card__name');
            if (!nameEl) continue;
            
            const fullName = nameEl.innerText.trim();
            const firstName = fullName.split(' ')[0];

            const messageBtn = card.querySelector('button[aria-label^="Message"]');
            if (!messageBtn) continue;

            console.log(`Открываю чат: ${firstName}`);
            messageBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await delay(1000);
            messageBtn.click();
            
            await delay(3000);

            const messageBox = document.querySelector('.msg-form__contenteditable');
            if (!messageBox) continue;

            const message = template.replace('{{name}}', firstName);

            messageBox.focus();
            document.execCommand('insertText', false, message);
            
            await delay(2000);

            const sendBtn = document.querySelector('.msg-form__send-button');
            
            // ВНИМАНИЕ: Уберите '//' перед sendBtn.click(); чтобы скрипт начал отправлять сообщения сам!
            // sendBtn.click(); 
            
            console.log(`Готово для: ${firstName}`);
            await delay(1500);

            const closeBtn = document.querySelector('.msg-overlay-bubble-header__control--close-btn');
            if (closeBtn) closeBtn.click();

            // Пауза между контактами (12 секунд)
            await delay(12000); 
            
        } catch (e) {
            console.error(`Ошибка:`, e);
        }
    }
    console.log("Скрипт завершил работу на текущем экране.");
})();
