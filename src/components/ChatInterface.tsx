import React, { useState } from 'react';
import SessionList from './SessionList';
import ChatArea from './ChatArea';
import KnowledgeBase from './KnowledgeBase';
import './ChatInterface.css';

const ChatInterface: React.FC = () => {
  const [selectedSessionId, setSelectedSessionId] = useState<string>();
  const [isSessionListExpanded, setIsSessionListExpanded] = useState(true);
  const [isKnowledgeBaseExpanded, setIsKnowledgeBaseExpanded] = useState(true);

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSessionId(sessionId);
  };

  const handleToggleSessionList = () => {
    setIsSessionListExpanded(!isSessionListExpanded);
  };

  const handleToggleKnowledgeBase = () => {
    setIsKnowledgeBaseExpanded(!isKnowledgeBaseExpanded);
  };

  return (
    <div className="chat-interface">
      <SessionList
        isExpanded={isSessionListExpanded}
        onToggleExpand={handleToggleSessionList}
        onSessionSelect={handleSessionSelect}
        selectedSessionId={selectedSessionId}
      />
      
      <div className="chat-main">
        <ChatArea sessionId={selectedSessionId} />
      </div>
      
      <KnowledgeBase
        isExpanded={isKnowledgeBaseExpanded}
        onToggleExpand={handleToggleKnowledgeBase}
      />
    </div>
  );
};

export default ChatInterface;
