🛍️ E-commerce Frontend

Ce projet est le **frontend** d’une application e-commerce.  
Il est développé avec **Angular** et communique avec le backend Spring Boot via API REST.

 🚀 Technologies utilisées
- Angular 16+
- TypeScript
- HTML / CSS / Bootstrap
- Angular Router
- HttpClient (pour consommer l’API)

 📂 Structure du projet
- `src/app/components` → Composants Angular
- `src/app/services` → Services pour appeler l’API
- `src/environments` → Configuration d’API
- `angular.json` → Configuration Angular

 ⚙️ Installation & exécution
1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/jihenrabouch/ecommerce-frontend.git
   cd ecommerce-frontend
Installer les dépendances

bash
Copier le code
npm install
Configurer l’URL de l’API backend
Dans src/environments/environment.ts :

typescript
Copier le code
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api'
};
Lancer l’application

bash
Copier le code
ng serve
Puis ouvrir http://localhost:4200

🔗 Lien associé
Backend : https://github.com/jihenrabouch/ecommerce-api

👩‍💻 Développé par Jihen Rabouch

yaml
Copier le code
