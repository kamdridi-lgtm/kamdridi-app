# 🗄️ MongoDB Setup Guide

## Option 1: MongoDB Atlas (gratuit — recommandé)

### Étapes rapides (5 minutes)

1. **Créer un compte**  
   https://www.mongodb.com/cloud/atlas/register

2. **Créer un cluster gratuit**
   - Choisir **M0 Sandbox** (FREE)
   - Région : AWS `us-east-1` (ou la plus proche)
   - Nom du cluster : `dreamgirl-cluster`

3. **Créer un utilisateur database**
   - Username : `dreamgirl_admin`
   - Password : fort et unique

4. **Whitelist IP**
   - Network Access → Add IP Address
   - Autoriser `0.0.0.0/0` (à restreindre plus tard en prod)

5. **Obtenir la connection string**
   - Database → Connect → Connect your application
   - Exemple :

```text
mongodb+srv://dreamgirl_admin:<password>@dreamgirl-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. **Ajouter au `.env`**

```bash
MONGODB_URI=mongodb+srv://dreamgirl_admin:TON_MOT_DE_PASSE@dreamgirl-cluster.xxxxx.mongodb.net/dreamgirl?retryWrites=true&w=majority
```

---

## Option 2: MongoDB local (pour tester)

```bash
# Installer MongoDB Community
# Windows: https://www.mongodb.com/try/download/community
# macOS: brew install mongodb-community

# Démarrer MongoDB
mongod

# URI locale
MONGODB_URI=mongodb://localhost:27017/dreamgirl
```

---

## Structure DB proposée

```text
dreamgirl/
├── users         # clients + achats
├── avatars       # avatars générés
├── messages      # historique chat
├── videos        # vidéos générées
└── transactions  # paiements Stripe
```

---

## Test de connexion

```js
const { MongoClient } = require('mongodb');

async function test() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB connecté!');
  await client.close();
}

test();
```

---

## Limites du plan gratuit (M0)

- ✅ 512 MB storage
- ✅ Pas de carte de crédit requise
- ✅ Suffisant pour un lancement

Quand l'usage monte (ex: 1000+ clients actifs), envisager un upgrade.

---

## Prochaine étape

1. Ajouter l'URI MongoDB dans `.env`
2. Déployer (`npm run deploy` ou `vercel --prod`)
3. Ajouter aussi la variable dans Vercel → Settings → Environment Variables

Ton site sera prêt côté persistance 🚀
