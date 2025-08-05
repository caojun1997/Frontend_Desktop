interface StoredMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sessionId: string;
}

interface StoredSession {
  id: string;
  title: string;
  createdAt: Date;
  lastUpdated: Date;
  messageCount: number;
}

interface StoredKnowledgeLibrary {
  id: string;
  name: string;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    size?: string;
    lastModified?: Date;
    isSelected: boolean;
  }>;
}

class LocalStorageService {
  private readonly MESSAGES_KEY = 'chat_messages';
  private readonly SESSIONS_KEY = 'chat_sessions';
  private readonly KNOWLEDGE_KEY = 'knowledge_libraries';
  private readonly SETTINGS_KEY = 'app_settings';

  // ========== 消息存储 ==========
  saveMessage(message: StoredMessage): void {
    const messages = this.getAllMessages();
    messages.push(message);
    localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messages));
  }

  getMessagesBySession(sessionId: string): StoredMessage[] {
    const messages = this.getAllMessages();
    return messages
      .filter(msg => msg.sessionId === sessionId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  getAllMessages(): StoredMessage[] {
    const stored = localStorage.getItem(this.MESSAGES_KEY);
    if (!stored) return [];
    
    try {
      const messages = JSON.parse(stored);
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error('Failed to parse messages:', error);
      return [];
    }
  }

  deleteMessage(messageId: string): void {
    const messages = this.getAllMessages();
    const filtered = messages.filter(msg => msg.id !== messageId);
    localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(filtered));
  }

  // ========== 会话存储 ==========
  saveSession(session: StoredSession): void {
    const sessions = this.getAllSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
  }

  getAllSessions(): StoredSession[] {
    const stored = localStorage.getItem(this.SESSIONS_KEY);
    if (!stored) return [];
    
    try {
      const sessions = JSON.parse(stored);
      return sessions.map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        lastUpdated: new Date(session.lastUpdated)
      }));
    } catch (error) {
      console.error('Failed to parse sessions:', error);
      return [];
    }
  }

  deleteSession(sessionId: string): void {
    // 删除会话和相关消息
    const sessions = this.getAllSessions();
    const filtered = sessions.filter(session => session.id !== sessionId);
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(filtered));
    
    // 删除相关消息
    const messages = this.getAllMessages();
    const filteredMessages = messages.filter(msg => msg.sessionId !== sessionId);
    localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(filteredMessages));
  }

  updateSessionTitle(sessionId: string, title: string): void {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      session.title = title;
      session.lastUpdated = new Date();
      this.saveSession(session);
    }
  }

  // ========== 知识库存储 ==========
  saveKnowledgeLibraries(libraries: StoredKnowledgeLibrary[]): void {
    localStorage.setItem(this.KNOWLEDGE_KEY, JSON.stringify(libraries));
  }

  getKnowledgeLibraries(): StoredKnowledgeLibrary[] {
    const stored = localStorage.getItem(this.KNOWLEDGE_KEY);
    if (!stored) return [];
    
    try {
      const libraries = JSON.parse(stored);
      return libraries.map((lib: any) => ({
        ...lib,
        documents: lib.documents.map((doc: any) => ({
          ...doc,
          lastModified: doc.lastModified ? new Date(doc.lastModified) : undefined
        }))
      }));
    } catch (error) {
      console.error('Failed to parse knowledge libraries:', error);
      return [];
    }
  }

  // ========== 应用设置 ==========
  saveSetting(key: string, value: any): void {
    const settings = this.getSettings();
    settings[key] = value;
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  getSetting(key: string, defaultValue: any = null): any {
    const settings = this.getSettings();
    return settings[key] !== undefined ? settings[key] : defaultValue;
  }

  getSettings(): Record<string, any> {
    const stored = localStorage.getItem(this.SETTINGS_KEY);
    if (!stored) return {};
    
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse settings:', error);
      return {};
    }
  }

  // ========== 数据清理和导出 ==========
  clearAllData(): void {
    localStorage.removeItem(this.MESSAGES_KEY);
    localStorage.removeItem(this.SESSIONS_KEY);
    localStorage.removeItem(this.KNOWLEDGE_KEY);
    localStorage.removeItem(this.SETTINGS_KEY);
  }

  exportData(): string {
    return JSON.stringify({
      messages: this.getAllMessages(),
      sessions: this.getAllSessions(),
      knowledgeLibraries: this.getKnowledgeLibraries(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.messages) {
        localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(data.messages));
      }
      if (data.sessions) {
        localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(data.sessions));
      }
      if (data.knowledgeLibraries) {
        localStorage.setItem(this.KNOWLEDGE_KEY, JSON.stringify(data.knowledgeLibraries));
      }
      if (data.settings) {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(data.settings));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // ========== 数据统计 ==========
  getDataStats(): {
    totalMessages: number;
    totalSessions: number;
    totalLibraries: number;
    storageSize: string;
  } {
    const messages = this.getAllMessages();
    const sessions = this.getAllSessions();
    const libraries = this.getKnowledgeLibraries();
    
    // 计算存储大小
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
      }
    }
    
    return {
      totalMessages: messages.length,
      totalSessions: sessions.length,
      totalLibraries: libraries.length,
      storageSize: `${(totalSize / 1024).toFixed(2)} KB`
    };
  }
}

export default new LocalStorageService();
