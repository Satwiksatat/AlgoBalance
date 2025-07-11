// File: /server/server.js

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});