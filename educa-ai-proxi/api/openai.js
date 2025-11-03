// api/openai.js
//
// Simple proxy that recibe datos desde el frontend y llama a la API de OpenAI.
// Requisitos:
// - NODE >= 18 (soporta fetch nativo). Si usas Node < 18, instala node-fetch o undici.
// - Define la variable de entorno OPENAI_API_KEY en el host (Vercel, Render, etc.)
// - Ajusta model si es necesario (por ejemplo: "gpt-4o-mini" o "gpt-4o-mini-1")

import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "1mb" }));

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.error("FATAL: OPENAI_API_KEY no está definida en las variables de entorno.");
}

app.post("/api/openai", async (req, res) => {
  try {
    if (!OPENAI_KEY) return res.status(500).json({ error: "OPENAI_API_KEY no definida en servidor." });

    // Recibe payload desde frontend. Espera campos: institucion, grado, docente, fecha, duracion, campo, transversal, situacion
    const body = req.body || {};
    // Construye prompt (puedes personalizar la plantilla)
    const prompt = `
Eres un docente experto en primaria (MINEDU). Genera una sesión de aprendizaje para el área de Matemática.
Campos:
- Grado: ${body.grado || "no especificado"}
- Campo temático: ${body.campo || "no especificado"}
- Enfoque transversal: ${body.transversal || "no especificado"}
- Situación significativa: ${body.situacion || "no especificada"}

Entrega:
1) Título de la sesión.
2) Datos generales (institución, grado, docente, fecha, duración).
3) Propósitos de aprendizaje (competencia, capacidades, desempeños, criterios, evidencia, instrumento) en formato claro.
4) Competencias transversales y desempeños.
5) Enfoque transversal y acciones/actitudes observables.
6) Secuencia didáctica (Inicio, Desarrollo con 6 fases, Cierre).

Devuélvelo en texto estructurado (preferiblemente en HTML simple o texto formateado) para mostrar en el frontend.
`;

    // Llamada al endpoint de Chat Completions
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",           // Ajusta el modelo según tu acceso
        messages: [
          { role: "system", content: "Eres un asistente pedagógico experto en primaria y en el currículo MINEDU." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1400,
        temperature: 0.2
      })
    });

    if (!openaiResp.ok) {
      const errorBody = await openaiResp.text();
      console.error("OpenAI API error:", openaiResp.status, errorBody);
      return res.status(502).json({ error: "Error desde OpenAI", detail: errorBody });
    }

    const json = await openaiResp.json();
    // Extraemos el contenido principal
    const text = (json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content) || JSON.stringify(json);

    // Devuelve la respuesta al frontend
    return res.json({ text, raw: json });
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Si ejecutas como servidor completo (Render), escucha puerto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`OpenAI proxy listening on port ${port}`);
});

// --- Nota para Vercel (serverless functions):
// Si lo despliegas en Vercel como función en /api/openai.js, en lugar de app.listen,
// exporta el handler compatible con Vercel:
//
// export default app;
// (Vercel detecta Express y lo ejecuta como función).

