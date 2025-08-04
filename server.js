const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 阿里云API代理端点
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-a6bb18bc6d2847038bfcc2eaa58ebe2e',
        'X-DashScope-SSE': 'disable'
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: {
          messages: messages
        },
        parameters: {
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 0.8
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `API请求失败: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ 
      error: '服务器错误',
      details: error.message
    });
  }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API代理服务器运行在 http://localhost:${PORT}`);
});
