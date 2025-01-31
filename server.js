const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Configurações básicas
app.use(cors());
app.use(express.json());

// Configurar diretórios estáticos
app.use(express.static(__dirname)); // Serve arquivos da raiz
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Rota principal
app.get('/', (req, res) => {
    console.log('Requisição recebida na rota principal');
    res.sendFile(path.join(__dirname, 'index.html'));
 });

// Rota de health check
app.get('/health', (req, res) => {
    console.log('Health check realizado');
    res.status(200).json({ status: 'ok' });
});

// Exportar o app para a Vercel
module.exports = app;

// Rodar localmente
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}
