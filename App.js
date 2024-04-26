// app.js
const { exec } = require('child_process');

exec('./myShellScript.sh', (error, stdout, stderr) => {
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