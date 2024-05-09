// app.js
const { exec } = require('child_process');
exec(`./nmap/myShellScript.sh'${siteURL}`, (error, stdout, stderr) => {
  
// exec('./nmap/myShellScript.sh', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }
  console.log(`Script output: ${stdout}`);
});