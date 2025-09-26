// test-firebase.js
const admin = require("firebase-admin");
require("dotenv").config();

async function main() {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });

    console.log("✅ Firebase inicializado correctamente");

    // Probar obtener un access token (confirma que las credenciales sirven)
    const token = await admin.app().options.credential.getAccessToken();
    console.log("🔑 Access token (inicio):", token.access_token.slice(0, 40), "...");
  } catch (err) {
    console.error("❌ Error inicializando Firebase:", err.message);
  }
}

main();
