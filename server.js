const express = require('express');
const path = require('path');
const app = express();

// Configurar diretórios estáticos
app.use(express.static(__dirname)); // Serve arquivos da raiz
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
