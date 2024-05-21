const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');


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
      
          
        </script>
      </body>
      `);
      
      
  
        // Send the modified HTML content to the client
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(modifiedHTML);
      });

    } else if (req.url === '/downloadPDF') {
      // Handle downloading the PDF file
      downloadPDF(req, res);
    } else if (req.url === '/generateReportPDF'){
      
      const xmlPath = path.join(__dirname, '../nmap/resultttt.xml');
      const htmlFilePath = path.join(__dirname, '../nmap/templatee.html');
    
      fs.readFile(xmlPath, 'utf8', (err, xmlData) => {
        if (err) {
          console.error(`Error reading XML file: ${err.message}`);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }
    
        fs.readFile(htmlFilePath, 'utf8', (err, htmlData) => {
          if (err) {
            console.error(`Error reading HTML file: ${err.message}`);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
          }
    
          const dom = new JSDOM(htmlData);
          const document = dom.window.document;
    
          const parser = new dom.window.DOMParser();
          const xmlDoc = parser.parseFromString(xmlData, 'application/xml');
    
          const startstr = xmlDoc.getElementsByTagName('nmaprun')[0].getAttribute('startstr');
          const addr = xmlDoc.getElementsByTagName('address')[0].getAttribute('addr');
          const name = xmlDoc.getElementsByTagName('hostname')[0].getAttribute('name');
          const protocol = xmlDoc.getElementsByTagName('port')[0].getAttribute('protocol');
          const protocol1 = xmlDoc.getElementsByTagName('port')[1].getAttribute('protocol');
          const portid = xmlDoc.getElementsByTagName('port')[0].getAttribute('portid');
          const portid1 = xmlDoc.getElementsByTagName('port')[1].getAttribute('portid');
          const state = xmlDoc.getElementsByTagName('state')[0].getAttribute('state');
    
          document.querySelectorAll('.time').forEach(balise => balise.textContent = startstr);
          document.querySelectorAll('.adresse').forEach(balise => balise.textContent = addr);
          document.querySelectorAll('.nomHote').forEach(balise => balise.textContent = name);
          document.querySelectorAll('.protocole').forEach(balise => balise.textContent = protocol);
          document.querySelectorAll('.port').forEach(balise => balise.textContent = portid);
          document.querySelectorAll('.protocole1').forEach(balise => balise.textContent = protocol1);
          document.querySelectorAll('.port1').forEach(balise => balise.textContent = portid1);
          document.querySelectorAll('.etatPort').forEach(balise => balise.textContent = state);
    
          const modifiedHtml = dom.serialize();
          const pdfFilePath = path.join(__dirname, `../nmap/docs/rapportnmap_${lastReportNumber}.pdf`);
    
          generateReportPDF(modifiedHtml, pdfFilePath).then(() => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Rapport PDF généré avec succès');
            lastReportNumber++;
          }).catch(error => {
            console.error('Erreur lors de la génération du rapport PDF:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erreur lors de la génération du rapport PDF');
          })
        })
      })
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