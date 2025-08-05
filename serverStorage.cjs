const fs = require('fs');
const path = require('path');

class ServerStorageService {
  constructor() {
    this.dataDir = path.join(__dirname, 'data');
    this.ensureDataDirectory();
  }

  ensureDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  // ========== 文件操作 ==========
  saveData(filename, data) {
    try {
      const filePath = path.join(this.dataDir, `${filename}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error(`Failed to save ${filename}:`, error);
      return false;
    }
  }

  loadData(filename) {
    try {
      const filePath = path.join(this.dataDir, `${filename}.json`);
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error(`Failed to load ${filename}:`, error);
      return null;
    }
  }

  // ========== 消息存储 ==========
  saveMessages(messages) {
    return this.saveData('messages', messages);
  }

  loadMessages() {
    return this.loadData('messages') || [];
  }

  // ========== 会话存储 ==========
  saveSessions(sessions) {
    return this.saveData('sessions', sessions);
  }

  loadSessions() {
    return this.loadData('sessions') || [];
  }

  // ========== 知识库存储 ==========
  saveKnowledgeLibraries(libraries) {
    return this.saveData('knowledge_libraries', libraries);
  }

  loadKnowledgeLibraries() {
    return this.loadData('knowledge_libraries') || [];
  }

  // ========== 设置存储 ==========
  saveSettings(settings) {
    return this.saveData('settings', settings);
  }

  loadSettings() {
    return this.loadData('settings') || {};
  }

  // ========== 备份功能 ==========
  createBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = path.join(this.dataDir, 'backups');
      
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const backupData = {
        messages: this.loadMessages(),
        sessions: this.loadSessions(),
        knowledgeLibraries: this.loadKnowledgeLibraries(),
        settings: this.loadSettings(),
        timestamp: new Date().toISOString()
      };

      const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
      fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), 'utf8');
      
      console.log(`Backup created: ${backupFile}`);
      return backupFile;
    } catch (error) {
      console.error('Failed to create backup:', error);
      return null;
    }
  }

  // ========== 清理功能 ==========
  cleanOldBackups(daysToKeep = 7) {
    try {
      const backupDir = path.join(this.dataDir, 'backups');
      if (!fs.existsSync(backupDir)) return;

      const files = fs.readdirSync(backupDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      files.forEach(file => {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          console.log(`Deleted old backup: ${file}`);
        }
      });
    } catch (error) {
      console.error('Failed to clean old backups:', error);
    }
  }
}

module.exports = new ServerStorageService();
