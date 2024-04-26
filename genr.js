function generateHTMLFromObject(obj) {
    let html = '<!DOCTYPE html>\n<html>\n<head>\n<title>Generated HTML</title>\n</head>\n<body>\n';
  
    // Fonction récursive pour générer le HTML à partir de l'objet
    function generateHTMLRecursive(obj) {
      for (const key in obj) {
        if (Array.isArray(obj[key])) {
          obj[key].forEach(item => {
            html += `<${key}>${generateHTMLRecursive(item)}</${key}>\n`;
          });
        } else if (typeof obj[key] === 'object') {
          html += `<${key}>${generateHTMLRecursive(obj[key])}</${key}>\n`;
        } else {
          html += `<${key}>${obj[key]}</${key}>\n`;
        }
      }
      return '';
    }
  
    generateHTMLRecursive(obj);
  
    html += '</body>\n</html>';
  
    return html;
  }
  