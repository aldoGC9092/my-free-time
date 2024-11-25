from flask import Flask, request, jsonify, send_from_directory
import subprocess
from flask_cors import CORS
import json

app = Flask(__name__, static_folder='static')
CORS(app)  # Esto habilita CORS para todas las rutas

# Ruta para servir el archivo index.html cuando se acceda a la raíz
@app.route('/')
def serve_index():
    return app.send_static_file('index.html')

@app.route('/run-scraper', methods=['POST'])
def run_scraper():
    data = request.json
    date = data.get("date")

    if not date:
        return jsonify({"error": "no se proporciono una fecha"}), 400

    result = subprocess.run(['python', 'teatro_scrapper.py', date], capture_output=True, text=True)
    output = result.stdout

    try:
        #print("STDOUT:", result.stdout)  # Depuración en consola
        #print("STDERR:", result.stderr)  # Depuración en consola
        eventos = json.loads(output)
        return jsonify(eventos)
    except json.JSONDecodeError:
        return jsonify({"error": "Error al procesar los datos del script."}), 500

if __name__ == '__main__':
    app.run(debug=True)
