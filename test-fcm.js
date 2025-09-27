const admin = require("firebase-admin");
require("dotenv").config();

// Inicializar Firebase con las credenciales de entorno (.env en Railway o local)
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

// ⚠️ Token de tu celular (copiado de logs)
const testToken = "equnZbCNQ2ObTk-57e6hKj:APA91bHg5qRtBxAZ2fMa4UqNZh3isPGYYgu6p8TVBcOcEeRVWxWvqPLUbj8oRWZ0uNWFwEHV-mLx-_3e__W0M8cnRbI5GR6YbmoqTnoZpDAEQgJvpkrIByg";

// Mensaje de prueba
const message = {
  notification: {
    title: "🚨 Test Directo",
    body: "Esta notificación va directo al token desde test-fcm.js",
  },
  token: testToken,
};

// Enviar
admin.messaging().send(message)
  .then((response) => {
    console.log("✅ Notificación enviada correctamente:", response);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error enviando notificación:", error);
    process.exit(1);
  });
