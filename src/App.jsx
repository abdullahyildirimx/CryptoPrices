import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Header from './components/Header';
import { lazy } from 'react';

const SpotPage = lazy(() => import('./pages/SpotPage'));
const FuturesPage = lazy(() => import('./pages/FuturesPage'));

const App = () => {
  return (
    <Router>
      <div className="mx-auto min-h-dvh min-w-360 max-w-1400">
        <Header />
        <Routes>
          <Route path="/" element={<SpotPage />} />
          <Route path="/futures" element={<FuturesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
