const express = require('express');
const path = require('path');
const app = express();

// Serve static files directly from the root directory
app.use(express.static(__dirname)); // __dirname refers to the current directory

// Catch-all route to serve index.html for any request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Set the port and start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
