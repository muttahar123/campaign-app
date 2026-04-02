import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateCopy = async (req, res) => {
  const { product, tone, platform, word_limit } = req.body;
  if (!product || !platform) {
    return res.status(400).json({ error: 'Product and platform are required fields' });
  }

  const generatedPrompt = `Generate advertising copy.
Product: ${product}
Tone: ${tone || 'Professional'}
Platform: ${platform}
Word limit: ${word_limit || 100}

Format the output precisely to include:
- Headline
- Body
- CTA`;

  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert ad copywriter.' },
        { role: 'user', content: generatedPrompt }
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Error generating copy' });
    } else {
      res.write(`data: {"error": "${error.message}"}\n\n`);
      res.end();
    }
  }
};

export const generateSocial = async (req, res) => {
  const { platform, campaign_goal, brand_voice } = req.body;
  
  if (!platform || !campaign_goal) {
    return res.status(400).json({ error: 'Platform and campaign_goal are required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a social media manager. Generate 5 distinct caption options. Output JSON array of strings.' },
        { role: 'user', content: `Platform: ${platform}. Goal: ${campaign_goal}. Voice: ${brand_voice || 'Friendly'}` }
      ],
      response_format: { type: "json_object" }
    });

    const rawContent = response.choices[0].message.content;
    res.json(JSON.parse(rawContent));
  } catch (err) {
    console.error('OpenAI Error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to generate social copy' });
  }
};

export const generateHashtags = async (req, res) => {
  const { content, industry } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an SEO expert. Output exactly 10 relevant hashtags based on the content and industry as a JSON array of strings under the key "hashtags".' },
        { role: 'user', content: `Content: ${content}. Industry: ${industry || 'General'}` }
      ],
      response_format: { type: "json_object" }
    });

    res.json(JSON.parse(response.choices[0].message.content));
  } catch (err) {
    console.error('OpenAI Error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to generate hashtags' });
  }
};
