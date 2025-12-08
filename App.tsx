import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

function App() {
  const [firebaseStatus, setFirebaseStatus] = useState('🔄 Testing Firebase...');
  const [logs, setLogs] = useState<string[]>([]);


  const addLog = (message: string): void => {
    console.log(message);
    setLogs(prev => [...prev, message]);
  };

  useEffect(() => {
    // Add a small delay to ensure Firebase is ready
    const timer = setTimeout(() => {
      testFirebaseConnection();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const testFirebaseConnection = async () => {
    try {
      addLog('Step 1: Starting Firebase test...');
      setFirebaseStatus('🔄 Step 1: Starting test...');

      addLog('Step 2: Accessing Firestore...');
      setFirebaseStatus('🔄 Step 2: Accessing Firestore...');
      
      const testDoc = firestore().collection('test').doc('connection_test');
      
      addLog('Step 3: Writing to Firestore...');
      setFirebaseStatus('🔄 Step 3: Writing data...');
      
      await testDoc.set({
        message: 'Firebase is connected!',
        timestamp: new Date().toISOString(),
        platform: 'android',
        test: true,
      });
      
      addLog('Step 4: Write successful!');
      setFirebaseStatus('🔄 Step 4: Reading data...');
      
      const doc = await testDoc.get();
      
      if (doc.exists()) {
        addLog('Step 5: Read successful!');
        const data = doc.data();
        setFirebaseStatus('✅ Firebase Connected!\n\n' + JSON.stringify(data, null, 2));
      } else {
        addLog('Step 5: Document not found');
        setFirebaseStatus('⚠️ Write succeeded but read failed');
      }
      
    } catch (error) {
      if (error instanceof Error) {
        console.error('Firebase connection error:', error);
        setFirebaseStatus('❌ Firebase Connection Failed\n\nError: ' + error.message);
      } else {
        console.error('Firebase connection error:', error);
        setFirebaseStatus('❌ Firebase Connection Failed\n\nUnknown error');
      }
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Firebase Connection Test</Text>
          
          <View style={styles.statusBox}>
            <Text style={styles.status}>{firebaseStatus}</Text>
          </View>

          <Button title="Retry Test" onPress={testFirebaseConnection} />
          
          <View style={styles.logsBox}>
            <Text style={styles.logsTitle}>Logs:</Text>
            {logs.map((log, index) => (
              <Text key={index} style={styles.logText}>
                {index + 1}. {log}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
  },
  logsBox: {
    marginTop: 20,
    backgroundColor: '#e8f4f8',
    borderRadius: 10,
    padding: 15,
  },
  logsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logText: {
    fontSize: 12,
    marginVertical: 2,
    fontFamily: 'monospace',
  },
});

export default App;