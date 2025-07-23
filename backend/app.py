from flask import Flask, jsonify
from routes.auth import auth_bp
from flask_cors import CORS
from routes.tickets import ticket_bp

import pyodbc

app = Flask(__name__)
CORS(app)  # ✅ Autorise les appels frontend vers le backend
app.register_blueprint(auth_bp)
app.register_blueprint(ticket_bp)



# Configuration de la base
server = 'host.docker.internal'
database = 'TicketDB'
username = 'sa'
password = 'ikhlasse'
driver = '{ODBC Driver 17 for SQL Server}'

conn_str = f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}'

# ✅ Route d'accueil
@app.route('/')
def index():
    return '✅ API Ticket System is running 🚀'

# ✅ Test de la base
@app.route('/api/test-db')
def test_db():
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM Users")
        count = cursor.fetchone()[0]
        return jsonify({"connected": True, "user_count": count})
    except Exception as e:
        return jsonify({"connected": False, "error": str(e)}), 500

# ✅ Liste des tickets
@app.route('/api/tickets')
def get_tickets():
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        cursor.execute("SELECT id, title, status FROM Tickets")
        rows = cursor.fetchall()

        tickets = []
        for row in rows:
            tickets.append({
                "id": row[0],
                "title": row[1],
                "status": row[2]
            })
        return jsonify(tickets)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Démarrage
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')