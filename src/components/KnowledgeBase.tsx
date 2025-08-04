import React, { useState } from 'react';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

interface KnowledgeBaseProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  isExpanded,
  onToggleExpand
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [knowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: '1',
      title: 'React Hooks 基础',
      content: 'React Hooks 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。',
      category: 'frontend',
      tags: ['React', 'Hooks', '前端']
    },
    {
      id: '2',
      title: 'TypeScript 类型系统',
      content: 'TypeScript 是 JavaScript 的一个超集，它添加了可选的静态类型定义。TypeScript 通过类型系统帮助开发者在开发时发现错误。',
      category: 'programming',
      tags: ['TypeScript', '类型', '编程']
    },
    {
      id: '3',
      title: 'CSS Grid 布局',
      content: 'CSS Grid 是一个二维的布局系统，可以处理行和列，使得网页布局变得更加简单和灵活。',
      category: 'frontend',
      tags: ['CSS', 'Grid', '布局']
    },
    {
      id: '4',
      title: 'Node.js 异步编程',
      content: 'Node.js 基于事件驱动的非阻塞 I/O 模型，使用回调函数、Promise 和 async/await 来处理异步操作。',
      category: 'backend',
      tags: ['Node.js', '异步', '后端']
    }
  ]);

  const categories = [
    { value: 'all', label: '全部' },
    { value: 'frontend', label: '前端' },
    { value: 'backend', label: '后端' },
    { value: 'programming', label: '编程' }
  ];

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`knowledge-base ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="knowledge-header">
        <button 
          className="expand-toggle"
          onClick={onToggleExpand}
          title={isExpanded ? '收起知识库' : '展开知识库'}
        >
          {isExpanded ? '▶' : '◀'}
        </button>
        {isExpanded && <h3>知识库</h3>}
      </div>
      
      {isExpanded && (
        <div className="knowledge-content">
          <div className="search-section">
            <input
              type="text"
              placeholder="搜索知识库..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="knowledge-items">
            {filteredItems.length === 0 ? (
              <div className="no-results">
                <p>没有找到相关知识</p>
              </div>
            ) : (
              filteredItems.map(item => (
                <div key={item.id} className="knowledge-item">
                  <h4 className="item-title">{item.title}</h4>
                  <p className="item-content">{item.content}</p>
                  <div className="item-tags">
                    {item.tags.map(tag => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="item-actions">
                    <button className="use-btn" title="使用此知识">
                      使用
                    </button>
                    <button className="copy-btn" title="复制内容">
                      📋
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="knowledge-footer">
            <button className="add-knowledge-btn">
              ➕ 添加知识
            </button>
          </div>
        </div>
      )}

      {!isExpanded && (
        <div className="collapsed-content">
          <div className="collapsed-knowledge-items">
            {filteredItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="collapsed-knowledge-item"
                title={item.title}
              >
                📚
              </div>
            ))}
          </div>
          <button className="collapsed-add-knowledge" title="添加知识">
            ➕
          </button>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
