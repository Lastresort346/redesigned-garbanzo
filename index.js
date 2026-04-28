const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());

app.post('/run-java', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: "No code provided" });
    }

    try {
        // We use version: "*" to ensure it uses whatever Java version is currently installed
        const payload = {
            language: "java",
            version: "*", 
            files: [
                {
                    name: "Main.java",
                    content: code
                }
            ]
        };

        console.log("Sending request to Piston API...");
        
        const response = await axios.post('https://emacs.piston.rs/api/v2/execute', payload, {
            timeout: 15000 // 15 second timeout
        });

        console.log("Piston API responded successfully");
        res.json(response.data);

    } catch (error) {
        // Detailed logging for your Render Console
        console.error("Compiler Bridge Error:", error.message);
        if (error.response) {
            console.error("Piston Error Data:", error.response.data);
        }

        res.status(500).json({ 
            error: "Compiler connection failed", 
            details: error.message 
        });
    }
});

// Health check endpoint (helpful for Render)
app.get('/', (req, res) => res.send("Java Bridge is Online"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
