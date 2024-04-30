const express = require('express');
const http = require('http');
const nmap = require('node-nmap');
const pdfkit = require('pdfkit');
const fs = require('fs');

const app = express();
const port = 3000;

// Point de terminaison pour la route principale (/)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
const server = http.createServer((req, res) => {
  if (req.url === '/scan') {
// Point de terminaison pour la route de scan (/scan)

  // Exécuter le scan Nmap
  nmap.scan('142.251.37.174/24', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erreur lors du scan Nmap');
      return;
    }

    // Générer le rapport PDF
    const doc = new pdfkit();
    const hosts = results.hosts;

    // ... (Le reste du code de génération de rapport PDF est identique)

    // Générer le fichier PDF et envoyer à l'utilisateur
    doc.end();
    const pdfBuffer = doc.pipe(new Buffer()).buffer;
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', 'attachment; filename=report.pdf');
    res.send(pdfBuffer);
  });
}});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
