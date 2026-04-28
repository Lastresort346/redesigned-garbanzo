const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // This allows your HTML file to talk to this server
app.use(express.json());

app.post('/run-java', async (req, res) => {
    try {
        const response = await axios.post('https://emacs.piston.rs/api/v2/execute', {
            language: "java",
            version: "15.0.0",
            files: [{ name: "Main.java", content: req.body.code }]
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Compiler connection failed" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
