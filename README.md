# Ticket-App

Ticket-App est une application web interne qui permet aux employés de soumettre des tickets de demande liés aux services IT ou RH, tout en assurant un traitement structuré par les agents spécialisés. Le projet suit une approche DevOps avec conteneurisation Docker, CI/CD, monitoring et base de données SQL Server.

---

##  Description

L'application permet une gestion fluide des demandes internes dans une entreprise :
- Les employés peuvent créer et suivre leurs tickets.
- Les agents peuvent consulter, traiter et répondre aux tickets.
- Les administrateurs peuvent gérer les utilisateurs, les catégories et suivre les statistiques.

L’application est pensée pour une infrastructure DevOps automatisée (CI/CD), avec surveillance des services via Prometheus et Grafana.

---

##  Fonctionnalités principales

- Authentification des utilisateurs (employés, agents, admins)
- Création, visualisation, mise à jour et clôture de tickets
- Réponses par les agents avec pièces jointes
- Filtrage par statut, catégorie, priorité
- Notifications internes
- Historique des logs utilisateurs
- Interface simple en HTML/Bootstrap
- Pipeline CI/CD (Git + Jenkins ou GitHub Actions)
- Monitoring avec Prometheus + Grafana

---

##  Technologies utilisées

- **Frontend** : HTML5 + Bootstrap  
- **Backend** : Flask (Python) ou Node.js (Express)  
- **Base de données** : SQL Server  
- **CI/CD** : Git + Jenkins (ou GitHub Actions)  
- **Conteneurisation** : Docker + Docker Compose  
- **Monitoring** : Grafana + Prometheus  
- **Logs** : Console logs via Docker  
---
##  Structure du projet

ticket-app/
├── backend/ # Code Flask ou Node.js
│ └── app.py
├── frontend/ # Fichiers HTML + Bootstrap
│ ├── index.html
│ └── ticket.html
├── db/ # Script SQL Server
│ └── init.sql
├── docker/ # Dockerfiles + .env
│ ├── Dockerfile.backend
│ ├── Dockerfile.frontend
│ └── .env
├── monitoring/ # Grafana + Prometheus
│ ├── prometheus.yml
│ └── dashboards/
├── ci/ # CI/CD : Jenkinsfile ou GitHub Actions
│ ├── Jenkinsfile
│ └── github-actions.yml
├── docker-compose.yml
├── README.md
└── .gitignore

---
##  Installation et démarrage

### Prérequis
- Docker & Docker Compose
- Git
- SQL Server Management Studio (si base externe)

### Lancer l’application avec Docker

```bash
git clone https://github.com/ton-utilisateur/ticket-app.git
cd ticket-app
docker compose up -d --build

### Variables d’environnement recommandées (.env)
DB_SERVER=sqlserver
DB_USER=sa
DB_PASSWORD=YourStrong@Password1

### Accès aux services

| Service     | URL par défaut               |
|-------------|------------------------------|
| Frontend    | http://localhost:8080        |
| Backend API | http://localhost:5000/api    |
| SQL Server  | localhost:1433               |
| Grafana     | http://localhost:3000        |
| Prometheus  | http://localhost:9090        |
##  Auteur

Ikhlasse Moussafir — Projet DevOps 2025

##  Licence

Ce projet est open-source sous licence MIT.

