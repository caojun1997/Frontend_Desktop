import React, { useState, useRef, useEffect } from 'react';
import aliCloudService from '../services/aliCloudService';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatAreaProps {
  sessionId?: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({ sessionId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是通义千问AI助手，可以帮您解答问题、协助工作。有什么我可以帮助您的吗？',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 当会话ID改变时重置消息
  useEffect(() => {
    if (sessionId) {
      // 这里可以根据sessionId加载对应的消息历史
      setMessages([
        {
          id: '1',
          content: '你好！我是通义千问AI助手，可以帮您解答问题、协助工作。有什么我可以帮助您的吗？',
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 获取最近的对话历史（最多10条）来提供上下文
      const recentMessages = [...messages, userMessage].slice(-10);
      
      // 转换为阿里云API格式
      const apiMessages = aliCloudService.convertToAliCloudFormat(recentMessages);
      
      // 调用阿里云API
      const aiResponse = await aliCloudService.sendMessage(apiMessages);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 显示错误消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `抱歉，发生了错误：${error instanceof Error ? error.message : '未知错误'}。请稍后重试。`,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-area">
      <div className="chat-header">
        <div className="chat-title">
          <div>
            <h3>通义千问AI助手</h3>
            <span className="status">在线</span>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.map(message => (
          <div
            key={message.id}
            className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">
              <div className="message-text">{message.content}</div>
              <div className="message-time">{formatTime(message.timestamp)}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message ai-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="input-container">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="问点什么？可以通过@使用工具、文件、资源。"
            rows={1}
            disabled={isLoading}
          />
          <div className="input-actions">
            <button 
              className="send-btn" 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              title="发送"
            >
              {isLoading ? '发送中...' : '发送'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
