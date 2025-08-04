import React, { useState, useRef, useEffect } from 'react';

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
      content: '你好！今天你想问什么？',
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
          content: '你好！今天你想问什么？',
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

    // 模拟AI回复延迟
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `我收到了你的消息："${userMessage.content}"。这是一个模拟回复。`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
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
            <h3>你好</h3>
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
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
