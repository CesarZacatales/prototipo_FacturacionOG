import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  Database, 
  FileText, 
  Store, 
  User,
  Shield,
  LogOut,
  X,
  CreditCard
} from 'lucide-react';
import { User as UserType } from '../types';

interface SidebarProps {
  currentView: string;
  user: UserType | null;
  cartItemCount: number;
  onViewChange: (view: any) => void;
  onShowAuth: (requiredRole?: 'admin' | 'customer' | 'cashier') => void;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  user,
  cartItemCount,
  onViewChange,
  onShowAuth,
  onLogout,
  isOpen,
  onToggle,
}) => {
  const adminMenuItems = [
    { id: 'dashboard', label: 'Productos', icon: Package },
    { id: 'dte', label: 'DTEs', icon: Database },
    { id: 'invoices', label: 'Facturas', icon: FileText },
  ];

  const cashierMenuItems = [
    { id: 'cashier', label: 'Punto de Venta', icon: CreditCard },
    { id: 'invoices', label: 'Facturas', icon: FileText },
  ];

  const customerMenuItems = [
    { id: 'shop', label: 'Tienda', icon: Store },
    { id: 'cart', label: 'Carrito', icon: ShoppingCart },
    { id: 'invoices', label: 'Mis Facturas', icon: FileText },
  ];

  const guestMenuItems = [
    { id: 'shop', label: 'Tienda', icon: Store },
    { id: 'cart', label: 'Carrito', icon: ShoppingCart },
  ];

  const menuItems = user?.role === 'admin' 
    ? adminMenuItems 
    : user?.role === 'cashier'
    ? cashierMenuItems
    : user 
    ? customerMenuItems 
    : guestMenuItems;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-5 w-5 text-purple-600" />;
      case 'cashier':
        return <CreditCard className="h-5 w-5 text-green-600" />;
      default:
        return <User className="h-5 w-5 text-blue-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100';
      case 'cashier':
        return 'bg-green-100';
      default:
        return 'bg-blue-100';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'cashier':
        return 'Cajera';
      default:
        return 'Cliente';
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-lg border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-64
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-600 rounded-lg p-2">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">AdventureWorks</h1>
              <p className="text-xs text-gray-500">BikeStore</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info */}
        {user ? (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getRoleColor(user.role)}`}>
                {getRoleIcon(user.role)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500">
                  {getRoleLabel(user.role)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-gray-200">
            <div className="space-y-2">
              <button
                onClick={() => onShowAuth()}
                className="w-full flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="text-sm">Iniciar Sesión</span>
              </button>
                {/* <div className="text-xs text-gray-500 px-3">
                <p>• Admin: admin@adventureworks.com</p>
                <p>• Cajera: cajera@adventureworks.com</p>
                <!---<p>• Cliente: cliente@ejemplo.com</p> --->
                </div> */}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left
                    ${isActive 
                      ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.id === 'cart' && cartItemCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        {user && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};