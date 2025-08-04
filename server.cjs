const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 阿里云API代理端点
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    console.log('收到聊天请求:', JSON.stringify(messages, null, 2));
    
    const requestBody = {
      model: 'qwen-turbo',
      input: {
        messages: messages
      },
      parameters: {
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.8
      }
    };
    
    console.log('发送到阿里云API的请求:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-a6bb18bc6d2847038bfcc2eaa58ebe2e',
        'X-DashScope-SSE': 'disable'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('阿里云API错误:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `API请求失败: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log('阿里云API响应:', JSON.stringify(data, null, 2));
    res.json(data);
    
  } catch (error) {
    console.error('代理服务器错误:', error);
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

// 测试端点
app.post('/api/test', async (req, res) => {
  try {
    console.log('测试端点被调用，请求体:', req.body);
    
    // 直接调用阿里云API进行测试
    const testMessages = [{ role: 'user', content: '你好' }];
    
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
          messages: testMessages
        },
        parameters: {
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 0.8
        }
      })
    });

    const data = await response.json();
    console.log('测试API响应:', JSON.stringify(data, null, 2));
    
    res.json({
      success: true,
      response: data,
      status: response.status
    });
  } catch (error) {
    console.error('测试错误:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API代理服务器运行在 http://localhost:${PORT}`);
});
