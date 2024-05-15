const puppeteer = require('puppeteer');
const fs = require('fs');

async function generateReportPDF(htmlFilePath, pdfFilePath) {
    try {
      // const browser = await puppeteer.launch();
      const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
      const page = await browser.newPage();
       
        
        // Lire le contenu HTML du fichier
        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        
        await page.setContent(htmlContent);
         // Options supplémentaires pour la génération du PDF
         const pdfOptions = {
          path: pdfFilePath,
          format: 'A3',
          margin: {
              top: '2mm',
              bottom: '2mm',
              left: '2mm',
              right: '2mm'
          },
          header: {
              height: '15mm',
              contents: `<table style="width: 77%;"><tr><td style="text-align: left;">Dabbaghi Walid</td><td style="text-align: right;">Vulnerability Scan Report</td></tr></table>`,
          },
          footer: {
              height: '20mm',
              contents: {
                  first: "1",
                  2: "2",
                  3: "3",
                  4: "4",
                  5: "5",
                  6: "6",
                  7: "7",
                  8: "8",
                  9: "9",
                  default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
                  last: "Last Page",
              },
          },
      };
        // Générer le PDF avec les options spécifiées
        await page.pdf(pdfOptions);
        
        await browser.close();
        
        console.log('Rapport PDF généré avec succès');
    } catch (error) {
        console.error('Erreur lors de la génération du rapport PDF:', error);
        throw error;
    }
}

module.exports = generateReportPDF;
