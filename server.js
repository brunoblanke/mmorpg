import express from 'express';
const app = express();

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎮 Servidor rodando em http://localhost:${PORT}`);
});
