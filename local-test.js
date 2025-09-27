// local-test.js
const admin = require("firebase-admin");
require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

(async () => {
  try {
    const response = await admin.messaging().send({
      token: "equnZbCNQ2ObTk-57e6hKj:APA91bHg5qRtBxAZ2fMa4UqNZh3isPGYYgu6p8TVBcOcEeRVWxWvqPLUbj8oRWZ0uNWFwEHV-mLx-_3e__W0M8cnRbI5GR6YbmoqTnoZpDAEQgJvpkrIByg",
      notification: {
        title: "🚨 Test directo",
        body: "Notificación enviada desde local-test.js"
      }
    });

    console.log("✅ Notificación enviada:", response);
  } catch (err) {
    console.error("❌ ERROR", err.message);
  }
})();
