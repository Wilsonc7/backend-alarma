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
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
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

    // ✅ Estructura correcta
    const response = await admin.messaging().sendMulticast({
      tokens,
      notification: { title, body },
    });

    console.log(`✅ Notificación enviada a zona=${zona}`, response);

    res.json({
      success: true,
      zona,
      enviados: response.successCount,
      fallidos: response.failureCount,
      detalles: response.responses.map(r => ({
        ok: r.success,
        error: r.error?.message || null,
      })),
    });
  } catch (error) {
    console.error("❌ Error enviando notificación:", error);
    res.status(500).json({ error: error.message });
  }
});

// ================== 🔍 Debug tokens ==================
app.get("/debug-tokens", (req, res) => {
  res.json(tokensPorZona);
});

// ================== 🧹 Reset tokens ==================
app.post("/reset-tokens", (req, res) => {
  for (const zona in tokensPorZona) {
    tokensPorZona[zona] = [];
  }
  console.log("🧹 Todos los tokens fueron limpiados");
  res.json({ ok: true, message: "Tokens reseteados" });
});

// ================== 🚀 Iniciar servidor ==================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend alarma escuchando en puerto ${PORT}`);
});
