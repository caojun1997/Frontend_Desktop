interface AliCloudMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AliCloudResponse {
  output: {
    text?: string;
    choices?: Array<{
      finish_reason: string;
      message: {
        role: string;
        content: string;
      };
    }>;
  };
  usage?: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

class AliCloudService {
  private baseUrl: string;

  constructor() {
    // 使用本地代理服务器
    this.baseUrl = 'http://localhost:3001/api/chat';
  }

  async sendMessage(messages: AliCloudMessage[]): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: '未知错误' }));
        console.error('API Error:', response.status, errorData);
        
        // 提供更友好的错误信息
        if (response.status === 401) {
          throw new Error('API密钥无效，请检查配置');
        } else if (response.status === 429) {
          throw new Error('请求频率过高，请稍后重试');
        } else if (response.status >= 500) {
          throw new Error('服务器暂时不可用，请稍后重试');
        } else {
          throw new Error(`API请求失败: ${response.status}`);
        }
      }

      const data: AliCloudResponse = await response.json();
      
      // 处理不同的响应格式
      if (data.output?.choices?.[0]?.message?.content) {
        return data.output.choices[0].message.content;
      } else if (data.output?.text) {
        return data.output.text;
      } else {
        console.error('Unexpected API response:', data);
        throw new Error('API响应格式错误');
      }
    } catch (error) {
      console.error('AliCloud API Error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('无法连接到服务器，请确保后端服务器正在运行');
      }
      
      if (error instanceof Error) {
        throw error; // 重新抛出已处理的错误
      } else {
        throw new Error('对话服务发生未知错误');
      }
    }
  }

  // 将我们的消息格式转换为阿里云API格式
  convertToAliCloudFormat(messages: Array<{content: string, isUser: boolean}>): AliCloudMessage[] {
    return messages.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.content
    }));
  }
}

export default new AliCloudService();
