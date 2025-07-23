from flask import Blueprint, request, jsonify
from services.auth_service import create_user

users_bp = Blueprint("users", __name__)

@users_bp.route("/utilisateurs/creer", methods=["POST"])
def creer_utilisateur():
    data = request.json

    # Tu peux faire des vérifs ici aussi (ex: champs manquants)
    try:
        new_user = create_user(data)
        return jsonify({"message": "Utilisateur créé avec succès", "user": new_user}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
