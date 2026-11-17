
/* ==========================================
   NERD ANGOLA PLANET
   Inicialização do servidor
========================================== */

// Importa a aplicação Express configurada no app.js
const app = require('./app');

// Define a porta utilizada pelo backend
const PORT = 3000;

// Inicia o servidor HTTP
app.listen(PORT, () => {
  console.log(
    `Servidor rodando em http://localhost:${PORT}`
  );
});
