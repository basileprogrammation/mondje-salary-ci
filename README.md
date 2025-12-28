# Mondjè Salary Estimator - Côte d'Ivoire 🇨🇮

Plateforme d'estimation de salaire pour la Côte d'Ivoire avec recommandations de concours et formations.

## 🚀 Installation & Démarrage

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer en mode développement
```bash
npm start
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

### 3. Build pour production
```bash
npm run build
```

## 📦 Déploiement sur hébergeurs gratuits

### Option 1: Netlify (Recommandé)
1. Créer un compte sur [netlify.com](https://netlify.com)
2. Connecter votre dépôt GitHub
3. Build command: `npm run build`
4. Publish directory: `build`
5. Deploy automatique à chaque commit !

### Option 2: Vercel
1. Créer un compte sur [vercel.com](https://vercel.com)
2. Import votre projet GitHub
3. Deploy automatique - aucune configuration nécessaire !

### Option 3: GitHub Pages
1. Ajouter dans package.json:
   ```json
   "homepage": "https://votre-username.github.io/
   ```
2. Installer gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```
3. Ajouter les scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
4. Déployer:
   ```bash
   npm run deploy
   ```

### Option 4: Render
1. Créer un compte sur [render.com](https://render.com)
2. New Static Site
3. Build command: `npm run build`
4. Publish directory: `build`

## 🎨 Fonctionnalités

- ✅ Estimation de salaire (Fonction Publique vs Secteur Privé)
- ✅ Animation de chargement dynamique
- ✅ Recommandations de concours (6 opportunités)
- ✅ Recommandations de formations (6 formations)
- ✅ Interface responsive (Mobile & Desktop)
- ✅ Animations fluides et micro-interactions
- ✅ Couleurs de la Côte d'Ivoire (Vert/Orange/Blanc)

## 📁 Structure du projet

```
bahn-salary-estimator/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── EstimatorPage.js    # Page formulaire
│   │   └── ResultsPage.js      # Page résultats
│   ├── App.js                   # Router principal
│   ├── index.js                 # Point d'entrée
│   └── index.css                # Styles globaux
├── package.json
└── README.md
```

## 🛠️ Technologies utilisées

- React 18
- React Router DOM v6
- Lucide React (icons)
- Tailwind CSS
- Create React App

## 🎯 Flow utilisateur

1. **Page d'accueil** - Formulaire en 3 étapes:
   - Métier
   - Expérience
   - Secteur (Public/Privé)

2. **Animation de chargement** - 2 secondes avec progression

3. **Page résultats** - Affichage:
   - Estimation de salaire animée
   - 6 concours/opportunités (cliquables)
   - 6 formations (cliquables avec détails)
   - CTA vers Mondjè

## 💡 Personnalisation

### Modifier les données de salaire
Fichier: `src/pages/ResultsPage.js`
```javascript
const salaryData = {
  public: { ... },
  private: { ... }
}
```

### Ajouter des concours/formations
Fichier: `src/pages/ResultsPage.js`
```javascript
const competitions = [ ... ]
const formations = [ ... ]
```

## 📱 Support navigateurs

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🤝 Support



## 📄 Licence

© 2025 Mondje - Estimation de slaire en CI
