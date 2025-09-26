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
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // 🔧 Fix para Railway
  }),
});

// ================== 📦 Memoria temporal de tokens ==================
const tokensPorZona = {}; // { zona1: [token1, token2], zona2: [...] }

// ================== 📲 Registro de token ==================
app.post("/register-token", (req, res) => {
  const { token, zona } = req.body;

  if (!token || !zona) {
    return res.status(400).json({ error: "Faltan parámetros token o zona" });
  }

  if (!tokensPorZona[zona]) tokensPorZona[zona] = [];
  if (!tokensPorZona[zona].includes(token)) {
    tokensPorZona[zona].push(token);
  }

  console.log(`📲 Token registrado en zona=${zona}, total=${tokensPorZona[zona].length}`);

  res.json({ ok: true, zona, tokens: tokensPorZona[zona] });
});

// ================== 🚨 Enviar notificación a toda una zona ==================
app.post("/send-notification", async (req, res) => {
  try {
    const { zona, title, body } = req.body;

    if (!zona || !title || !body) {
      return res.status(400).json({ error: "Faltan parámetros zona, title o body" });
    }

    const tokens = tokensPorZona[zona] || [];
    if (tokens.length === 0) {
      return res.status(404).json({ error: `No hay tokens registrados en zona ${zona}` });
    }

    const message = {
      notification: { title, body },
      tokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log(`✅ Notificación enviada a zona=${zona}:`, response);

    res.json({ success: true, zona, enviados: response.successCount, fallidos: response.failureCount });
  } catch (error) {
    console.error("❌ Error enviando notificación:", error);
    res.status(500).json({ error: error.message });
  }
});

// ================== (Opcional) Obtener zona ==================
app.get("/get-zona", (req, res) => {
  const { telefono } = req.query;
  if (!telefono) {
    return res.status(400).json({ error: "Falta parámetro telefono" });
  }

  // ⚠️ Por ahora es fijo (puedes mejorarlo con DB en el futuro)
  const zona = "h3m38";
  res.json({ ok: true, zona });
});

// ================== 🚀 Iniciar servidor ==================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend alarma escuchando en puerto ${PORT}`);
});
