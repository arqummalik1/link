import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LinkProvider } from './context/LinkContext';
import { ThemeProvider } from './context/ThemeContext';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <LinkProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-link" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LinkProvider>
    </ThemeProvider>
  );
}

export default App;
