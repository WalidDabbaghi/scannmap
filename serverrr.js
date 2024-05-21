
console.clear();
const path = require('path');


const nmap  = require('./nmap/excutescript');
const PORT = process.env.PORT || 5000;
nmap.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});