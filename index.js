
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });

  try {
    const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "r8_Rw7qWA3TedVZVvDtfKsUJPfTsrNFx2N23cOqH",
        input: { prompt }
      })
    });

    const replicateData = await replicateResponse.json();
    const imageUrl = replicateData?.output?.[0];

    if (!imageUrl) return res.status(500).json({ error: 'No image returned' });
    res.json({ image: imageUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Generation failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
