'use client'

import { useAuth } from '@/contexts/AuthContext'
import { X, User, Mail, CheckCircle, LogOut } from 'lucide-react'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, logout } = useAuth()

  if (!isOpen) return null

  const handleLogout = () => {
    logout()
    onClose()
    window.location.href = '/login'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden transform transition-all">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="text-lg font-bold text-white mb-1">Profile</h3>
          <p className="text-purple-100 text-xs">Account Details</p>
        </div>

        {/* Profile Content */}
        <div className="p-4">
          {/* Avatar */}
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h4>
            <div className="flex items-center justify-center mt-1">
              <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                <CheckCircle className="w-3 h-3 mr-1" />
                <span>Active</span>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Name</p>
                <p className="text-gray-900 font-semibold text-sm truncate">{user?.firstName} {user?.lastName}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Mail className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Email</p>
                <p className="text-gray-900 font-semibold text-sm truncate">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Role</p>
                <p className="text-gray-900 font-semibold text-sm capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
