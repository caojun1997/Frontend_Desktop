import React, { useState, useRef, useEffect } from 'react';
import aliCloudService from '../services/aliCloudService';
import localStorageService from '../services/localStorageService';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatAreaProps {
  sessionId?: string;
  onSessionUpdate?: (sessionId: string, title: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ sessionId = 'default', onSessionUpdate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 加载会话消息
  useEffect(() => {
    if (sessionId) {
      const storedMessages = localStorageService.getMessagesBySession(sessionId);
      if (storedMessages.length > 0) {
        // 转换存储格式到组件格式
        const convertedMessages = storedMessages.map(msg => ({
          id: msg.id,
          content: msg.content,
          isUser: msg.isUser,
          timestamp: msg.timestamp
        }));
        setMessages(convertedMessages);
      } else {
        // 新会话，显示欢迎消息
        const welcomeMessage: Message = {
          id: `${sessionId}-welcome`,
          content: '你好！我是通义千问AI助手，可以帮您解答问题、协助工作。有什么我可以帮助您的吗？',
          isUser: false,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        
        // 保存欢迎消息
        localStorageService.saveMessage({
          id: welcomeMessage.id,
          content: welcomeMessage.content,
          isUser: welcomeMessage.isUser,
          timestamp: welcomeMessage.timestamp,
          sessionId: sessionId
        });
      }
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
      id: `${sessionId}-${Date.now()}`,
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    // 立即更新UI
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 保存用户消息
    localStorageService.saveMessage({
      id: userMessage.id,
      content: userMessage.content,
      isUser: userMessage.isUser,
      timestamp: userMessage.timestamp,
      sessionId: sessionId
    });

    // 更新会话信息
    const currentSession = localStorageService.getAllSessions().find(s => s.id === sessionId);
    if (currentSession) {
      currentSession.lastUpdated = new Date();
      currentSession.messageCount = localStorageService.getMessagesBySession(sessionId).length + 1;
      localStorageService.saveSession(currentSession);
    } else {
      // 创建新会话
      const newSession = {
        id: sessionId,
        title: inputValue.slice(0, 30) + (inputValue.length > 30 ? '...' : ''),
        createdAt: new Date(),
        lastUpdated: new Date(),
        messageCount: 1
      };
      localStorageService.saveSession(newSession);
      onSessionUpdate?.(sessionId, newSession.title);
    }

    try {
      // 获取最近的对话历史（最多10条）来提供上下文
      const recentMessages = [...messages, userMessage].slice(-10);
      
      // 转换为阿里云API格式
      const apiMessages = aliCloudService.convertToAliCloudFormat(recentMessages);
      
      // 调用阿里云API
      const aiResponse = await aliCloudService.sendMessage(apiMessages);
      
      const aiMessage: Message = {
        id: `${sessionId}-${Date.now() + 1}`,
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // 保存AI回复
      localStorageService.saveMessage({
        id: aiMessage.id,
        content: aiMessage.content,
        isUser: aiMessage.isUser,
        timestamp: aiMessage.timestamp,
        sessionId: sessionId
      });
      
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 显示错误消息
      const errorMessage: Message = {
        id: `${sessionId}-error-${Date.now()}`,
        content: `抱歉，发生了错误：${error instanceof Error ? error.message : '未知错误'}。请稍后重试。`,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // 保存错误消息
      localStorageService.saveMessage({
        id: errorMessage.id,
        content: errorMessage.content,
        isUser: errorMessage.isUser,
        timestamp: errorMessage.timestamp,
        sessionId: sessionId
      });
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
