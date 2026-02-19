# 🍽️ Vite & Gourmand — Traiteur Bordeaux

> Application web de commande de menus traiteur en ligne.  
> Projet ECF — Titre Professionnel Développeur Web et Web Mobile

---

## 📋 Description du projet

**Vite & Gourmand** est une entreprise de traiteur basée à Bordeaux proposant des menus festifs (Noël, Pâques, Classique, Végétarien, Événementiel) livrés à domicile.

Cette application web permet :
- Aux **clients** de consulter les menus, passer des commandes et suivre leur statut
- Aux **employés** de gérer les commandes et valider les avis
- Aux **administrateurs** de visualiser les statistiques et gérer l'entreprise

---

## 🚀 Démo en ligne

🔗 **[https://sanameguebli19-creator.github.io/ECF_vite-gourmand](https://sanameguebli19-creator.github.io/ECF_vite-gourmand)**

---

## 🛠️ Technologies utilisées

| Technologie | Usage |
|---|---|
| HTML5 / CSS3 | Structure et style des pages |
| JavaScript | Interactions et dynamisme |
| MySQL | Base de données relationnelle |
| MongoDB | Statistiques et analytics |
| Git / GitHub | Versionnement du code |
| Figma | Maquettes wireframes et mockups |
| XAMPP | Environnement local de développement |

---

## 📁 Structure du projet

```
ECF_vite-gourmand/
│
├── index.html              # Page d'accueil
├── menus.html              # Catalogue des menus
├── menu-detail.html        # Détail d'un menu
├── commande.html           # Formulaire de commande
├── connexion.html          # Page de connexion / inscription
├── contact.html            # Page de contact
├── espace-utilisateur.html # Espace client
├── espace-employe.html     # Espace employé
├── espace-admin.html       # Espace administrateur
│
├── style.css               # Feuille de style principale
├── script.js               # Scripts JavaScript
│
├── database.sql            # Script SQL (création BDD + données)
├── mongodb.js              # Collections MongoDB
│
└── README.md               # Documentation du projet
```

---

## ⚙️ Installation en local

### Prérequis
- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL + PHP)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [Git](https://git-scm.com/)

### Étapes

**1. Cloner le projet**
```bash
git clone https://github.com/sanameguebli19-creator/ECF_vite-gourmand.git
cd ECF_vite-gourmand
```

**2. Démarrer XAMPP**
- Lancer XAMPP Control Panel
- Démarrer **Apache** et **MySQL**

**3. Importer la base MySQL**
- Ouvrir **phpMyAdmin** → `localhost/phpmyadmin`
- Créer une base : `vite_gourmand`
- Onglet **SQL** → coller le contenu de `database.sql` → Exécuter

**4. Importer MongoDB**
- Ouvrir **MongoDB Compass**
- Se connecter à `mongodb://localhost:27017`
- Créer la base : `vite_gourmand_stats`
- Importer les 5 fichiers JSON dans les collections correspondantes

**5. Accéder au site**
```
http://localhost/ECF_vite-gourmand/
```

---

## 🗄️ Base de données MySQL

**Base :** `vite_gourmand`

| Table | Description |
|---|---|
| utilisateur | Clients, employés, admins |
| menu | Menus traiteur disponibles |
| plat | Plats composant les menus |
| commande | Commandes des clients |
| avis | Avis et notes des clients |
| allergene | Liste des allergènes |
| horaire | Horaires d'ouverture |
| contact | Messages du formulaire contact |
| propose | Relation menu ↔ plat |
| contient_allergene | Relation plat ↔ allergène |

---

## 🍃 Base de données MongoDB

**Base :** `vite_gourmand_stats`

| Collection | Description |
|---|---|
| statistiques_ca | CA mensuel par menu |
| analytics_menus | Vues et conversions par menu |
| logs_connexion | Historique des connexions |
| notifications | Alertes envoyées aux clients |
| sessions | Sessions utilisateurs actives |

---

## 🔐 Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | admin@vitegourmand.fr | Admin2026! |
| Employé | jose@vitegourmand.fr | Employe2026! |
| Client | julie@exemple.fr | Client2026! |

---

## 🎨 Charte graphique

| Élément | Valeur |
|---|---|
| Couleur principale | `#C4571A` (Terracotta) |
| Couleur secondaire | `#D4A84B` (Or) |
| Fond sombre | `#1A1209` |
| Police titres | Playfair Display |
| Police corps | DM Sans |

---

## 📄 Documents livrés

- `database.sql` — Script SQL complet
- `mongodb.js` — Collections NoSQL
- Maquettes Figma (wireframes + mockups)
- Charte graphique PDF
- Document de rendu ECF

---

## 👩‍💻 Auteur

**MEGUEBLI Sana**  
Titre Professionnel Développeur Web et Web Mobile  
ECF — 2026