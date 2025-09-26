import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// 🔑 Server key de Firebase (copia desde Firebase Console > Configuración del proyecto > Cuentas de servicio > Token de servidor)
const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY;

// Endpoint que el ESP32 llamará
app.post("/notificar", async (req, res) => {
  try {
    const { titulo, mensaje, zona } = req.body;

    if (!titulo || !mensaje || !zona) {
      return res.status(400).json({ error: "Faltan campos en el body" });
    }

    // 📡 Payload de Firebase
    const payload = {
      notification: {
        title: titulo,
        body: mensaje
      },
      data: {
        zona: zona
      },
      topic: zona // 👈 todos los móviles suscritos a esta zona reciben la notificación
    };

    // 🚀 Enviar a FCM
    const response = await axios.post(
      "https://fcm.googleapis.com/fcm/send",
      payload,
      {
        headers: {
          "Authorization": `key=${FCM_SERVER_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Notificación enviada:", response.data);
    res.json({ ok: true, fcm: response.data });
  } catch (err) {
    console.error("❌ Error enviando notificación:", err.message);
    res.status(500).json({ error: "Error interno" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Alarma escuchando en puerto ${PORT}`);
});
