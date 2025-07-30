'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Users, Calendar, Clock, LogOut, User, Stethoscope, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'
import ProfileModal from './ProfileModal'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Queue Management', href: '/queue', icon: Clock },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Doctors', href: '/doctors', icon: Stethoscope },
]

export default function Navigation() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <>
      <div className="bg-gray-900 shadow-lg border-b border-gray-700 fixed w-full top-0 z-50">
        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo and Brand - Give more space */}
            <div className="flex items-center flex-shrink-0 min-w-0 mr-8">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4">
                  <Image 
                    src="/allo-health-logo.svg" 
                    alt="Allo Health" 
                    width={32}
                    height={32}
                    className="w-8 h-8"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    onLoad={() => {
                      // Logo loaded successfully
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-white whitespace-nowrap">Allo Health Clinic</h1>
                  <p className="text-white text-xs opacity-75 whitespace-nowrap">Front Desk Management System</p>
                </div>
              </div>
            </div>

            {/* Navigation Links - Horizontal */}
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* User Profile and Actions */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
              
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center space-x-3 text-white hover:bg-gray-700 rounded-md px-3 py-2 transition-colors"
              >
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                </div>
              </button>
              <button
                onClick={handleLogout}
                className="hidden md:inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-700">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </div>
                    </Link>
                  )
                })}
                {/* Mobile Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                >
                  <div className="flex items-center">
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  )
}
