import React from 'react';
import { ShoppingCart, Package, CreditCard, FileText, Database, User, Shield, LogOut } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  currentView: string;
  user: UserType | null;
  cartItemCount: number;
  onViewChange: (view: any) => void;
  onShowAuth: (requiredRole?: 'admin' | 'customer') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  user,
  cartItemCount,
  onViewChange,
  onShowAuth,
  onLogout,
}) => {
  return (
    <header className="bg-white shadow-lg border-b-2 border-blue-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BikeStore Pro</h1>
              <p className="text-xs text-gray-500">Sistema de Facturación Electrónica</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user?.role === 'admin' ? (
              <>
                <button
                  onClick={() => onViewChange('dashboard')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Package className="h-4 w-4" />
                  <span>Productos</span>
                </button>
                <button
                  onClick={() => onViewChange('dte')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'dte'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Database className="h-4 w-4" />
                  <span>DTEs</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onViewChange('shop')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'shop'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Package className="h-4 w-4" />
                  <span>Tienda</span>
                </button>
                <button
                  onClick={() => onViewChange('cart')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors relative ${
                    currentView === 'cart'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Carrito</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </>
            )}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${user.role === 'admin' ? 'bg-purple-100' : 'bg-green-100'}`}>
                    {user.role === 'admin' ? (
                      <Shield className="h-4 w-4 text-purple-600" />
                    ) : (
                      <User className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onShowAuth('customer')}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm">Cliente</span>
                </button>
                <button
                  onClick={() => onShowAuth('admin')}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Admin</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};