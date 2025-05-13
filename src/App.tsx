import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from './components/ui/DarkModeContext';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Import from './pages/Import';
import Candidates from './pages/Candidates';
import Jobs from './pages/Jobs';
import Setting from './pages/Setting';
import './index.css';

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="import" element={<Import />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="settings" element={<Setting />} />
          </Route>
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}

export default App;