
/* ==========================================
   NERD ANGOLA PLANET
   Inicialização do servidor
========================================== */

// Importa a aplicação Express configurada no app.js
const app = require('./app');

// Utiliza a porta do ambiente ou 3000 localmente
const PORT = process.env.PORT || 3000;

// Inicia o servidor HTTP
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
