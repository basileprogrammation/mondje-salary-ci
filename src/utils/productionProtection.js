// src/utils/productionProtection.js

export const enableProductionProtection = () => {
  console.log('🔒 Protection activée en production');

  // ❌ 1. Désactiver le clic droit
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // ❌ 2. Désactiver les raccourcis clavier
  document.addEventListener('keydown', (e) => {
    // F12 (DevTools)
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      return false;
    }
    
    // Cmd+Option+I (Mac)
    if (e.metaKey && e.altKey && e.key === 'i') {
      e.preventDefault();
      return false;
    }

    // Cmd+Option+J (Mac Console)
    if (e.metaKey && e.altKey && e.key === 'j') {
      e.preventDefault();
      return false;
    }

    // Cmd+Option+C (Mac Inspect)
    if (e.metaKey && e.altKey && e.key === 'c') {
      e.preventDefault();
      return false;
    }
  });

  // ❌ 3. Désactiver la sélection de texte
  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none';
  document.body.style.mozUserSelect = 'none';
  document.body.style.msUserSelect = 'none';

  // ❌ 4. Désactiver le copier-coller
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    return false;
  });

  document.addEventListener('cut', (e) => {
    e.preventDefault();
    return false;
  });

  // ❌ 5. Détecter l'ouverture des DevTools
  const detectDevTools = () => {
    const threshold = 160;
    
    const check = () => {
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        // DevTools détecté - bloquer la page
        document.body.innerHTML = `
          <div style="
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            font-family: system-ui, -apple-system, sans-serif;
          ">
            <div style="
              background: white;
              padding: 3rem;
              border-radius: 1.5rem;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
              text-align: center;
              max-width: 500px;
            ">
              <div style="font-size: 4rem; margin-bottom: 1rem;">🔒</div>
              <h1 style="
                font-size: 2rem; 
                color: #1f2937; 
                margin-bottom: 1rem; 
                font-weight: bold;
              ">
                Accès Restreint
              </h1>
              <p style="
                color: #6b7280; 
                font-size: 1.1rem; 
                line-height: 1.6;
                margin-bottom: 2rem;
              ">
                Pour des raisons de sécurité, les outils de développement ne sont pas autorisés sur ce site.
              </p>
              <button 
                onclick="window.location.reload()" 
                style="
                  background: linear-gradient(to right, #10b981, #059669);
                  color: white;
                  padding: 0.75rem 2rem;
                  border: none;
                  border-radius: 0.5rem;
                  font-size: 1rem;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.3s;
                "
                onmouseover="this.style.transform='scale(1.05)'"
                onmouseout="this.style.transform='scale(1)'"
              >
                Recharger la page
              </button>
            </div>
          </div>
        `;
      }
    };

    // Vérifier toutes les 500ms
    setInterval(check, 500);
  };

  detectDevTools();

  // ❌ 6. Bloquer la console (optionnel)
  const disableConsole = () => {
    const noop = () => {};
    const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace'];
    
    methods.forEach(method => {
      console[method] = noop;
    });
  };

  disableConsole();
};