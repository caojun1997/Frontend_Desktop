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
      timestamp: new Date('2025-08-04'),
      lastMessage: '上海天气查询设议使用天气...'
    },
    {
      id: '2',
      title: 'React开发问题',
      timestamp: new Date('2025-08-03'),
      lastMessage: '如何使用React Hook...'
    },
    {
      id: '3',
      title: 'TypeScript学习',
      timestamp: new Date('2025-08-02'),
      lastMessage: '接口和类型的区别...'
    },
    {
      id: '4',
      title: 'AI模型部署',
      timestamp: new Date('2025-08-01'),
      lastMessage: '如何部署大语言模型到服务器...'
    },
    {
      id: '5',
      title: 'Docker容器化',
      timestamp: new Date('2025-07-31'),
      lastMessage: '容器化应用的最佳实践...'
    },
    {
      id: '6',
      title: 'Vue3项目搭建',
      timestamp: new Date('2025-07-30'),
      lastMessage: '使用Vite创建Vue3项目...'
    },
    {
      id: '7',
      title: '数据库优化',
      timestamp: new Date('2025-07-29'),
      lastMessage: 'MySQL性能调优策略...'
    },
    {
      id: '8',
      title: '微服务架构',
      timestamp: new Date('2025-07-28'),
      lastMessage: '微服务的优缺点分析...'
    },
    {
      id: '9',
      title: 'GraphQL实践',
      timestamp: new Date('2025-07-27'),
      lastMessage: 'GraphQL与REST API对比...'
    },
    {
      id: '10',
      title: '前端性能优化',
      timestamp: new Date('2025-07-26'),
      lastMessage: '网页加载速度优化技巧...'
    },
    {
      id: '11',
      title: 'Node.js后端开发',
      timestamp: new Date('2025-07-25'),
      lastMessage: 'Express框架搭建API服务...'
    },
    {
      id: '12',
      title: 'CSS Grid布局',
      timestamp: new Date('2025-07-24'),
      lastMessage: 'Grid布局实现响应式设计...'
    },
    {
      id: '13',
      title: 'Python数据分析',
      timestamp: new Date('2025-07-23'),
      lastMessage: '使用pandas处理数据...'
    },
    {
      id: '14',
      title: 'Git版本控制',
      timestamp: new Date('2025-07-22'),
      lastMessage: 'Git分支管理策略...'
    },
    {
      id: '15',
      title: 'Linux系统管理',
      timestamp: new Date('2025-07-21'),
      lastMessage: '常用Linux命令总结...'
    },
    {
      id: '16',
      title: 'Web安全防护',
      timestamp: new Date('2025-07-20'),
      lastMessage: 'XSS和CSRF攻击防护...'
    },
    {
      id: '17',
      title: '算法与数据结构',
      timestamp: new Date('2025-07-19'),
      lastMessage: '排序算法的时间复杂度...'
    },
    {
      id: '18',
      title: 'Redis缓存应用',
      timestamp: new Date('2025-07-18'),
      lastMessage: 'Redis数据类型和使用场景...'
    },
    {
      id: '19',
      title: 'Webpack配置优化',
      timestamp: new Date('2025-07-17'),
      lastMessage: '打包速度和体积优化...'
    },
    {
      id: '20',
      title: '单元测试实践',
      timestamp: new Date('2025-07-16'),
      lastMessage: 'Jest测试框架使用...'
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
            新会话
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
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionList;
