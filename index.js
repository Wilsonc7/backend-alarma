// ===================================================================
// 🚨 Backend Alarma Comunitaria - index.js
// ===================================================================
const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// ================== 🔥 Inicializar Firebase con .env ==================
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

// ================== 🚨 Endpoint para enviar notificación ==============
app.post("/send-notification", async (req, res) => {
  try {
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
      return res.status(400).json({ error: "Faltan parámetros" });
    }

    const message = {
      notification: { title, body },
      token,
    };

    const response = await admin.messaging().send(message);
    console.log("✅ Notificación enviada:", response);

    res.json({ success: true, response });
  } catch (error) {
    console.error("❌ Error enviando notificación:", error);
    res.status(500).json({ error: error.message });
  }
});

// ================== 🚀 Iniciar servidor ==================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend alarma escuchando en puerto ${PORT}`);
});
