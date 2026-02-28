import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Workout from './pages/Workout';
import Subscription from './pages/Subscription';
import History from './pages/History';
import Shop from './pages/Shop';
import { useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useStore } from './store/useStore';

// **추가할 한 줄**
import ErrorBoundary from './components/ErrorBoundary';

const initialOptions = {
  clientId: "test", // Fake credentials. In real app, put the client ID from PayPal MCP.
  currency: "USD",
  intent: "capture",
};

function App() {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    // Initial migration/fix check
    useStore.getState().renameToPipi();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await useStore.getState().fetchFromFirestore();
      }
    });
    return () => unsubscribe();
  }, [setUser]);

  return (
    <PayPalScriptProvider options={initialOptions}>
      <Router>
        <div className="w-full min-h-screen bg-slate-900 text-slate-100 flex justify-center">
          <div className="w-full max-w-full md:max-w-4xl lg:max-w-6xl bg-slate-800 shadow-xl overflow-y-auto relative h-screen md:h-auto md:min-h-[80vh] md:my-8 md:rounded-3xl md:border md:border-slate-700">

            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
              <Route path="/workout" element={<Workout />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/history" element={<History />} />
              <Route path="/shop" element={<Shop />} />
            </Routes>
          </div>
        </div>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;
