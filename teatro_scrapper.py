from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import Select
from bs4 import BeautifulSoup
import time

# Configurar Selenium para usar Chrome
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

# Abrir la URL
driver.get('https://voyalteatro.com')

time.sleep(3)

select_element = driver.find_element("tag name", "select") 
select = Select(select_element)
select.select_by_value('14')  # 14 corresponde a Jalisco
time.sleep(3)
driver.get('https://voyalteatro.com/cartelera?date=2024-11-17')
time.sleep(3)

# Obtener el HTML una vez que el contenido ha sido cargado por JavaScript
html = driver.page_source

# Cerrar el navegador
driver.quit()
soup = BeautifulSoup(html, 'html.parser')

titulos = soup.find_all('p', class_='event-name')
for titulo in titulos:
    print(titulo.text)
