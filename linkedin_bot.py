import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

# ⚠️ ВНИМАНИЕ: Автоматизация LinkedIn может привести к блокировке аккаунта. 
# Используйте с осторожностью, делайте задержки (time.sleep) между сообщениями.

LINKEDIN_USERNAME = 'твой_email@example.com'
LINKEDIN_PASSWORD = 'твой_пароль'

MESSAGE_TEMPLATE = """Hi {name}, thanks for connecting.

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

I’m currently looking for early users who can share real workflow pain and test the demo. Would it make sense to show you a 10-minute walkthrough?"""

def main():
    driver = webdriver.Chrome()
    driver.implicitly_wait(10)
    
    # Вход в систему
    driver.get('https://www.linkedin.com/login')
    driver.find_element(By.ID, 'username').send_keys(LINKEDIN_USERNAME)
    driver.find_element(By.ID, 'password').send_keys(LINKEDIN_PASSWORD)
    driver.find_element(By.XPATH, "//button[@type='submit']").click()
    
    print("Пожалуйста, пройдите CAPTCHA если нужно, и нажмите Enter здесь в консоли после успешного входа.")
    input()
    
    # Переход на страницу контактов
    driver.get('https://www.linkedin.com/mynetwork/invite-connect/connections/')
    time.sleep(5)
    
    # Ищем карточки контактов (DOM может меняться со временем)
    connections = driver.find_elements(By.XPATH, "//li[contains(@class, 'mn-connection-card')]")
    
    for conn in connections:
        try:
            name_elem = conn.find_element(By.XPATH, ".//span[contains(@class, 'mn-connection-card__name')]")
            name = name_elem.text.strip().split()[0] # Берем только имя
            
            message_btn = conn.find_element(By.XPATH, ".//button[contains(@aria-label, 'Message')]")
            driver.execute_script("arguments[0].scrollIntoView(true);", message_btn)
            time.sleep(1)
            message_btn.click()
            time.sleep(3) # Ждем открытия окна чата
            
            # Находим поле ввода
            msg_box = driver.find_element(By.XPATH, "//div[contains(@class, 'msg-form__contenteditable')]")
            
            # Формируем сообщение
            actual_message = MESSAGE_TEMPLATE.format(name=name)
            
            # Вводим текст
            msg_box.send_keys(actual_message)
            time.sleep(2)
            
            # Кнопка отправки
            send_btn = driver.find_element(By.XPATH, "//button[contains(@class, 'msg-form__send-button')]")
            
            # !!! РАСКОММЕНТИРУЙ СТРОКУ НИЖЕ, ЧТОБЫ СКРИПТ РЕАЛЬНО ОТПРАВЛЯЛ СООБЩЕНИЯ !!!
            # send_btn.click() 
            
            print(f"Подготовлено сообщение для {name}")
            
            # Закрываем окно чата
            close_btn = driver.find_element(By.XPATH, "//button[contains(@class, 'msg-overlay-bubble-header__control--close-btn')]")
            close_btn.click()
            
            # Рандомная задержка чтобы не забанили быстро (от 10 до 20 секунд)
            time.sleep(15) 
            
        except Exception as e:
            print(f"Ошибка при обработке контакта: {e}")

if __name__ == '__main__':
    main()
