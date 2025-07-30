'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import Navigation from '@/components/Navigation'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, loading } = useAuth()
  const pathname = usePathname()
  
  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  // Public routes that don't need auth
  const publicRoutes = ['/login', '/', '/register']
  const isPublicRoute = publicRoutes.includes(pathname)

  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-4">Please log in to access this page.</p>
          <a 
            href="/login" 
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  // If authenticated and on login/register page, redirect to dashboard
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    window.location.href = '/dashboard'
    return <div>Redirecting...</div>
  }

  // Show navigation for authenticated users (except on login page)
  const showNavigation = isAuthenticated && !isPublicRoute

  return (
    <>
      {showNavigation && <Navigation />}
      <main className={showNavigation ? 'pt-32' : ''}>
        {children}
      </main>
    </>
  )
}
