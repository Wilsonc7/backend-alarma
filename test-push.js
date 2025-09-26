// test-push.js
const admin = require("firebase-admin");
require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

// 🔑 usa uno de los tokens que viste en /debug-tokens
const targetToken = "fuOLZkuJSfuSRDYMzw6XdJ:APA91bHCE5JdLZcnj8L-MpPdlOIRT9jRnSDzPzFuHsb3dcWSK03PYV8Iz2fkNFyvAuZ6PGBmRSr45JKGAMUReWwMu7A8lRv-eoRHzyRJtVDKJ4oEpVfXi_w";

const message = {
  notification: {
    title: "🚨 Prueba Node.js",
    body: "Notificación directa desde test-push.js ✅",
  },
  token: targetToken,
};

admin.messaging().send(message)
  .then((response) => {
    console.log("✅ Notificación enviada:", response);
  })
  .catch((error) => {
    console.error("❌ Error enviando notificación:", error);
  });
