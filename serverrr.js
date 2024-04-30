const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


const server = require('./excutescript');


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
