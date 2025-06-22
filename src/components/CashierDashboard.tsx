import React, { useState } from 'react';
import { 
  CreditCard, 
  ShoppingCart, 
  User, 
  Mail, 
  Building, 
  Plus, 
  Minus, 
  Trash2,
  Send,
  FileText,
  DollarSign,
  Package
} from 'lucide-react';
import { Product, CartItem, User as UserType } from '../types';

interface CashierDashboardProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  cartItems: CartItem[];
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onProcessPayment: (paymentData: any) => void;
  onSendInvoiceByEmail: (invoiceId: string, email: string) => void;
  user: UserType;
}

export const CashierDashboard: React.FC<CashierDashboardProps> = ({
  products,
  onAddToCart,
  cartItems,
  onUpdateCartQuantity,
  onProcessPayment,
  onSendInvoiceByEmail,
  user
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customerData, setCustomerData] = useState({
    name: '',
    nit: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  const handleProcessSale = () => {
    if (!customerData.name || !customerData.nit || !customerData.email) {
      alert('Por favor complete todos los datos del cliente');
      return;
    }

    if (cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const paymentData = {
      customerName: customerData.name,
      customerNIT: customerData.nit,
      customerEmail: customerData.email,
      paymentMethod: paymentMethod === 'cash' ? 'transfer' : 'card'
    };

    onProcessPayment(paymentData);
    
    // Clear form
    setCustomerData({ name: '', nit: '', email: '' });
    setShowPaymentForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-600 rounded-lg p-3">
          <CreditCard className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Panel de Cajera</h2>
          <p className="text-gray-600">Bienvenida, {user.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-lg font-bold text-green-600">${product.price}</span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onAddToCart(product, 1)}
                    disabled={product.stock === 0}
                    className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart and Payment Section */}
        <div className="lg:col-span-1 space-y-6">
          {/* Cart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Carrito de Venta
            </h3>
            
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Carrito vacío</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      <p className="text-green-600 font-semibold">${item.product.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onUpdateCartQuantity(item.product.id, 0)}
                        className="p-1 rounded bg-red-100 hover:bg-red-200 text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Totals */}
            {cartItems.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (13%):</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">${total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Customer Data Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Datos del Cliente
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIT/DUI *
                </label>
                <input
                  type="text"
                  value={customerData.nit}
                  onChange={(e) => setCustomerData({ ...customerData, nit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="1234567-8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="juan@ejemplo.com"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Método de Pago
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 border-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  paymentMethod === 'cash'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Building className="h-4 w-4" />
                <span className="text-sm">Efectivo</span>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-3 border-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span className="text-sm">Tarjeta</span>
              </button>
            </div>

            <button
              onClick={handleProcessSale}
              disabled={cartItems.length === 0 || !customerData.name || !customerData.nit || !customerData.email}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Procesar Venta</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Día</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Productos en carrito:</span>
                <span className="font-semibold">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total actual:</span>
                <span className="font-semibold text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};