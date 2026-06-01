import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ui/ProtectedRoute'
import OpeningPage from './pages/OpeningPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import TimelinePage from './pages/TimelinePage'
import MapPage from './pages/MapPage'

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><OpeningPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/home" element={<PageWrapper><ProtectedRoute><HomePage /></ProtectedRoute></PageWrapper>} />
        <Route path="/timeline" element={<PageWrapper><ProtectedRoute><TimelinePage /></ProtectedRoute></PageWrapper>} />
        <Route path="/map" element={<PageWrapper><ProtectedRoute><MapPage /></ProtectedRoute></PageWrapper>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
