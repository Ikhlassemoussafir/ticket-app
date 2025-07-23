from flask import Blueprint, request, jsonify
from utils.db import get_connection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/api/login", methods=["POST", "GET"])
def login():
    if request.method == "GET":
        # ✅ Si on accède via navigateur, petit message utile
        return jsonify({
            "message": "🔒 Veuillez utiliser la méthode POST avec un email et un mot de passe.",
            "example": {
                "email": "user@example.com",
                "password": "votremotdepasse"
            }
        }), 200

    # ✅ Méthode POST : traitement de l'authentification
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    try:
        conn = get_connection()
        cursor = conn.cursor()

        # ✅ Requête SQL sécurisée avec paramètres
        cursor.execute("SELECT id, name, role, password FROM Users WHERE email = ?", (email,))
        row = cursor.fetchone()

        # ✅ Vérification des identifiants
        if row and row[3].strip() == password:  # row[3] = password
            user = {
                "id": row[0],
                "name": row[1],
                "role": row[2]
            }
            return jsonify(success=True, user=user)
        else:
            return jsonify(success=False, message="Email ou mot de passe incorrect"), 401

    except Exception as e:
        return jsonify(success=False, message=str(e)), 500
