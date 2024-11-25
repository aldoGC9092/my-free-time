from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import Select
from bs4 import BeautifulSoup
import time
import sys
import json

if len(sys.argv) < 2:
    print("Error: No se proporcionó una fecha. Usa el formato yyyy-mm-dd.")
    sys.exit(1)

# Capturar la fecha desde los argumentos
date = sys.argv[1]

# Arreglo para almacenar los links
enlaces_guardados = []
eventos = []

# Configurar Selenium para usar Chrome
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

# Abrir la URL
driver.get('https://voyalteatro.com')
time.sleep(2)
select_element = driver.find_element("tag name", "select") 
select = Select(select_element)
select.select_by_value('14')  # 14 corresponde a Jalisco
time.sleep(2)

# Abrir la cartelera del dia
driver.get('https://voyalteatro.com/cartelera?date=' + date)
time.sleep(2)
html = driver.page_source # Obtener el HTML una vez que el contenido ha sido cargado por JavaScript
soup = BeautifulSoup(html, 'html.parser')

# Buscar eventos
titulos = soup.find_all('p', class_='event-name')
if not titulos:
    print("No hay eventos disponibles. Hola")

else:
    # Buscar enlaces
    enlaces = soup.find_all('a', href=True)
    for enlace in enlaces:
        if enlace['href'].startswith('/cartelera/'):
            enlaces_guardados.append(enlace['href'])

    for enlace in enlaces_guardados:
        driver.get('https://voyalteatro.com' + enlace)
        time.sleep(5)
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')
        titulo = soup.find('h2', class_='title')
        sinopsis = soup.find('p', class_='event-section-content')
        teatro = soup.find('h3', class_='theater')
        if not sinopsis:
            print('Boletos agotados')
        else:
            eventos.append({
            "titulo": titulo.text if titulo else "Sin título",
            "sinopsis": sinopsis.text if sinopsis else "No disponible",
            "teatro": teatro.text if teatro else "No especificado",
            "link": f"https://voyalteatro.com{enlace}"
            })
            time.sleep(2)

print(json.dumps(eventos))
driver.quit()