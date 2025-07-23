from utils.db import get_db_connection
from utils.hashing import hash_password
from datetime import datetime

def create_user(data):
    conn = get_db_connection()
    cursor = conn.cursor()

    name = data["name"]
    email = data["email"]
    raw_password = data["password"]
    role = data["role"]
    is_active = int(data.get("is_active", 1))  # Par défaut actif
    created_at = datetime.now()

    # Hasher le mot de passe
    hashed = hash_password(raw_password)

    # Vérifier si email existe déjà
    cursor.execute("SELECT id FROM Users WHERE email = ?", (email,))
    if cursor.fetchone():
        raise Exception("Cet email est déjà utilisé.")

    # Insertion
    cursor.execute("""
        INSERT INTO Users (name, email, password, role, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (name, email, hashed, role, is_active, created_at))

    conn.commit()

    return {
        "name": name,
        "email": email,
        "role": role,
        "is_active": is_active
    }
