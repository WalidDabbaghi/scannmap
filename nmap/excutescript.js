const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


// Import des fonctions depuis les fichiers séparés
const downloadPDF = require('../nmap/DownloadFile');
const sendEmailWithAttachment = require('../nmap/SendEmail');
const generateReportPDF = require('../nmap/generatePdf');
let lastReportNumber = 1;
 // Import the function
const nmap = http.createServer((req, res) => {
  if(req.url.startsWith('/scan')) {
    const url = req.url.split('?')[1].split('=')[1]; // Récupère l'URL de la requête
    const command = `./nmap/myShellScript.sh ${url}`; // Ajoute l'URL à votre commande shell
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      // Faites quelque chose avec stdout (résultat de la commande shell)
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(stdout);
    });
  } else if (req.url === '/result') {
      // Read the resulting HTML file
      const htmlPath = path.join(__dirname, 'res.html');
      fs.readFile(htmlPath, (err, data) => {
        if (err) {
          console.error(`Error reading HTML file: ${err.message}`);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }
  
        // Add the download PDF button and script to the HTML content
        const modifiedHTML = data.toString().replace('</body>', `
        <button onclick="downloadPDF()">Download PDF</button>
        <div>
          <input type="email" id="emailInput" placeholder="Adresse email">
          <button onclick="sendPDFByEmail()">Envoyer par Email</button>
          <button onclick="generateReportPDF()">Générer rapport PDF</button>
          <button onclick="rapport()">rapport</button>
          
        </div>
        <script>
          function downloadPDF() {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', '/downloadPDF');
            xhr.responseType = 'blob';  // Set response type to blob for binary data
            xhr.onload = function() {
              if (xhr.status === 200) {
                const blob = xhr.response;
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'pdf_file_name.pdf';
                a.click();
                window.URL.revokeObjectURL(url);  // Clean up temporary URL
              } else {
                console.error('Error downloading PDF');
              }
            };
            xhr.send();
          }
      
          function sendPDFByEmail() {
            const email = document.getElementById('emailInput').value;
            fetch('/sendPDFByEmail?email=' + email).then(response => {
              if (response.ok) {
                console.log('Email sent successfully');
              } else {
                console.error('Error sending email');
              }
            }).catch(error => {
              console.error('Error sending email:', error);
            });
          }
          
          function generateReportPDF() {
            // Appeler la fonction externe pour générer le rapport PDF
            fetch('/generateReportPDF').then(response => {
              if (response.ok) {
                console.log('Rapport PDF généré avec succès');
              } else {
                console.error('Erreur lors de la génération du rapport PDF');
              }
            }).catch(error => {
              console.error('Erreur lors de la génération du rapport PDF:', error);
            });
          }
          function rapport() {
            fetch("/scan?url=")
                .then(response => {
                    if (response.ok) {
                        window.location.href = "/rapport";
                    } else {
                        console.error('Failed to fetch');
                    }
                })
                .catch(error => console.error(error));
        }
      
          
        </script>
      </body>
      `);
      
      
  
        // Send the modified HTML content to the client
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(modifiedHTML);
      });
    } else if (req.url === '/rapport') {
      const xmlPath = path.join(__dirname, 'resultttt.xml');
      const htmlPath = path.join(__dirname, 'templatee.html');
  
      // Lire le fichier XML en premier
      fs.readFile(xmlPath, 'utf8', (err, xmlData) => {
          if (err) {
              console.error(`Error reading XML file: ${err.message}`);
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Internal Server Error');
              return;
          }
  
          // Lire le fichier HTML ensuite
          fs.readFile(htmlPath, 'utf8', (err, htmlData) => {
              if (err) {
                  console.error(`Error reading HTML file: ${err.message}`);
                  res.writeHead(500, { 'Content-Type': 'text/plain' });
                  res.end('Internal Server Error');
                  return;
              }
  
              // Insérer les données XML dans le HTML
              const script = `
              <script>
                  // Charger les données XML à partir de la réponse du serveur
                  var parser = new DOMParser();
                  var xmlData = parser.parseFromString(\`${xmlData.replace(/`/g, '\\`')}\`, 'application/xml');
  
                  // Extraction des données nécessaires
                  var startstr = xmlData.getElementsByTagName('nmaprun')[0].getAttribute('startstr');
                  var addr = xmlData.getElementsByTagName('address')[0].getAttribute('addr');
                  var name = xmlData.getElementsByTagName('hostname')[0].getAttribute('name');
                  var protocol = xmlData.getElementsByTagName('port')[0].getAttribute('protocol');
                  var protocol1 = xmlData.getElementsByTagName('port')[1].getAttribute('protocol');
                  var portid = xmlData.getElementsByTagName('port')[0].getAttribute('portid');
                  var portid1 = xmlData.getElementsByTagName('port')[1].getAttribute('portid');
                  var state = xmlData.getElementsByTagName('state')[0].getAttribute('state');
  
                  // Insérer les données dans le modèle HTML
                  document.querySelectorAll('.time').forEach(function(balise) {
                      balise.textContent = startstr;
                  });
                  document.querySelectorAll('.adresse').forEach(function(balise) {
                      balise.textContent = addr;
                  });
                  document.querySelectorAll('.nomHote').forEach(function(balise) {
                      balise.textContent = name;
                  });
                  document.querySelectorAll('.protocole').forEach(function(balise) {
                      balise.textContent = protocol;
                  });
                  document.querySelectorAll('.port').forEach(function(balise) {
                      balise.textContent = portid;
                  });
                  document.querySelectorAll('.protocole1').forEach(function(balise) {
                      balise.textContent = protocol1;
                  });
                  document.querySelectorAll('.port1').forEach(function(balise) {
                      balise.textContent = portid1;
                  });
                  document.querySelectorAll('.etatPort').forEach(function(balise) {
                      balise.textContent = state;
                  });
              </script>
              `;
  
              // Ajouter le script avant la balise de fermeture </body>
              const modifiedHtml = htmlData.replace('</body>', `
              <button onclick="generateReportPDF()">Générer rapport PDF</button>
              ${script}</body>`);
  
              // Attendre un moment avant de répondre avec le fichier HTML modifié
              setTimeout(() => {
                  res.writeHead(200, { 'Content-Type': 'text/html' });
                  res.end(modifiedHtml);
              }, 3000); // Attendre 3 secondes (3000 ms) avant de répondre
          });
      });
  

    } else if (req.url === '/downloadPDF') {
      // Handle downloading the PDF file
      downloadPDF(req, res);
    } else if (req.url === '/generateReportPDF'){
      
      // Handle downloading the PDF file
      const htmlFilePath = path.join(__dirname, '../nmap/templatee.html'); // Chemin vers votre fichier HTML
        const pdfFilePath = path.join(__dirname, `../nmap/docs/rapportnmap_${lastReportNumber}.pdf`); // Chemin pour enregistrer le rapport PDF
        generateReportPDF(htmlFilePath, pdfFilePath).then(() => {
          // Lorsque le rapport PDF est généré avec succès
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Rapport PDF généré avec succès');

          // Mettre à jour le numéro de version pour le prochain rapport
          lastReportNumber++;
      }).catch(error => {
          // Réponse en cas d'erreur lors de la génération du rapport PDF
          console.error('Erreur lors de la génération du rapport PDF:', error);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Erreur lors de la génération du rapport PDF');
      });
  } else if (req.url === '/downloadLatestReport') {
      // Télécharger le dernier rapport généré
      const lastReportFilePath = path.join(__dirname, `../nmap/docs/rapportnmap_${lastReportNumber - 1}.pdf`);
      fs.readFile(lastReportFilePath, (err, data) => {
          if (err) {
              console.error('Erreur lors de la lecture du fichier PDF:', err);
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Erreur lors de la lecture du fichier PDF');
          } else {
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Disposition', `attachment; filename=rapportnmap_${lastReportNumber - 1}.pdf`);
              res.end(data);
          }
      });
    } else if (req.url.startsWith('/sendPDFByEmail')) {
      // Extraire l'adresse email à partir de l'URL
      const email = req.url.split('=')[1];
      // Envoyer le PDF par email
      sendEmailWithAttachment(email, path.join(__dirname, 'pdf_file_name.pdf'))
        .then(() => {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Email sent successfully');
        })
        .catch((error) => {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Failed to send email');
        });
      } else {
        // Handle other requests
        const buttonText = 'Scan Nmap';
        let buttonAction; // Déclarer buttonAction en dehors de la fonction scan()
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <input type="text" id="urlInput" placeholder="Enter URL">
          <button onclick="scan()">${buttonText}</button>
          <script>
            function scan() {
              const url = document.getElementById('urlInput').value;
              buttonAction = 'fetch("/scan?url=' + encodeURIComponent(url) + '").then(response => window.location.href = "/result").catch(error => console.error(error));';
              eval(buttonAction); // Utiliser eval() pour exécuter la chaîne d'action
            }
          </script>
        `);
      }
  });


module.exports = nmap;