
const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');



// Import des fonctions depuis les fichiers séparés
const downloadPDF = require('../nmap/DownloadFile');
const sendEmailWithAttachment = require('../nmap/SendEmail');
const server = http.createServer((req, res) => {
 
    
if(req.url === '/scan') {
      // Execute the shell script
      exec('./nmap/myShellScript.sh', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing script: ${error.message}`);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }
        
        // Wait for a moment before redirecting to the scan result
        setTimeout(() => {
          res.writeHead(302, { 'Location': './nmap/result' });
          res.end();
        }, 10000); // Wait for 10 seconds (10000 ms) before redirecting
      });
    } else if (req.url === '/result') {
      // Read the resulting HTML file
      const htmlPath = path.join(__dirname, './nmap/res.html');
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
      const buttonAction = 'fetch("/scan").then(response => window.location.href = "/result").catch(error => console.error(error));';
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`<button onclick="scan()">${buttonText}</button><script>function scan() { ${buttonAction} }</script>`);
    }
  });


module.exports = server;
