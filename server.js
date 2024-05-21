const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

// Route pour servir le fichier HTML directement
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './indexx.html'));
});

// Route pour exécuter le script shell
app.get('/execute-script', (req, res) => {
    const scriptPath = path.join(__dirname, './nmap/generatepdf.sh');
    const inputHtml = path.join(__dirname, './nmap/templatee.html');
    const outputPdf = path.join(__dirname, 'output123.pdf');

    exec(`${scriptPath} ${inputHtml} ${outputPdf}`, (error, stdout, stderr) => {
        if (error) {
            res.status(500).send(`Erreur lors de l'exécution du fichier shell : ${error.message}`);
            return;
        }

        if (stderr) {
            res.status(500).send(`Erreurs : ${stderr}`);
            return;
        }

        res.send(`Sortie : ${stdout}`);
    });
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});
