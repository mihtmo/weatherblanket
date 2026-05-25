// This app needs a server now because NCEI changed their API setup
const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Proxy route for NOAA
app.get('/api/noaa', async (req, res) => {
    const url = `https://www.ncei.noaa.gov/cdo-web/api/v2/data?${new URLSearchParams(req.query)}`;
    try {
        const response = await fetch(url, {
            headers: { token: process.env.REACT_APP_NCEI_TOKEN },
        });
        const text = await response.text();
        // console.log('NOAA status:', response.status);
        // console.log('NOAA response:', text);
        res.json(JSON.parse(text));
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// All other routes serve the React app
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
