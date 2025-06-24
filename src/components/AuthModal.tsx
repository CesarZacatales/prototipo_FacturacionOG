import React, { useState, useEffect } from 'react';
import { X, User, Lock, Mail, Building, Eye, EyeOff, Shield, CreditCard } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
  requiredRole?: 'admin' | 'customer' | 'cashier';
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
    role: requiredRole || 'customer' as 'admin' | 'customer' | 'cashier'
  });

  // Clear form when modal closes or opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: '',
        password: '',
        name: '',
        nit: '',
        role: requiredRole || 'customer'
      });
      setShowPassword(false);
    }
  }, [isOpen, requiredRole]);

  // Demo users for testing
  const demoUsers = {
    admin: {
      id: 'admin-1',
      email: 'admin@adventureworks.com',
      name: 'Administrador Sistema',
      role: 'admin' as const
    },
    customer: {
      id: 'customer-1',
      email: 'cliente@ejemplo.com',
      name: 'Juan Pérez',
      role: 'customer' as const,
      nit: '1234567-8'
    },
    cashier: {
      id: 'cashier-1',
      email: 'cajera@adventureworks.com',
      name: 'María González',
      role: 'cashier' as const
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Admin credentials
      if (formData.email === 'admin@adventureworks.com' && formData.password === 'admin123') {
        onLogin(demoUsers.admin);
        return;
      }
      
      // Cashier credentials
      if (formData.email === 'cajera@adventureworks.com' && formData.password === 'cajera123') {
        onLogin(demoUsers.cashier);
        return;
      }
      
      // Customer credentials
      if (formData.email === 'cliente@ejemplo.com' && formData.password === 'cliente123') {
        onLogin(demoUsers.customer);
        return;
      }
      
      // Generic admin check
      if (formData.email.includes('admin') && formData.password === 'admin123') {
        onLogin({
          ...demoUsers.admin,
          email: formData.email,
          name: 'Administrador'
        });
        return;
      }
      
      // Generic cashier check
      if (formData.email.includes('cajera') && formData.password === 'cajera123') {
        onLogin({
          ...demoUsers.cashier,
          email: formData.email,
          name: 'Cajera'
        });
        return;
      }
      
      // Generic customer check
      if (formData.password === 'cliente123') {
        onLogin({
          ...demoUsers.customer,
          email: formData.email,
          name: formData.email.split('@')[0]
        });
        return;
      }
      
      alert('Credenciales incorrectas. Use:\nAdmin: admin@adventureworks.com / admin123\nCajera: cajera@adventureworks.com / cajera123\nCliente: cliente@ejemplo.com / cliente123');
      return;
    } else {
      // Registration - auto-detect role based on email
      const isAdminEmail = formData.email.includes('admin') || formData.email.includes('administrador');
      const isCashierEmail = formData.email.includes('cajera') || formData.email.includes('cashier');
      
      let detectedRole: 'admin' | 'customer' | 'cashier' = 'customer';
      if (isAdminEmail) detectedRole = 'admin';
      else if (isCashierEmail) detectedRole = 'cashier';
      
      const newUser: UserType = {
        id: Date.now().toString(),
        email: formData.email,
        name: formData.name,
        role: requiredRole || detectedRole,
        ...(detectedRole === 'customer' && { nit: formData.nit })
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
              <p className="text-sm text-gray-600">AdventureWorks BikeStore</p>
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
        {/*
          <div className="p-6 bg-purple-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-purple-800 mb-2">Credenciales de Demostración:</h3>
            <div className="text-xs text-purple-700 space-y-1">
              <div className="flex items-center space-x-2">
                <Shield className="h-3 w-3" />
                <span><strong>Administrador:</strong> admin@adventureworks.com / admin123</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-3 w-3" />
                <span><strong>Cajera:</strong> cajera@adventureworks.com / cajera123</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-3 w-3" />
                <span><strong>Cliente:</strong> cliente@ejemplo.com / cliente123</span>
              </div>
              <div className="mt-2 text-purple-600">
                <strong>Tip:</strong> El sistema detecta automáticamente tu rol según el email
              </div>
            </div>
          </div>
        */}

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
            {!isLogin && (<></>
              /*<p className="text-xs text-gray-500 mt-1">
                Usa "admin" para administrador, "cajera" para cajera, o cualquier otro para cliente
              </p> */
            )}
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
                NIT/DUI (Opcional para clientes)
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