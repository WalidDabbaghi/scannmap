const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const { parseString } = require('xml2js');

// Function to generate HTML from JavaScript object
function generateHTML(jsonObject) {
  let html = '<!DOCTYPE html>\n<html>\n<head>\n<title>Generated HTML</title>\n</head>\n<body>\n';

  // Recursive function to generate HTML for nested objects
  function generateNestedHTML(obj) {
    let result = '';

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (typeof value === 'object') {
          result += `<${key}>${generateNestedHTML(value)}</${key}>\n`;
        } else {
          result += `<${key}>${value}</${key}>\n`;
        }
      }
    }

    return result;
  }

  html += generateNestedHTML(jsonObject);
  html += '</body>\n</html>';
  
  return html;
}

const server = http.createServer((req, res) => {
  if (req.url === '/convert') {
    // Exécuter le script shell
    exec('./myShellScript.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      
      // Read XML file
      const xmlData = fs.readFileSync('resultttt.xml', 'utf-8');

      // Parse XML to JavaScript object
      parseString(xmlData, (err, result) => {
        if (err) {
          console.error('Error parsing XML:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }

        // Convert JavaScript object to HTML
        const html = generateHTML(result);

        // Write HTML to file
        fs.writeFileSync('output.html', html);

        // Rediriger vers le fichier de sortie
        res.writeHead(302, { 'Location': '/' });
        res.end();
      });
    });
  } else if (req.url === '/output.html') {
    // Servir le contenu de output.html
    fs.readFile('output.html', (err, data) => {
      if (err) {
        console.error('Error reading output.html:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    // Page par défaut avec le bouton pour lancer la conversion
    const conversionDone = req.url.includes('?conversion_done=true');
    const buttonText = conversionDone ? 'View Output' : 'Dashboard';
    const buttonAction = conversionDone ? 'window.location.href = "/output.html";' : 'fetch("/convert").then(response => window.location.href = "/?conversion_done=true");';
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<button onclick="convert()">${buttonText}</button><script>function convert() { ${buttonAction} }</script>`);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
