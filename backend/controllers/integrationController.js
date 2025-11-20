const axios = require('axios');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ file_url: fileUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.invokeLLM = async (req, res) => {
  try {
    const { prompt, add_context_from_internet, response_json_schema, file_urls } = req.body;

    // STUB: Replace with actual LLM API call (OpenAI, Anthropic, etc.)
    // Example with OpenAI:
    /*
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      response_format: response_json_schema ? { type: 'json_object' } : undefined
    }, {
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
    });
    const result = response.data.choices[0].message.content;
    */

    // For now, return a mock response
    const mockResponse = response_json_schema 
      ? {} 
      : "This is a mock LLM response. Please integrate with a real LLM API (OpenAI, Anthropic, etc.) by uncommenting the code above and adding your API key.";

    res.json(mockResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, body, from_name } = req.body;

    // STUB: Replace with actual email service (SendGrid, AWS SES, etc.)
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    await sgMail.send({
      to,
      from: { email: 'noreply@yourapp.com', name: from_name || 'LAPADOS' },
      subject,
      text: body,
      html: body
    });
    */

    console.log(`Mock email sent to ${to}: ${subject}`);
    res.json({ message: 'Email sent (mock)' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    // STUB: Replace with actual image generation API (DALL-E, Stable Diffusion, etc.)
    // Example with OpenAI DALL-E:
    /*
    const response = await axios.post('https://api.openai.com/v1/images/generations', {
      prompt,
      n: 1,
      size: '1024x1024'
    }, {
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
    });
    const imageUrl = response.data.data[0].url;
    */

    const mockUrl = 'https://via.placeholder.com/1024x1024?text=Generated+Image';
    res.json({ url: mockUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};