import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClubProvider, useClub } from './context/ClubContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance';
import Gallery from './pages/Gallery';
import Noticeboard from './pages/Noticeboard';
import Members from './pages/Members';
import AdminOverview from './pages/AdminOverview';

import './styles/global.css';

// Route Guard Component
const ProtectedRoute = ({ children, requireSuperAdmin = false }) => {
  const { user, loading, isSuperAdmin, ownClubId } = useAuth();
  const { clubId } = useParams();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        color: 'var(--accent)',
        fontFamily: 'var(--font-mono)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px'
      }}>
        LOADING SYSTEM DATA...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to={`/club/${ownClubId}/dashboard`} replace />;
  }

  // Check club access: if non-super_admin tries to access another club's URL, redirect to own club
  if (!isSuperAdmin && clubId && clubId !== ownClubId) {
    return <Navigate to={`/club/${ownClubId}/dashboard`} replace />;
  }

  return children;
};

// Root Redirect Handler
const RootRedirect = () => {
  const { user, loading, isSuperAdmin, ownClubId } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        color: 'var(--accent)',
        fontFamily: 'var(--font-mono)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        INITIALIZING SYSTEM...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to={`/club/${ownClubId}/dashboard`} replace />;
};

function App() {
  return (
    <AuthProvider>
      <ClubProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/admin" element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminOverview />
              </ProtectedRoute>
            } />

            <Route path="/club/:clubId/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/club/:clubId/finance" element={
              <ProtectedRoute>
                <Finance />
              </ProtectedRoute>
            } />

            <Route path="/club/:clubId/gallery" element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            } />

            <Route path="/club/:clubId/notices" element={
              <ProtectedRoute>
                <Noticeboard />
              </ProtectedRoute>
            } />

            <Route path="/club/:clubId/members" element={
              <ProtectedRoute>
                <Members />
              </ProtectedRoute>
            } />

            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </ClubProvider>
    </AuthProvider>
  );
}

export default App;
