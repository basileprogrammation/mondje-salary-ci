// scripts/migrateToFirestore.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch, getDocs } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== CONFIGURATION FIREBASE - PROJET BAHN (sira-650f4) ==========
const firebaseConfig = {
  apiKey: "AIzaSyAwJ8wuFpvzUCRxJIBFpbI3OjY4DlVRfdc",
  authDomain: "sira-650f4.firebaseapp.com",
  projectId: "sira-650f4",
  storageBucket: "sira-650f4.firebasestorage.app",
  messagingSenderId: "354782079410",
  appId: "1:354782079410:web:16937d9db126c5285f1cab",
  measurementId: "G-0ZWL02N5BG"
};

console.log(`🔥 Connexion au projet Firebase: ${firebaseConfig.projectId}\n`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ========== VÉRIFIER LES DONNÉES EXISTANTES ==========
async function checkExistingData() {
  console.log('🔍 Vérification des données existantes...');
  
  try {
    const publicSnapshot = await getDocs(collection(db, 'salaires_public'));
    const priveSnapshot = await getDocs(collection(db, 'salaires_prive'));
    
    if (!publicSnapshot.empty || !priveSnapshot.empty) {
      console.log('⚠️  Des données existent déjà dans Firestore !');
      console.log(`   - Salaires public: ${publicSnapshot.size} documents`);
      console.log(`   - Salaires privé: ${priveSnapshot.size} documents\n`);
      
      // Pour Node.js, utiliser readline
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      return new Promise((resolve) => {
        rl.question('❓ Voulez-vous écraser les données existantes ? (oui/non): ', (answer) => {
          rl.close();
          resolve(answer.toLowerCase() === 'oui');
        });
      });
    }
    
    console.log('✅ Aucune donnée existante détectée\n');
    return true;
  } catch (error) {
    console.log('✅ Collections vides, migration possible\n');
    return true;
  }
}

// ========== MIGRATION SECTEUR PRIVÉ ==========
async function migrateSalairesPrives() {
  console.log('🚀 Migration Salaires Privés...');
  
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../src/data/salaires-secteur-prive.json'), 'utf-8')
  );

  const secteurs = data.secteur_prive.secteurs;
  let totalSecteurs = 0;
  let totalSousDomaines = 0;
  let totalMetiers = 0;
  
  for (const [secteurKey, secteurData] of Object.entries(secteurs)) {
    console.log(`  📁 Secteur: ${secteurData.nom}`);
    totalSecteurs++;
    
    await setDoc(doc(db, 'salaires_prive', secteurKey), {
      nom: secteurData.nom,
      description: secteurData.description || '',
      created_at: new Date(),
      updated_at: new Date()
    });

    if (secteurData.sous_domaines) {
      for (const [sousDomaineKey, sousDomaineData] of Object.entries(secteurData.sous_domaines)) {
        console.log(`    📂 Sous-domaine: ${sousDomaineData.nom}`);
        totalSousDomaines++;
        
        await setDoc(
          doc(db, 'salaires_prive', secteurKey, 'sous_domaines', sousDomaineKey),
          {
            nom: sousDomaineData.nom,
            description: sousDomaineData.description || ''
          }
        );

        if (sousDomaineData.metiers) {
          for (const [metierKey, metierData] of Object.entries(sousDomaineData.metiers)) {
            await setDoc(
              doc(db, 'salaires_prive', secteurKey, 'sous_domaines', sousDomaineKey, 'metiers', metierKey),
              {
                titre: metierData.titre,
                description: metierData.description || '',
                niveaux: metierData.niveaux || {}
              }
            );
            totalMetiers++;
          }
        }
      }
    }
  }
  
  console.log(`✅ Privé: ${totalSecteurs} secteurs, ${totalSousDomaines} sous-domaines, ${totalMetiers} métiers\n`);
}

// ========== MIGRATION SECTEUR PUBLIC ==========
async function migrateSalairesPublic() {
  console.log('🚀 Migration Salaires Public...');
  
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../src/data/corps-metiers.json'), 'utf-8')
  );

  const categories = data.categories;
  let totalCategories = 0;
  let totalMetiers = 0;
  
  for (const [categorieKey, categorieData] of Object.entries(categories)) {
    console.log(`  📁 Catégorie: ${categorieData.nom}`);
    totalCategories++;
    
    await setDoc(doc(db, 'salaires_public', categorieKey), {
      nom: categorieData.nom,
      description: categorieData.description || '',
      diplome_requis: categorieData.diplome_requis || '',
      grades: categorieData.grades || [],
      grille_salariale: categorieData.grille_salariale || {},
      created_at: new Date(),
      updated_at: new Date()
    });

    if (categorieData.corps_metiers) {
      const batch = writeBatch(db);
      let batchCount = 0;

      for (const corpsData of categorieData.corps_metiers) {
        if (corpsData.metiers) {
          for (const metier of corpsData.metiers) {
            const metierDoc = doc(
              collection(db, 'salaires_public', categorieKey, 'metiers')
            );
            
            batch.set(metierDoc, {
              nom: typeof metier === 'string' ? metier : metier.nom,
              domaine: corpsData.domaine,
              grade_entree_estime: metier.grade_entree_estime || '',
              salaire_brut_debut_estime: metier.salaire_brut_debut_estime || 0,
              mots_cles: metier.mots_cles || []
            });

            batchCount++;
            totalMetiers++;

            if (batchCount >= 500) {
              await batch.commit();
              console.log(`    ✅ ${totalMetiers} métiers enregistrés...`);
              batchCount = 0;
            }
          }
        }
      }

      if (batchCount > 0) {
        await batch.commit();
      }
    }
  }
  
  console.log(`✅ Public: ${totalCategories} catégories, ${totalMetiers} métiers\n`);
}

// ========== EXÉCUTION ==========
async function migrate() {
  try {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   Migration BAHN → Firestore (sira-650f4) ║');
    console.log('╚════════════════════════════════════════════╝\n');
    
    const canProceed = await checkExistingData();
    
    if (!canProceed) {
      console.log('❌ Migration annulée par l\'utilisateur');
      process.exit(0);
    }
    
    await migrateSalairesPrives();
    await migrateSalairesPublic();
    
    console.log('╔════════════════════════════════════════════╗');
    console.log('║       ✅ Migration terminée avec succès!   ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log(`\n📊 Projet: ${firebaseConfig.projectId}`);
    console.log('🔗 Console: https://console.firebase.google.com/project/sira-650f4/firestore\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur de migration:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

migrate();