const fs = require('fs');
const path = require('path');


// Function to handle downloading the PDF file
function downloadPDF(req, res) {
    // Path to the PDF file
    const pdfPath = path.join(__dirname, 'pdf_file_name.pdf');
  
    // Check if the file exists
    fs.access(pdfPath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`PDF file does not exist: ${err.message}`);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('PDF file not found');
        return;
      }
  
      // Set headers for downloading the PDF file to the desktop
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=pdf_file_name.pdf; path=${path.join(process.env.HOME || process.env.USERPROFILE, 'Desktop')}`);
  
      // Stream the PDF file to the response
      fs.createReadStream(pdfPath).pipe(res);
    });
  }
  
module.exports = downloadPDF;  