const puppeteer = require('puppeteer');
const fs = require('fs');


  async function generateReportPDF(htmlContent, pdfFilePath) {
    try {
      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
      const page = await browser.newPage();
  
      // Définir le contenu HTML modifié
      await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
  
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
