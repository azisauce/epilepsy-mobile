import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import DebugPanel from './src/components/DebugPanel';
import './src/utils/logger'; // Initialize logger on app start

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
      <DebugPanel />
    </AuthProvider>
  );
}
