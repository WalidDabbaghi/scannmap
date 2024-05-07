const http = require('http');
const fs = require('fs');
const path = require('path');
const ZAPClient = require('zaproxy');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        // Envoyer le fichier HTML au client
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Erreur interne du serveur');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.url === '/scan' && req.method === 'POST') {
        // Exécuter le scan OWASP ZAP avec l'adresse du site
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { siteURL } = JSON.parse(body);
            executeZAPScan(siteURL, res);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page non trouvée');
    }
});

async function executeZAPScan(siteURL, res) {
    try {
        // Générer les résultats du scan OWASP ZAP
        const scanResults = await generateScanResults(siteURL);
        console.log('Résultats du scan:', scanResults);

        // Écrire les résultats du scan dans le fichier resultzap.html
        const resultzapContent = `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Résultats du scan OWASP ZAP</title>
            </head>
            <body>
                <h1>Résultats du scan OWASP ZAP pour ${siteURL}</h1>
                <pre>${scanResults}</pre>
            </body>
            </html>
        `;
        fs.writeFile(path.join(__dirname, 'resultzap.html'), resultzapContent, err => {
            if (err) {
                console.error('Erreur lors de l\'écriture de resultzap.html:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Erreur interne du serveur');
                return;
            }
            console.log('resultzap.html généré avec succès.');

            // Rediriger l'utilisateur vers resultzap.html
            res.writeHead(302, { 'Location': '/resultzap.html' });
            res.end();
        });
    } catch (error) {
        console.error('Erreur lors de l\'exécution du scan OWASP ZAP:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erreur interne du serveur');
    }
}

async function generateScanResults(siteURL) {
    const zapOptions = {
        proxy: 'http://localhost:8080', // URL du proxy ZAP
        apiKey: '56epbifh02tu7lhs20v94ikhbc' // Clé API de ZAP
    };

    const zaproxy = new ZAPClient(zapOptions);

    // Accéder à l'URL du site
    await zaproxy.core.accessUrl(siteURL);
    console.log(`Accès à l'URL du site : ${siteURL}`);

    // Démarrer le scan actif
    await zaproxy.ascan.scan(siteURL);
    console.log('Scan actif démarré...');

    // Attendre la fin du scan
    await zaproxy.ascan.waitForScanToComplete();
    console.log('Scan terminé.');

    // Obtenir le rapport JSON
    const scanResults = await zaproxy.core.jsonreport();
    return JSON.stringify(scanResults);
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
