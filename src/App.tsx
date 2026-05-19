import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ui/ProtectedRoute'
import OpeningPage from './pages/OpeningPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import TimelinePage from './pages/TimelinePage'
import MapPage from './pages/MapPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<OpeningPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/timeline" element={<ProtectedRoute><TimelinePage /></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
