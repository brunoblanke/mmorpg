const express = require('express');
const path = require('path');
const app = express();

// ✅ Serve arquivos estáticos da pasta public/
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Rota principal carrega o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Porta do Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});