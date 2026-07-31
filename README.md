# 💇 Salon SaaS ERP

Application ERP complète de gestion pour salon de beauté.

Le projet permet de gérer l'ensemble de l'activité :

- Clients
- Rendez-vous / Planning
- Prestations
- Personnel
- Facturation
- Caisse / POS
- Produits
- Stock par unité
- Mouvements de stock
- Consommation interne
- Dashboard statistiques
- Impression PDF / Excel


---

# 🚀 Technologies utilisées

## Frontend

- Angular 21+
- Standalone Components
- TypeScript
- Bootstrap 5
- Font Awesome
- RxJS
- Chart.js


## Backend

- NestJS
- TypeScript
- TypeORM
- MariaDB / MySQL
- JWT Authentication
- REST API


## Base de données

Développement :

```
MySQL 8
```

Production :

```
MariaDB 10+
```


---

# 📁 Architecture du projet

```
salon-saas/

├── salon-front/
│
│   ├── src/app/
│   │
│   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── guards/
│   │
│   ├── shared/
│   │   ├── components/
│   │   ├── pipes/
│   │   └── directives/
│   │
│   ├── pages/
│   │
│   └── environments/
│
│
├── salon-back/
│
│   ├── src/
│   │
│   ├── auth/
│   ├── clients/
│   ├── reservations/
│   ├── prestations/
│   ├── personnel/
│   ├── facturations/
│   ├── ventes/
│   ├── stocks/
│   ├── produits/
│   ├── dashboard/
│   │
│   └── entities/
│
│
└── README.md
```


---

# ⚙️ Installation


## Prérequis

Installer :

- Node.js 24+
- Angular CLI
- Nest CLI
- MySQL ou MariaDB
- Git


Vérification :

```bash
node -v

npm -v

ng version

nest --version
```


---

# 📥 Installation du projet

Cloner le dépôt :

```bash
git clone URL_DU_REPOSITORY

cd salon-saas
```


---

# 🔥 Backend NestJS


## Installation

```bash
cd salon-back

npm install
```


---

## Configuration environnement


Créer un fichier :

```
.env
```


Exemple :

```env
NODE_ENV=development

PORT=3000


DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=salon_saas


JWT_SECRET=CHANGE_ME_SECRET

JWT_EXPIRES=1d


CORS_ORIGIN=http://localhost:4200
```


⚠️ Ne jamais envoyer le fichier `.env` sur Git.


---

## Base de données

Créer la base :

```sql
CREATE DATABASE salon_saas;
```


---

## Démarrage développement

```bash
npm run start:dev
```


API :

```
http://localhost:3000
```


---

## Build production

```bash
npm run build
```


Démarrer :

```bash
npm run start:prod
```


---

# 🎨 Frontend Angular


## Installation

```bash
cd salon-front

npm install
```


---

# Environnements Angular


## Développement

Fichier :

```
src/environments/environment.ts
```


Exemple :

```ts
export const environment = {

 production:false,

 apiUrl:'http://localhost:3000/api'

};
```


---

## Production

Fichier :

```
src/environments/environment.prod.ts
```


Exemple :

```ts
export const environment = {

 production:true,

 apiUrl:'https://api.domaine.com/api'

};
```


---

## Démarrage

```bash
npm start
```


Application :

```
http://localhost:4200
```


---

## Build production

```bash
ng build --configuration production
```


Résultat :

```
dist/
```


---

# 🔐 Variables sensibles


Ajouter dans `.gitignore` :

```
.env
.env.*
node_modules/
dist/
.angular/
```


---

# 📦 Modules fonctionnels


# 👥 Clients

Gestion :

- Création client
- Modification
- Historique
- Informations client


---

# 📅 Planning / Réservation

Gestion :

- Calendrier
- Création rendez-vous
- Disponibilité personnel
- Statut réservation


Statuts :

```
PLANIFIEE
CONFIRMEE
EN_COURS
TERMINEE
ANNULEE
```


---

# 💇 Prestations

Gestion :

- Catégories
- Durée
- Prix
- Personnel associé


---

# 🧾 Facturation

Fonctionnalités :

- Création facture depuis réservation
- Ajout produits
- Impression facture
- Numérotation automatique


Format :

```
FAC-20260731-0001
```


---

# 💰 Caisse / POS


Fonctionnalités :

- Vente rapide
- Panier
- Paiement
- Historique vente
- Annulation vente
- Restauration stock


Règle métier :

```
1 facture = 1 vente
```


---

# 📦 Gestion Stock


Gestion :

- Produits
- ProduitUnité
- Stock réel
- Stock minimum
- Alertes stock


Exemple :

```
Produit :
Shampoing

Unités :
- Flacon 500ml
- Carton


Stock :
25 Flacons
```


---

# 🔄 Mouvement Stock


Types :

```
IN
OUT
ADJUST
```


Exemples :

Entrée :

```
Réception fournisseur
```


Sortie :

```
Vente
Consommation interne
```


---

# 📉 Consommation interne


Gestion :

- Sortie produit non commercialisable
- Motif obligatoire
- Historique
- Modification
- Archivage
- Mouvement stock automatique


---

# 📊 Dashboard


Statistiques :

- Chiffre d'affaires
- Réservations
- Performance personnel
- Produits populaires
- Alertes stock


---

# 🖨️ Impression


Système centralisé :

- Preview HTML
- Impression navigateur
- PDF
- Excel


Documents supportés :

- Facture
- Vente
- Stock
- Inventaire
- Rapports


Orientation :

```
portrait

landscape
```


---

# 🚀 Déploiement Production


## Backend


Installation :

```bash
npm install

npm run build
```


Avec PM2 :

```bash
pm2 start dist/main.js --name salon-api
```


---

## Frontend


Build :

```bash
ng build --configuration production
```


Déployer :

```
dist/salon-front/browser
```


Serveurs compatibles :

- Nginx
- Apache
- Plesk


---

# 🔄 Git Workflow


Créer une branche :

```bash
git checkout -b feature/module
```


Commit :

```bash
git add .

git commit -m "Ajout module stock"
```


Push :

```bash
git push origin feature/module
```


---

# 🛠️ Commandes utiles


## Angular


Créer composant :

```bash
ng g c pages/module/component --standalone
```


Créer service :

```bash
ng g service core/services/service-name
```


---

## NestJS


Créer module :

```bash
nest g module module-name
```


Créer controller :

```bash
nest g controller module-name
```


Créer service :

```bash
nest g service module-name
```


---

# 🗺️ Roadmap


## Version actuelle

✅ Clients  
✅ Prestations  
✅ Planning  
✅ Facturation  
✅ POS  
✅ Stock  
✅ Consommation interne  
✅ Impression  


## Prochaines évolutions

🚧 Multi salon  
🚧 Gestion utilisateurs / rôles  
🚧 Abonnement SaaS  
🚧 Application mobile  
🚧 Statistiques avancées  


---

# 👨‍💻 Auteur

Projet développé avec :

Angular + NestJS + TypeORM


Licence privée.
