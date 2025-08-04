import React, { useState, useRef, useCallback } from 'react';
import SessionList from './SessionList';
import ChatArea from './ChatArea';
import KnowledgeBase from './KnowledgeBase';
import './ChatInterface.css';

const ChatInterface: React.FC = () => {
  const [selectedSessionId, setSelectedSessionId] = useState<string>();
  const [isSessionListExpanded, setIsSessionListExpanded] = useState(true);
  const [isKnowledgeBaseExpanded, setIsKnowledgeBaseExpanded] = useState(true);
  const [knowledgeBaseWidth, setKnowledgeBaseWidth] = useState(320);
  const [sessionListWidth, setSessionListWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSessionId(sessionId);
  };

  const handleToggleSessionList = () => {
    setIsSessionListExpanded(!isSessionListExpanded);
  };

  const handleToggleKnowledgeBase = () => {
    setIsKnowledgeBaseExpanded(!isKnowledgeBaseExpanded);
  };

  // 处理知识库拖拽调整大小
  const handleKnowledgeBaseResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startWidth = knowledgeBaseWidth;
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const sessionWidth = isSessionListExpanded ? sessionListWidth : 60;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = startX - e.clientX; // 向左拖拽时为正值
      const maxWidth = Math.max(containerWidth - sessionWidth - 350, 200); // 确保聊天区域至少350px
      const newWidth = Math.min(
        Math.max(startWidth + deltaX, 200), // 最小宽度200px
        maxWidth
      );
      setKnowledgeBaseWidth(newWidth);
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [knowledgeBaseWidth, sessionListWidth, isSessionListExpanded]);

  // 处理会话列表拖拽调整大小
  const handleSessionListResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startWidth = sessionListWidth;
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const knowledgeWidth = isKnowledgeBaseExpanded ? knowledgeBaseWidth : 60;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX; // 向右拖拽时为正值
      const maxWidth = Math.max(containerWidth - knowledgeWidth - 350, 200); // 确保聊天区域至少350px
      const newWidth = Math.min(
        Math.max(startWidth + deltaX, 200), // 最小宽度200px
        maxWidth
      );
      setSessionListWidth(newWidth);
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [sessionListWidth, knowledgeBaseWidth, isKnowledgeBaseExpanded]);

  return (
    <div 
      className={`chat-interface ${isResizing ? 'resizing' : ''}`} 
      ref={containerRef}
    >
      <SessionList
        isExpanded={isSessionListExpanded}
        onToggleExpand={handleToggleSessionList}
        onSessionSelect={handleSessionSelect}
        selectedSessionId={selectedSessionId}
        width={isSessionListExpanded ? sessionListWidth : 60}
      />
      
      {isSessionListExpanded && (
        <div 
          className="resize-handle resize-handle-right"
          onMouseDown={handleSessionListResize}
        />
      )}
      
      <div className="chat-main">
        <ChatArea sessionId={selectedSessionId} />
      </div>
      
      {isKnowledgeBaseExpanded && (
        <div 
          className="resize-handle resize-handle-left"
          onMouseDown={handleKnowledgeBaseResize}
        />
      )}
      
      <KnowledgeBase
        isExpanded={isKnowledgeBaseExpanded}
        onToggleExpand={handleToggleKnowledgeBase}
        width={isKnowledgeBaseExpanded ? knowledgeBaseWidth : 60}
      />
    </div>
  );
};

export default ChatInterface;
