from flask import Blueprint, jsonify, request
from utils.db import get_connection

ticket_bp = Blueprint('tickets', __name__)

# ✅ Route pour récupérer tous les tickets (avec détails)
@ticket_bp.route('/api/tickets', methods=["GET"])
def get_all_tickets():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, title, status, created_at, priority, category
            FROM Tickets
            ORDER BY created_at DESC
        """)
        rows = cursor.fetchall()

        tickets = [{
            "id": r[0],
            "title": r[1],
            "status": r[2],
            "createdAt": r[3].strftime('%d/%m/%Y') if r[3] else None,
            "priority": r[4],
            "category": r[5]
        } for r in rows]

        return jsonify(tickets)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass

