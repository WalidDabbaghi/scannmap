const puppeteer = require('puppeteer');
const fs = require('fs');

async function generateReportPDF(htmlFilePath, pdfFilePath) {
  try {
    // Lancer Puppeteer avec le drapeau --no-sandbox
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    // Lire le contenu du fichier HTML
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    
    // Lire le contenu du fichier JavaScript
    // const scriptContent = fs.readFileSync('App.js', 'utf8');
    
    // Injecter le script et le style CSS dans le contenu HTML
    htmlContent = htmlContent.replace('</head>', `
      <style>
        section {
          page-break-before: always;
          page-break-inside: avoid;
        }
      </style>
    </head>
    <body>
      <script>
        
      </script>`);

    // Définir le contenu HTML modifié
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

    // Attendre que le script s'exécute, par exemple en attendant un élément spécifique ou un délai
    // Attendre 3 secondes que le script s'exécute

    // Options pour la génération du PDF
    const options = {
      path: pdfFilePath,
      format: 'A4',
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '2mm',
        right: '2mm'
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <style>
          .header {
            font-size: 12px;
            width: 100%;
            text-align: center;
            margin: 0 auto;
            padding: 5px 0;
          }
          .header table {
            width: 100%;
          }
        </style>
        <div class="header">
          <table>
            <tr>
              <td style="text-align: left;">Dabbaghi Walid</td>
              <td style="text-align: right;">Vulnerability Scan Report</td>
            </tr>
          </table>
        </div>`,
      footerTemplate: `
        <style>
          .footer {
            font-size: 10px;
            width: 100%;
            text-align: center;
            padding: 5px 0;
          }
        </style>
        <div class="footer">
          <span class="pageNumber"></span>/<span class="totalPages"></span>
        </div>`,
      printBackground: true,
    };

    // Générer le PDF
    await page.pdf(options);

    // Fermer le navigateur
    await browser.close();
    console.log('Rapport PDF généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du rapport PDF:', error);
  }
}

// Utilisation du script
module.exports = generateReportPDF;

// Exemple d'utilisation
// generateReportPDF('path/to/your/input.html', 'path/to/your/output.pdf');
