import React, { useState } from 'react';
import { X, User, Lock, Mail, Building, Eye, EyeOff } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
  requiredRole?: 'admin' | 'customer';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  requiredRole
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    nit: '',
    role: requiredRole || 'customer' as 'admin' | 'customer'
  });

  // Demo users for testing
  const demoUsers = {
    admin: {
      id: 'admin-1',
      email: 'admin@bikestorepro.com',
      name: 'Administrador Sistema',
      role: 'admin' as const
    },
    customer: {
      id: 'customer-1',
      email: 'cliente@ejemplo.com',
      name: 'Juan Pérez',
      role: 'customer' as const,
      nit: '1234567-8'
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple demo authentication
    if (isLogin) {
      if (formData.email === 'admin@bikestorepro.com' && formData.password === 'admin123') {
        onLogin(demoUsers.admin);
      } else if (formData.email === 'cliente@ejemplo.com' && formData.password === 'cliente123') {
        onLogin(demoUsers.customer);
      } else {
        alert('Credenciales incorrectas. Use:\nAdmin: admin@bikestorepro.com / admin123\nCliente: cliente@ejemplo.com / cliente123');
        return;
      }
    } else {
      // Registration
      const newUser: UserType = {
        id: Date.now().toString(),
        email: formData.email,
        name: formData.name,
        role: formData.role,
        ...(formData.role === 'customer' && { nit: formData.nit })
      };
      onLogin(newUser);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-600 rounded-lg p-2">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h2>
              {requiredRole && (
                <p className="text-sm text-gray-600">
                  {requiredRole === 'admin' ? 'Acceso de Administrador' : 'Acceso de Cliente'}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Demo Credentials Info */}
        <div className="p-6 bg-purple-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-purple-800 mb-2">Credenciales de Demostración:</h3>
          <div className="text-xs text-purple-700 space-y-1">
            <div><strong>Administrador:</strong> admin@bikestorepro.com / admin123</div>
            <div><strong>Cliente:</strong> cliente@ejemplo.com / cliente123</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Juan Pérez"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="usuario@ejemplo.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {!isLogin && !requiredRole && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Usuario *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'customer' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="customer">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          )}

          {!isLogin && (formData.role === 'customer' || requiredRole === 'customer') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIT/DUI
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.nit}
                  onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="1234567-8"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="px-6 pb-6 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-purple-600 hover:text-purple-700 font-medium"
            >
              {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};