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
  const [showExploreModal, setShowExploreModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [exploreQuery, setExploreQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  
  const [knowledgeLibraries] = useState<KnowledgeLibrary[]>([
    {
      id: 'default',
      name: '默认知识库',
      documents: [
        {
          id: '1',
          name: '商业计划书.pdf',
          type: 'pdf',
          status: 'success',
          size: '2.3MB',
          lastModified: new Date('2025-08-01'),
          isSelected: true
        },
        {
          id: '2',
          name: '市场调研报告.docx',
          type: 'doc',
          status: 'success',
          size: '1.8MB',
          lastModified: new Date('2025-07-30'),
          isSelected: true
        },
        {
          id: '3',
          name: '竞品分析.md',
          type: 'md',
          status: 'processing',
          size: '156KB',
          lastModified: new Date('2025-07-29'),
          isSelected: false
        },
        {
          id: '4',
          name: '用户画像分析.txt',
          type: 'txt',
          status: 'success',
          size: '89KB',
          lastModified: new Date('2025-07-28'),
          isSelected: true
        },
        {
          id: '5',
          name: '财务预算表.pdf',
          type: 'pdf',
          status: 'error',
          size: '567KB',
          lastModified: new Date('2025-07-27'),
          isSelected: false
        },
        {
          id: '6',
          name: '运营策略方案.docx',
          type: 'doc',
          status: 'success',
          size: '2.1MB',
          lastModified: new Date('2025-07-26'),
          isSelected: true
        }
      ]
    },
    {
      id: 'tech',
      name: '技术文档库',
      documents: [
        {
          id: '9',
          name: 'React开发指南.md',
          type: 'md',
          status: 'success',
          size: '12KB',
          lastModified: new Date('2025-08-02'),
          isSelected: true
        },
        {
          id: '10',
          name: 'TypeScript手册.pdf',
          type: 'pdf',
          status: 'processing',
          size: '3.2MB',
          lastModified: new Date('2025-08-01'),
          isSelected: false
        },
        {
          id: '11',
          name: 'Node.js最佳实践.txt',
          type: 'txt',
          status: 'success',
          size: '890KB',
          lastModified: new Date('2025-07-31'),
          isSelected: true
        },
        {
          id: '12',
          name: 'Vue3组件开发.md',
          type: 'md',
          status: 'success',
          size: '15.3KB',
          lastModified: new Date('2025-07-30'),
          isSelected: true
        },
        {
          id: '13',
          name: 'Docker容器化部署.pdf',
          type: 'pdf',
          status: 'error',
          size: '18.7MB',
          lastModified: new Date('2025-07-29'),
          isSelected: false
        },
        {
          id: '14',
          name: 'GraphQL查询语言.docx',
          type: 'doc',
          status: 'success',
          size: '6.4MB',
          lastModified: new Date('2025-07-28'),
          isSelected: true
        },
        {
          id: '15',
          name: '微服务架构模式.txt',
          type: 'txt',
          status: 'processing',
          size: '2.8MB',
          lastModified: new Date('2025-07-27'),
          isSelected: false
        }
      ]
    },
    {
      id: 'business',
      name: '业务文档库',
      documents: [
        {
          id: '16',
          name: '商业计划书.pdf',
          type: 'pdf',
          status: 'success',
          size: '45.2MB',
          lastModified: new Date('2025-08-03'),
          isSelected: true
        },
        {
          id: '17',
          name: '市场调研报告.docx',
          type: 'doc',
          status: 'success',
          size: '22.1MB',
          lastModified: new Date('2025-08-02'),
          isSelected: true
        },
        {
          id: '18',
          name: '竞品分析.md',
          type: 'md',
          status: 'processing',
          size: '8.9KB',
          lastModified: new Date('2025-08-01'),
          isSelected: false
        },
        {
          id: '19',
          name: '用户画像分析.txt',
          type: 'txt',
          status: 'success',
          size: '1.5MB',
          lastModified: new Date('2025-07-31'),
          isSelected: true
        },
        {
          id: '20',
          name: '财务预算表.pdf',
          type: 'pdf',
          status: 'error',
          size: '5.8MB',
          lastModified: new Date('2025-07-30'),
          isSelected: false
        },
        {
          id: '21',
          name: '运营策略方案.docx',
          type: 'doc',
          status: 'success',
          size: '15.6MB',
          lastModified: new Date('2025-07-29'),
          isSelected: true
        }
      ]
    },
    {
      id: 'research',
      name: '研究资料库',
      documents: [
        {
          id: '22',
          name: 'AI大模型研究论文.pdf',
          type: 'pdf',
          status: 'success',
          size: '78.9MB',
          lastModified: new Date('2025-08-04'),
          isSelected: true
        },
        {
          id: '23',
          name: '深度学习算法笔记.md',
          type: 'md',
          status: 'success',
          size: '25.7KB',
          lastModified: new Date('2025-08-03'),
          isSelected: true
        },
        {
          id: '24',
          name: '机器学习实战案例.txt',
          type: 'txt',
          status: 'processing',
          size: '5.2MB',
          lastModified: new Date('2025-08-02'),
          isSelected: false
        },
        {
          id: '25',
          name: '神经网络架构设计.docx',
          type: 'doc',
          status: 'success',
          size: '31.4MB',
          lastModified: new Date('2025-08-01'),
          isSelected: true
        },
        {
          id: '26',
          name: '自然语言处理综述.pdf',
          type: 'pdf',
          status: 'error',
          size: '42.6MB',
          lastModified: new Date('2025-07-31'),
          isSelected: false
        },
        {
          id: '27',
          name: '计算机视觉应用.md',
          type: 'md',
          status: 'success',
          size: '18.3KB',
          lastModified: new Date('2025-07-30'),
          isSelected: true
        },
        {
          id: '28',
          name: '强化学习原理.txt',
          type: 'txt',
          status: 'success',
          size: '3.7MB',
          lastModified: new Date('2025-07-29'),
          isSelected: false
        }
      ]
    },
    {
      id: 'personal',
      name: '个人文档库',
      documents: [
        {
          id: '29',
          name: '工作日志.md',
          type: 'md',
          status: 'success',
          size: '156KB',
          lastModified: new Date('2025-08-04'),
          isSelected: true
        },
        {
          id: '30',
          name: '学习笔记合集.txt',
          type: 'txt',
          status: 'success',
          size: '8.9MB',
          lastModified: new Date('2025-08-03'),
          isSelected: true
        },
        {
          id: '31',
          name: '项目总结.docx',
          type: 'doc',
          status: 'processing',
          size: '12.5MB',
          lastModified: new Date('2025-08-02'),
          isSelected: false
        },
        {
          id: '32',
          name: '技能提升规划.pdf',
          type: 'pdf',
          status: 'success',
          size: '3.1MB',
          lastModified: new Date('2025-08-01'),
          isSelected: true
        },
        {
          id: '33',
          name: '读书心得.md',
          type: 'md',
          status: 'error',
          size: '89KB',
          lastModified: new Date('2025-07-31'),
          isSelected: false
        },
        {
          id: '34',
          name: '生活感悟.txt',
          type: 'txt',
          status: 'success',
          size: '456KB',
          lastModified: new Date('2025-07-30'),
          isSelected: false
        }
      ]
    }
  ]);

  const selectedLibrary = knowledgeLibraries.find(lib => lib.id === selectedLibraryId);
  const allDocumentsSelected = selectedLibrary?.documents.every(doc => doc.isSelected) || false;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✓';
      case 'error': return '!';
      case 'processing': return '...';
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

  const handleExploreClick = () => {
    setShowExploreModal(true);
  };

  const handleAddClick = () => {
    setShowUploadModal(true);
  };

  const handleExploreSubmit = () => {
    // 处理探索提交逻辑
    console.log('Explore query:', exploreQuery);
    setShowExploreModal(false);
    setExploreQuery('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(files);
      console.log('Selected files:', Array.from(files).map(f => f.name));
    }
  };

  const handleUploadSubmit = () => {
    if (selectedFiles) {
      // 处理文件上传逻辑
      console.log('Uploading files:', Array.from(selectedFiles).map(f => f.name));
      setShowUploadModal(false);
      setSelectedFiles(null);
    }
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
          {/* 知识库选择区域 */}
          <div className="library-selection-section">
            <label className="library-label">选择知识库:</label>
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
          </div>

          {/* 操作按钮区域 */}
          <div className="action-buttons">
            <button className="action-btn search-btn" onClick={handleExploreClick}>
              探索
            </button>
            <button className="action-btn add-btn" onClick={handleAddClick}>
              添加
            </button>
          </div>

          {/* 文档选择区域 */}
          <div className="documents-section">
            {/* 全选选项 */}
            <div className="select-all-option">
              <label className="document-item select-all-item">
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
                •
              </div>
            ))}
          </div>
          <button className="collapsed-add-knowledge" title="添加知识">
            +
          </button>
        </div>
      )}
      
      {/* 探索来源弹窗 */}
      {showExploreModal && (
        <div className="modal-overlay" onClick={() => setShowExploreModal(false)}>
          <div className="modal-content explore-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>探索来源</h3>
              <button 
                className="modal-close"
                onClick={() => setShowExploreModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="explore-icon">
                搜索
              </div>
              <h4>您对哪些感兴趣?</h4>
              <p className="explore-description">
                描述您想了解的内容，或点击"我很好奇"探索新主题。
              </p>
              
              <textarea
                className="explore-input"
                placeholder="描述您想了解的内容..."
                value={exploreQuery}
                onChange={(e) => setExploreQuery(e.target.value)}
                rows={4}
              />
              
              <div className="modal-actions">
                <button 
                  className="modal-btn secondary-btn"
                  onClick={() => {
                    setExploreQuery('我很好奇');
                  }}
                >
                  我很好奇
                </button>
                <button 
                  className="modal-btn primary-btn"
                  onClick={handleExploreSubmit}
                  disabled={!exploreQuery.trim()}
                >
                  提交
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 文件上传弹窗 */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content upload-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>上传文件</h3>
              <button 
                className="modal-close"
                onClick={() => setShowUploadModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="upload-area">
                <div className="upload-icon">上传</div>
                <h4>选择要上传的文件</h4>
                <p className="upload-description">
                  支持 .txt, .md, .pdf, .doc, .docx 等格式
                </p>
                
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept=".txt,.md,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="file-input"
                />
                <label htmlFor="file-upload" className="upload-btn">
                  选择文件
                </label>
                
                {selectedFiles && (
                  <div className="selected-files">
                    <h5>已选择文件:</h5>
                    <ul>
                      {Array.from(selectedFiles).map((file, index) => (
                        <li key={index} className="file-item">
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button 
                  className="modal-btn secondary-btn"
                  onClick={() => setShowUploadModal(false)}
                >
                  取消
                </button>
                <button 
                  className="modal-btn primary-btn"
                  onClick={handleUploadSubmit}
                  disabled={!selectedFiles || selectedFiles.length === 0}
                >
                  上传
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
