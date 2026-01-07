import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import { logger } from '../utils/logger';
import type { LogEntry } from '../utils/logger';

const DEBUG_ENABLED = __DEV__; // Only show in development

export default function DebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [refreshCount, setRefreshCount] = useState(0);

  const handleShowLogs = useCallback(() => {
    setLogs(logger.getLogs());
    setIsVisible(true);
  }, []);

  const handleRefresh = useCallback(() => {
    setLogs(logger.getRecentLogs(100));
    setRefreshCount(prev => prev + 1);
  }, []);

  const handleClear = useCallback(() => {
    logger.clearLogs();
    setLogs([]);
  }, []);

  if (!DEBUG_ENABLED) {
    return null;
  }

  return (
    <>
      {/* Debug Button */}
      {!isVisible && (
        <TouchableOpacity
          style={styles.debugButton}
          onPress={handleShowLogs}
          activeOpacity={0.7}
        >
          <Text style={styles.debugButtonText}>🐛</Text>
        </TouchableOpacity>
      )}

      {/* Logs Modal */}
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>App Logs ({logs.length})</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={[styles.button, styles.refreshButton]}
                onPress={handleRefresh}
              >
                <Text style={styles.buttonText}>🔄 Refresh</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.clearButton]}
                onPress={handleClear}
              >
                <Text style={styles.buttonText}>🗑️ Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={() => setIsVisible(false)}
              >
                <Text style={styles.buttonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logs List */}
          <FlatList
            data={logs}
            keyExtractor={(item, index) => `${index}-${item.timestamp}`}
            renderItem={({ item }) => (
              <LogEntry logEntry={item} />
            )}
            contentContainerStyle={styles.listContent}
            inverted
            onContentSizeChange={() => {
              // Auto-scroll to bottom
            }}
          />

          {/* Empty State */}
          {logs.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No logs yet</Text>
              <Text style={styles.emptySubtext}>
                Perform actions in your app to see logs here
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}

/**
 * Individual log entry component
 */
function LogEntry({ logEntry }: { logEntry: LogEntry }) {
  const [expanded, setExpanded] = useState(false);
  const levelColor = getLevelColor(logEntry.level);
  const levelIcon = getLevelIcon(logEntry.level);

  // Truncate long messages
  const displayMessage = logEntry.message.length > 100 
    ? logEntry.message.substring(0, 100) + '...'
    : logEntry.message;

  return (
    <Pressable
      style={[styles.logEntry, { borderLeftColor: levelColor }]}
      onPress={() => setExpanded(!expanded)}
    >
      <View style={styles.logHeader}>
        <Text style={styles.logIcon}>{levelIcon}</Text>
        <View style={styles.logInfo}>
          <Text style={styles.logLevel}>{logEntry.level.toUpperCase()}</Text>
          <Text style={styles.logTime}>
            {new Date(logEntry.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </View>
      <Text style={[styles.logMessage, expanded && styles.logMessageExpanded]}>
        {expanded ? logEntry.message : displayMessage}
      </Text>
    </Pressable>
  );
}

/**
 * Get color based on log level
 */
function getLevelColor(level: LogEntry['level']): string {
  switch (level) {
    case 'error':
      return '#FF4444';
    case 'warn':
      return '#FF9800';
    case 'info':
      return '#2196F3';
    case 'debug':
      return '#9C27B0';
    default:
      return '#4CAF50';
  }
}

/**
 * Get icon based on log level
 */
function getLevelIcon(level: LogEntry['level']): string {
  switch (level) {
    case 'error':
      return '❌';
    case 'warn':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    case 'debug':
      return '🔍';
    default:
      return '📝';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingTop: 40,
  },
  header: {
    padding: 16,
    backgroundColor: '#2D2D2D',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    backgroundColor: '#2196F3',
  },
  clearButton: {
    backgroundColor: '#FF9800',
  },
  closeButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  logEntry: {
    backgroundColor: '#2D2D2D',
    borderLeftWidth: 4,
    borderRadius: 4,
    padding: 12,
    marginVertical: 4,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  logInfo: {
    flex: 1,
  },
  logLevel: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  logTime: {
    color: '#AAA',
    fontSize: 11,
    marginTop: 2,
  },
  logMessage: {
    color: '#DDD',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  logMessageExpanded: {
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptySubtext: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 8,
  },
  debugButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 8,
  },
  debugButtonText: {
    fontSize: 24,
  },
});
