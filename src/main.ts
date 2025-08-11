// Bootstrap mínimo para Fase 1
const app = document.getElementById('app')!
app.innerHTML = `
  <style>
    body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif}
    .container{padding:16px}
    .note{background:#f0f9ff;border:1px solid #bae6fd;color:#0c4a6e;padding:12px;border-radius:8px}
    .actions{margin-top:12px}
  </style>
  <div class="container">
    <h1>Metaballs Editor</h1>
    <p class="note">Fase 1 lista. A continuación integraremos el SVG existente y comenzaremos la migración modular.</p>
    <div class="actions">
      <a href="svg-editor2.html" class="button">Abrir editor SVG</a>
    </div>
  </div>
`;