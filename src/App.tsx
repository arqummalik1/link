import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LinkProvider } from './context/LinkContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const { session, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>; // Or a proper spinner
  if (!session) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LinkProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              } />
              <Route path="/add-link" element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </LinkProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
