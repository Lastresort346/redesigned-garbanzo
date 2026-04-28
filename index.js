const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/run-java', async (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "No code provided" });

    try {
        // CHANGED: Using the primary piston.rs domain instead of emacs.piston.rs
        const PISTON_URL = 'https://piston.rs/api/v2/execute';
        
        const payload = {
            language: "java",
            version: "*", 
            files: [{ name: "Main.java", content: code }]
        };

        console.log("Attempting to connect to Piston at:", PISTON_URL);
        
        const response = await axios.post(PISTON_URL, payload, { timeout: 15000 });
        res.json(response.data);

    } catch (error) {
        console.error("Bridge Error:", error.message);
        
        // If piston.rs fails, try the older direct IP/subdomain as a final fallback
        try {
            console.log("Main API failed, trying fallback...");
            const fallback = await axios.post('https://piston.rs/api/v2/execute', payload, { timeout: 10000 });
            return res.json(fallback.data);
        } catch (fallbackError) {
            res.status(500).json({ 
                error: "Compiler connection failed", 
                details: error.message 
            });
        }
    }
});

app.get('/', (req, res) => res.send("Java Bridge is Online"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
