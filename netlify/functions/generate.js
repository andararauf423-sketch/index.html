const { Groq } = require('groq-sdk');

exports.handler = async (event) => {
    // Header agar bisa diakses dari browser (CORS)
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    try {
        const { prompt } = JSON.parse(event.body);
        
        // Mengambil API Key dari Environment Variable Netlify
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "Kamu adalah AzurHub AI. Buatlah kode HTML & CSS lengkap (single file) yang profesional, modern, dan responsif berdasarkan permintaan user. Jangan beri penjelasan, langsung berikan kodenya saja." 
                },
                { role: "user", content: prompt }
            ],
            model: "llama3-8b-8192",
        });

        const htmlResult = chatCompletion.choices[0].message.content;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ html: htmlResult })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: err.message })
        };
    }
};
