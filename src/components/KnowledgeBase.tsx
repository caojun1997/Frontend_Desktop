import React, { useState } from 'react';

interface KnowledgeDocument {
  id: string;
  name: string;
  type: 'md' | 'txt' | 'pdf' | 'doc';
  status: 'success' | 'error' | 'processing';
  size?: string;
  lastModified?: Date;
  isSelected: boolean;
}

interface KnowledgeLibrary {
  id: string;
  name: string;
  documents: KnowledgeDocument[];
}

interface KnowledgeBaseProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  width?: number;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  isExpanded,
  onToggleExpand,
  width = 320
}) => {
  const [selectedLibraryId, setSelectedLibraryId] = useState<string>('default');
  
  const [knowledgeLibraries] = useState<KnowledgeLibrary[]>([
    {
      id: 'default',
      name: '选择知识库',
      documents: [
        {
          id: '1',
          name: 'DeepChat接口对接说明.md',
          type: 'md',
          status: 'success',
          size: '2.3KB',
          lastModified: new Date('2025-08-01'),
          isSelected: true
        },
        {
          id: '2',
          name: '斗破.txt',
          type: 'txt',
          status: 'error',
          size: '156MB',
          lastModified: new Date('2025-07-30'),
          isSelected: false
        },
        {
          id: '3',
          name: 'API文档.md',
          type: 'md',
          status: 'success',
          size: '5.7KB',
          lastModified: new Date('2025-07-29'),
          isSelected: true
        }
      ]
    },
    {
      id: 'tech',
      name: '技术文档库',
      documents: [
        {
          id: '4',
          name: 'React开发指南.md',
          type: 'md',
          status: 'success',
          size: '12KB',
          lastModified: new Date('2025-08-02'),
          isSelected: true
        },
        {
          id: '5',
          name: 'TypeScript手册.pdf',
          type: 'pdf',
          status: 'processing',
          size: '3.2MB',
          lastModified: new Date('2025-08-01'),
          isSelected: false
        }
      ]
    }
  ]);

  const selectedLibrary = knowledgeLibraries.find(lib => lib.id === selectedLibraryId);
  const allDocumentsSelected = selectedLibrary?.documents.every(doc => doc.isSelected) || false;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'md': return '📄';
      case 'txt': return '📝';
      case 'pdf': return '📋';
      case 'doc': return '📃';
      default: return '📄';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✓';
      case 'error': return 'ⓘ';
      case 'processing': return '⟳';
      default: return '';
    }
  };

  const toggleAllDocuments = () => {
    // 这里应该更新文档选择状态的逻辑
    console.log('Toggle all documents');
  };

  const toggleDocument = (docId: string) => {
    // 这里应该更新单个文档选择状态的逻辑
    console.log('Toggle document', docId);
  };

  return (
    <div 
      className={`knowledge-base ${isExpanded ? 'expanded' : 'collapsed'}`}
      style={{ width: width }}
    >
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
          {/* 来源选择区域 */}
          <div className="knowledge-source-section">
            <div className="source-header">
              <span className="source-label">来源</span>
              <select 
                className="library-select"
                value={selectedLibraryId}
                onChange={(e) => setSelectedLibraryId(e.target.value)}
              >
                {knowledgeLibraries.map(library => (
                  <option key={library.id} value={library.id}>
                    {library.name}
                  </option>
                ))}
              </select>
              <button className="minimize-btn" title="最小化">
                📄
              </button>
            </div>
            
            {/* 操作按钮区域 */}
            <div className="action-buttons">
              <button className="action-btn add-btn">
                ➕ 添加
              </button>
              <button className="action-btn search-btn">
                🔍 探索
              </button>
            </div>
          </div>

          {/* 文档列表区域 */}
          <div className="documents-section">
            {/* 全选选项 */}
            <div className="select-all-option">
              <label className="document-item">
                <input 
                  type="checkbox" 
                  checked={allDocumentsSelected}
                  onChange={toggleAllDocuments}
                />
                <span className="document-name">选择所有来源</span>
                <span className="document-status success">✓</span>
              </label>
            </div>

            {/* 文档列表 */}
            <div className="documents-list">
              {selectedLibrary?.documents.map(document => (
                <div key={document.id} className="document-item">
                  <label className="document-label">
                    <input 
                      type="checkbox" 
                      checked={document.isSelected}
                      onChange={() => toggleDocument(document.id)}
                    />
                    <span className="file-icon">
                      {getFileIcon(document.type)}
                    </span>
                    <span className="document-name">{document.name}</span>
                    <span className={`document-status ${document.status}`}>
                      {getStatusIcon(document.status)}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isExpanded && (
        <div className="collapsed-content">
          <div className="collapsed-knowledge-items">
            {selectedLibrary?.documents.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="collapsed-knowledge-item"
                title={item.name}
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
