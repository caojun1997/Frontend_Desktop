import React, { useState } from 'react';

interface Session {
  id: string;
  title: string;
  timestamp: Date;
  lastMessage: string;
}

interface SessionListProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSessionSelect: (sessionId: string) => void;
  selectedSessionId?: string;
  width?: number;
}

const SessionList: React.FC<SessionListProps> = ({
  isExpanded,
  onToggleExpand,
  onSessionSelect,
  selectedSessionId,
  width = 280
}) => {
  const [sessions] = useState<Session[]>([
    {
      id: '1',
      title: '新会话',
      timestamp: new Date('2025-08-01'),
      lastMessage: '上海天气查询设议使用天气...'
    },
    {
      id: '2',
      title: 'React开发问题',
      timestamp: new Date('2025-07-30'),
      lastMessage: '如何使用React Hook...'
    },
    {
      id: '3',
      title: 'TypeScript学习',
      timestamp: new Date('2025-07-29'),
      lastMessage: '接口和类型的区别...'
    }
  ]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString();
  };

  return (
    <div 
      className={`session-list ${isExpanded ? 'expanded' : 'collapsed'}`}
      style={{ width: width }}
    >
      <div className="session-header">
        <button 
          className="expand-toggle"
          onClick={onToggleExpand}
          title={isExpanded ? '收起会话列表' : '展开会话列表'}
        >
          {isExpanded ? '◀' : '▶'}
        </button>
        {isExpanded && <h3>会话列表</h3>}
      </div>
      
      {isExpanded && (
        <div className="session-content">
          <button className="new-session-btn">
            ✏️ 新会话
          </button>
          
          <div className="sessions">
            {sessions.map(session => (
              <div
                key={session.id}
                className={`session-item ${selectedSessionId === session.id ? 'active' : ''}`}
                onClick={() => onSessionSelect(session.id)}
              >
                <div className="session-info">
                  <div className="session-title">{session.title}</div>
                  <div className="session-date">{formatDate(session.timestamp)}</div>
                </div>
                <div className="session-preview">{session.lastMessage}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!isExpanded && (
        <div className="collapsed-content">
          <div className="collapsed-sessions">
            {sessions.slice(0, 3).map((session, index) => (
              <div
                key={session.id}
                className={`collapsed-session-item ${selectedSessionId === session.id ? 'active' : ''}`}
                onClick={() => onSessionSelect(session.id)}
                title={session.title}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <button className="collapsed-new-session" title="新会话">
            ✏️
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionList;
