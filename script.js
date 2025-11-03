// ============================================
//  SCRIPT PRINCIPAL PARA GENERADOR DE SESIONES
//  Vinculado al Currículo Nacional MINEDU
// ============================================

// Variable global para guardar los datos del JSON
let competencias = {};

// 1️⃣ Cargar el archivo JSON con competencias de matemática
async function cargarCompetencias() {
  try {
    const response = await fetch("data/competencias_matematica_minedu.json");
    competencias = await response.json();
    console.log("✅ Competencias cargadas correctamente:", competencias);
  } catch (error) {
    console.error("❌ Error al cargar competencias:", error);
  }
}

// 2️⃣ Función para mostrar datos según grado seleccionado
function mostrarCompetencias() {
  const gradoSeleccionado = document.getElementById("grado").value;
  const info = competencias[gradoSeleccionado];
  const contenedor = document.getElementById("competenciasContainer");

  if (!info) {
    contenedor.innerHTML = `<p style="color:red;">Selecciona un grado válido.</p>`;
    return;
  }

  // Crear estructura HTML con los datos del JSON
  contenedor.innerHTML = `
    <h3>Competencia:</h3>
    <p>${info.competencia}</p>

    <h3>Capacidades:</h3>
    <ul>${info.capacidades.map(cap => `<li>${cap}</li>`).join("")}</ul>

    <h3>Desempeños:</h3>
    <ul>${info.desempenos.map(des => `<li>${des}</li>`).join("")}</ul>
  `;
}

// 3️⃣ Escuchar cambios en el campo "grado"
document.addEventListener("DOMContentLoaded", () => {
  // Cargar las competencias al iniciar la página
  cargarCompetencias();

  // Asignar evento de cambio al desplegable de grados
  const selectGrado = document.getElementById("grado");
  if (selectGrado) {
    selectGrado.addEventListener("change", mostrarCompetencias);
  }
});



// script.js - Generador de sesión con integración opcional ChatGPT (proxy)

// ------- Datos curriculares ejemplo (puedes reemplazar con el JSON real extraído) -------
const competenciasByGrade = {
  "1": {
    competencia: "Resuelve problemas de cantidad y desarrolla sentido numérico",
    capacidades: [
      "Comprende el número como cantidad y utiliza operaciones básicas (adición/sustracción)",
      "Representa situaciones con dibujos y conteos",
      "Comunica procedimientos y resultados sencillos"
    ],
    desempenos: [
      "Resuelve problemas sencillos de adición y sustracción",
      "Explica el proceso de conteo usado"
    ]
  },
  "2": {
    competencia: "Resuelve problemas de cantidad usando estrategias personales",
    capacidades: ["Relaciona el número con la cantidad", "Utiliza adición y sustracción hasta 100"],
    desempenos: ["Resuelve problemas con explicación de la estrategia"]
  },
  "3": {
    competencia: "Resuelve problemas de cantidad y magnitud",
    capacidades: ["Aplica multiplicación y división en contextos reales"],
    desempenos: ["Modela situaciones mediante multiplicación"]
  },
  "4": {
    competencia: "Resuelve problemas con operaciones combinadas",
    capacidades: ["Aplica propiedades de operaciones", "Estima resultados"],
    desempenos: ["Resuelve problemas con dos pasos"]
  },
  "5": {
    competencia: "Resuelve problemas de proporción y porcentaje",
    capacidades: ["Opera con fracciones y decimales", "Calcula porcentajes"],
    desempenos: ["Aplica porcentajes en contexto"]
  },
  "6": {
    competencia: "Resuelve problemas con pensamiento algebraico inicial",
    capacidades: ["Modela relaciones con expresiones", "Resuelve ecuaciones simples"],
    desempenos: ["Interpreta y aplica ecuaciones sencillas"]
  }
};

// ------- Selectores -------
const btnGenerate = document.getElementById('btnGenerate');
const btnChatGPT = document.getElementById('btnChatGPT');
const btnPdf = document.getElementById('btnPdf');
const btnCopy = document.getElementById('btnCopy');
const btnPrint = document.getElementById('btnPrint');
const btnClear = document.getElementById('btnClear');
const output = document.getElementById('sessionOutput');

btnGenerate.addEventListener('click', generarSesion);
btnChatGPT.addEventListener('click', generarConChatGPT);
btnPdf.addEventListener('click', descargarPDF);
btnCopy.addEventListener('click', copiarTexto);
btnPrint.addEventListener('click', imprimir);
btnClear.addEventListener('click', limpiar);

// Helper para leer inputs
function readInputs(){
  return {
    institucion: document.getElementById('institucion').value || 'I.E. (no especificada)',
    grado: document.getElementById('grado').value,
    docente: document.getElementById('docente').value || '(docente no especificado)',
    fecha: document.getElementById('fecha').value || new Date().toISOString().slice(0,10),
    duracion: document.getElementById('duracion').value || 45,
    campo: document.getElementById('campo').value,
    transversal: document.getElementById('transversal').value,
    situacion: document.getElementById('situacion').value || '(situación no proporcionada)'
  };
}

// Genera la sesión local (sin IA)
function generarSesion(){
  const d = readInputs();
  const meta = competenciasByGrade[d.grado] || { competencia: 'Competencia genérica', capacidades: ['Capacidad 1'], desempenos: ['Desempeño 1']};

  // construir HTML de salida
  const html = `
    <div class="session">
      <div class="session-title">TÍTULO: ${generarTitulo(d.situacion, d.grado, d.campo)}</div>

      <div class="data-row">
        <div class="data-item"><strong>Institución</strong><div>${escapeHtml(d.institucion)}</div></div>
        <div class="data-item"><strong>Grado</strong><div>${d.grado}°</div></div>
        <div class="data-item"><strong>Docente</strong><div>${escapeHtml(d.docente)}</div></div>
        <div class="data-item"><strong>Fecha</strong><div>${d.fecha}</div></div>
        <div class="data-item"><strong>Duración</strong><div>${d.duracion} minutos</div></div>
      </div>

      <h3>Propósitos de aprendizaje</h3>

      <table class="table sixcols" aria-label="propósitos">
        <thead>
          <tr>
            <th>Competencia</th><th>Capacidades</th><th>Desempeños</th><th>Criterios de evaluación</th><th>Evidencia de aprendizaje</th><th>Instrumento</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${escapeHtml(meta.competencia)}</td>
            <td>${meta.capacidades.map(c=>escapeHtml(c)).join('<br>')}</td>
            <td>${meta.desempenos.map(d=>escapeHtml(d)).join('<br>')}</td>
            <td>Resuelve el problema aplicando estrategias; representa resultados; comunica conclusiones.</td>
            <td>Producto grupal: registro, exposición, ficha de trabajo.</td>
            <td>Rúbrica de desempeño y lista de cotejo.</td>
          </tr>
        </tbody>
      </table>

      <h3>Competencias transversales</h3>
      <div class="comp-box">
        <table class="table">
          <thead><tr><th>Competencia transversal</th><th>Desempeños integrados</th></tr></thead>
          <tbody>
            <tr><td>Gestiona su aprendizaje de manera autónoma</td><td>Define metas de aprendizaje y organiza acciones; usa recursos; revisa su progreso.</td></tr>
            <tr><td>Organiza acciones estratégicas</td><td>Planifica actividades, colabora con pares y aplica estrategias para alcanzar metas.</td></tr>
            <tr><td>Monitorea y ajusta su desempeño</td><td>Evalúa su trabajo, pide retroalimentación y ajusta procesos para mejorar.</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Enfoque transversal</h3>
      <div class="comp-box">
        <table class="table">
          <thead><tr><th>Enfoque</th><th>Actitudes / acciones observables</th></tr></thead>
          <tbody>
            <tr><td>De derechos</td><td>Respeta derechos y participa en decisiones.</td></tr>
            <tr><td>Inclusivo</td><td>Adapta actividades y apoya la diversidad.</td></tr>
            <tr><td>Intercultural</td><td>Valora saberes culturales y tradiciones.</td></tr>
            <tr><td>Igualdad de género</td><td>Promueve participación equitativa.</td></tr>
            <tr><td>Ambiental</td><td>Propone acciones para el cuidado del entorno.</td></tr>
            <tr><td>Bien común</td><td>Contribuye en proyectos comunitarios.</td></tr>
            <tr><td>Excelencia</td><td>Busca mejora continua y calidad en la tarea.</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Secuencia didáctica</h3>
      <h4>Inicio</h4>
      <p>Bienvenida; presentación del propósito; recuperación de saberes previos mediante preguntas; recordatorio de normas de convivencia.</p>

      <h4>Desarrollo</h4>
      <ol>
        <li><strong>Planteamiento del problema:</strong> ${escapeHtml(d.situacion)}</li>
        <li><strong>Familiarización:</strong> Lectura del problema y preguntas guías por parte del docente.</li>
        <li><strong>Búsqueda y ejecución de la estrategia:</strong> Discusión de estrategias, uso de material concreto y procedimientos.</li>
        <li><strong>Socializa sus representaciones:</strong> Exposición de bocetos y soluciones grupales.</li>
        <li><strong>Reflexión y formalización:</strong> Preguntas para consolidar procedimientos y conceptos.</li>
        <li><strong>Planteamiento de otros problemas:</strong> Aplicación a nuevas situaciones.</li>
      </ol>

      <h4>Cierre</h4>
      <p>Preguntas de metacognición: ¿Qué estrategia ayudó más? ¿Qué cambiaría la próxima vez? Registro de evidencias y tareas.</p>

      <hr>
      <div style="font-size:13px;color:#556;font-style:italic">Nota: adapta el lenguaje y complejidad según el grado seleccionado.</div>
    </div>
  `;
  output.innerHTML = html;
  // smooth scroll to output
  output.scrollIntoView({behavior:'smooth'});
}

// Generar título breve a partir de la situación
function generarTitulo(situacion, grado, campo){
  if(!situacion || situacion.trim().length<6) return `${campo} - Sesión ${grado}°`;
  const t = situacion.trim().split(/\s+/).slice(0,8).join(' ');
  return `${t} (${grado}°)`;
}

// ------- Exportar a PDF usando html2pdf -------
function descargarPDF(){
  const element = output;
  if(!element.innerText.trim()){
    alert('Genera la sesión primero antes de descargar.');
    return;
  }
  // Opciones
  const opt = {
    margin:       10,
    filename:     'Sesion_Aprendizaje_Matematica.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}

// ------- Copiar texto -------
async function copiarTexto(){
  const text = output.innerText || "";
  if(!text.trim()){ alert('No hay contenido para copiar.'); return; }
  try {
    await navigator.clipboard.writeText(text);
    alert('Contenido copiado al portapapeles.');
  } catch(e){
    // fallback
    const range = document.createRange();
    range.selectNodeContents(output);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    document.execCommand('copy');
    sel.removeAllRanges();
    alert('Copiado (fallback).');
  }
}

// ------- Imprimir -------
function imprimir(){
  const printWindow = window.open('','_blank','width=900,height=700');
  printWindow.document.write(`
    <html><head><title>Imprimir sesión</title>
    <style>
      body{font-family:Arial,Helvetica,sans-serif;padding:20px;color:#07243a}
      pre{white-space:pre-wrap}
    </style>
    </head><body>${output.innerHTML}</body></html>`);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(()=>{ printWindow.print(); }, 400);
}

// ------- Limpiar formulario y salida -------
function limpiar(){
  document.getElementById('institucion').value='';
  document.getElementById('docente').value='';
  document.getElementById('fecha').value='';
  document.getElementById('duracion').value='45';
  document.getElementById('situacion').value='';
  document.getElementById('salida'); // safe
  output.innerHTML = '<div class="placeholder">Pulse "Generar sesión" o "Generar con ChatGPT" para ver el resultado aquí.</div>';
}

// ------- Integración con ChatGPT (proxy) -------
async function generarConChatGPT(){
  const d = readInputsForChat();
  output.innerHTML = '<div class="placeholder">Generando con ChatGPT... espere por favor.</div>';
  try {
    // Ajusta la URL si tu proxy está en otro dominio
    const res = await fetch('/api/openai', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(d)
    });
    if(!res.ok){
      const err = await res.text();
      throw new Error(err || 'Error en proxy');
    }
    const data = await res.json();
    // Esperamos que el proxy devuelva { text: "..." } con HTML o texto plan
    const txt = data.text || data.result || JSON.stringify(data,null,2);
    // Simple: mostrarmos en salida - si el texto está en formato plan, lo envolvemos; si contiene tags, lo insertamos
    if(txt.trim().startsWith('<')) output.innerHTML = txt;
    else output.innerHTML = `<pre style="white-space:pre-wrap">${escapeHtml(txt)}</pre>`;
  } catch(e){
    output.innerHTML = `<div class="placeholder">Error al generar con ChatGPT: ${escapeHtml(e.message)}</div>`;
  }
}

// lee inputs para enviar al proxy
function readInputsForChat(){
  const base = readInputs();
  // costruir prompt minimal para el proxy
  base.prompt = `Eres un docente experto en primaria (MINEDU). Genera una sesión de aprendizaje de Matemática para grado ${base.grado}.
Situación significativa: ${base.situacion}
Incluir: título, datos generales, propósitos (competencia, capacidades, desempeños, criterios, evidencia, instrumento), competencias transversales con desempeños, enfoques transversales con acciones observables, y secuencia didáctica (Inicio, Desarrollo con 6 fases, Cierre). Devuélvelo en texto estructurado y legible.`;
  return base;
}

// ------- utilitarios -------
function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function readInputs(){
  return {
    institucion: document.getElementById('institucion').value || 'I.E. (no especificada)',
    grado: document.getElementById('grado').value,
    docente: document.getElementById('docente').value || '(docente no especificado)',
    fecha: document.getElementById('fecha').value || new Date().toISOString().slice(0,10),
    duracion: document.getElementById('duracion').value || 45,
    campo: document.getElementById('campo').value,
    transversal: document.getElementById('transversal').value,
    situacion: document.getElementById('situacion').value || '(situación no proporcionada)'
  };
}
