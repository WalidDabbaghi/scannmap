const fs = require('fs');
const { parseString } = require('xml2js');
var convertXMLtoJson = require('xml2js')


var xmldata = fs.readFileSync('resultttt.xml', 'utf-8');

convertXMLtoJson.parseString(xmldata,function(err,results){
    fs.writeFile("xmlToJson.json",JSON.stringify(results),function(err){
        console.log('JSON file is generated')
    })
})

// Read the JSON file
fs.readFile('xmlToJson.json', 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  try {
    // Parse JSON data
    const jsonData = JSON.parse(data);
    
    // Generate HTML
    const html = generateHTMLFromJSON(jsonData);

    // Write HTML to file
    fs.writeFileSync('output.html', html);
    
    console.log('HTML file generated successfully!');
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});

// Function to generate HTML from JSON
function generateHTMLFromJSON(jsonData) {
  let html = '<!DOCTYPE html>\n<html>\n<head>\n<title>Generated HTML</title> <link rel="stylesheet" href="output.css">\n</head>\n<body>\n';
  
  // Convert JSON data to HTML markup
  html += generateHTMLRecursive(jsonData);
  
  html += '</body>\n</html>';
  
  return html;
}

// Function to recursively generate HTML from JSON
function generateHTMLRecursive(data) {
  let html = '';

  if (typeof data === 'object') {
    html += '<ul>';
    for (const key in data) {
      html += `<li>${key}: ${generateHTMLRecursive(data[key])}</li>`;
    }
    html += '</ul>';
  } else {
    html += data;
  }

  return html;
}


// Function to recursively generate HTML from JSON
function generateHTMLRecursive(data, idPrefix = '') {
  let html = '';

  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      html += '<div>';
      data.forEach((item, index) => {
        const itemId = idPrefix + '-item-' + index;
        html += `<div id="${itemId}" class="list-item">`;
        html += generateHTMLRecursive(item, itemId);
        html += '</div>';
      });
      html += '</div>';
    } else {
      html += '<div>';
      for (const key in data) {
        // Ignore keys containing "$" symbol
        if (key.includes('$')) {
          html += generateHTMLRecursive(data[key], idPrefix);
        } else {
          const elementId = idPrefix ? `${idPrefix}-${key}` : key;
          html += `<div id="${elementId}" class="list-item">`;
          html += `<span class="key">${key}:</span>`;
          html += generateHTMLRecursive(data[key], elementId);
          html += '</div>';
        }
      }
      html += '</div>';
    }
  } else {
    html += `<span class="value">${data}</span>`;
  }

  return html;
}

