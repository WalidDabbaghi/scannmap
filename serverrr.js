
const path = require('path');


const nmap  = require('./nmap/excutescript');

// nmap.use('/docs', express.static(path.join(__dirname, './docs')));

const PORT = process.env.PORT || 5000;
nmap.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

