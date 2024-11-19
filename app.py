from flask import Flask, request, jsonify
import subprocess
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Esto habilita CORS para todas las rutas

@app.route('/run-scraper', methods=['POST'])
def run_scraper():
    data = request.json
    date = data.get("date")

    if not date:
        return jsonify({"error": "no se proporciono una fecha"}), 400

    # Ejecuta tu script de scraping (ajusta el comando según tu script)
    try:
        result = subprocess.run(['python', 'teatro_scrapper.py', date], capture_output=True, text=True)
        return jsonify({"output": result.stdout, "error": result.stderr})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
