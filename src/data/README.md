# 📊 Données de la Fonction Publique de Côte d'Ivoire

Ce dossier contient des données complètes et structurées sur la fonction publique ivoirienne.

## 📁 Fichiers disponibles

### 1. **corps-metiers.json**
Liste exhaustive des corps de métiers par catégorie (A, B, C, D)
- **Contenu :**
  - Description de chaque catégorie
  - Liste des grades
  - Corps de métiers par domaine (Administration, Santé, Éducation, Technique, etc.)
  - Diplômes requis pour chaque catégorie
  - 6 grandes spécialités de la fonction publique

### 2. **grilles-salaires.json**
Grilles détaillées des salaires par grade et catégorie
- **Contenu :**
  - Salaires de base par grade (A1 à A7, B1 à B3, C1 à C3, D1 à D3)
  - Salaires avec primes
  - Échelons et progression salariale
  - Exemples de salaires spécifiques (Professeurs, Médecins, Ingénieurs)
  - Composantes de la rémunération (primes, indemnités, allocations)
  - Déductions (retraite, impôts, CNPS)
  - Comparaisons régionales (Sénégal, Burkina Faso, Maroc)

### 3. **avantages.json**
Avantages complets de la fonction publique
- **Contenu :**
  - Avantages généraux (stabilité, retraite, santé, congés)
  - Avantages financiers (primes, 13ème mois, indemnités)
  - Avantages sociaux (logement, prêts, mutuelle)
  - Avantages spécifiques par corps (enseignants, santé, sécurité, cadres)
  - Avantages post-service (retraite, capital décès, décorations)
  - Comparaison fonction publique vs secteur privé

### 4. **concours.json**
Liste complète des concours 2025
- **Contenu :**
  - 598 opportunités (204 recrutements nouveaux, 343 promotions)
  - Concours par catégorie (A, B, C, D)
  - Concours éducation (4109 postes CAFOP, Professeurs)
  - Concours santé (INFAS et autres)
  - Concours ENA (3 cycles)
  - Modalités d'inscription
  - Calendrier complet
  - Centres de composition
  - Ressources et contacts

## 🎯 Utilisation

### Dans React/JavaScript
```javascript
import corpsMetiers from './data/corps-metiers.json';
import grillesSalaires from './data/grilles-salaires.json';
import avantages from './data/avantages.json';
import concours from './data/concours.json';

// Exemple: Récupérer les métiers de catégorie A
const metiersA = corpsMetiers.categories.categorie_A.corps_metiers;

// Exemple: Récupérer le salaire pour le grade A3
const salaireA3 = grillesSalaires.grilles_salariales.categorie_A.grades.A3;

// Exemple: Lister tous les concours de catégorie B
const concoursB = concours.concours_par_categorie.categorie_B;
```

### Lecture directe
Tous les fichiers sont en JSON pur et peuvent être lus directement par :
- Éditeurs de texte (VS Code, Sublime, etc.)
- Outils JSON (jq, JSONLint)
- Tableurs (Excel, Google Sheets) après conversion
- Langages de programmation (Python, PHP, Java, etc.)

## 📈 Structure des données

### Catégories de la Fonction Publique
- **Catégorie A** : Cadres supérieurs (BAC+3 minimum) - 7 grades
- **Catégorie B** : Cadres intermédiaires (BAC à BAC+2) - 3 grades
- **Catégorie C** : Agents d'application (BEPC, CAP) - 3 grades
- **Catégorie D** : Agents d'exécution (CEP ou sans diplôme) - 3 grades

### Fourchettes de salaires (FCFA)
- **Catégorie A** : 247 539 - 750 000 (base) / 320 000 - 1 000 000 (avec primes)
- **Catégorie B** : 200 000 - 420 000 (base) / 250 000 - 530 000 (avec primes)
- **Catégorie C** : 180 000 - 330 000 (base) / 220 000 - 400 000 (avec primes)
- **Catégorie D** : 169 769 - 280 000 (base) / 200 000 - 340 000 (avec primes)

## 🔄 Mise à jour

**Dernière mise à jour :** 17 janvier 2025

**Sources :**
- Ministère de la Fonction Publique de Côte d'Ivoire
- Site officiel : https://fonctionpublique.gouv.ci
- Plateforme des concours : https://gucaci.ciconcours.com
- Recherches web sur sites officiels ivoiriens

## 📞 Contact

Pour toute question ou mise à jour :
- **Email :** contact@bahn.ci
- **Site :** https://bahn.app
- **Numéro vert (Concours) :** 1364

## ⚠️ Avertissement

Les informations contenues dans ces fichiers sont fournies à titre informatif. 
Pour toute démarche officielle, veuillez vous référer aux sources officielles du 
Ministère de la Fonction Publique de Côte d'Ivoire.

## 📜 Licence

© 2025 BAHN - Better African Higher Network
Ces données sont destinées à un usage personnel et éducatif.

---

**Créé avec ❤️ pour la Côte d'Ivoire 🇨🇮**
