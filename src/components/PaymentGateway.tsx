import React, { useState } from 'react';
import { CreditCard, Building, Lock, ArrowLeft, Shield } from 'lucide-react';
import { CartItem, PaymentData, User } from '../types';


interface PaymentGatewayProps {
  cartItems: CartItem[];
  user: User | null;
  onProcessPayment: (paymentData: PaymentData) => void;
  onBack: () => void;
  onShowAuth: () => void;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  cartItems,
  user,
  onProcessPayment,
  onBack,
  onShowAuth,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerNIT: user?.nit || '',
    customerEmail: user?.email || '',
    customerAddress: user?.address || '',
    customerIVA: '',
    customerPhone: '',
    documentType: 'FE', // FE = Factura Electrónica (consumidor final)
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    accountNumber: ''
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  // Si el usuario no está autenticado
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión Requerido</h2>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Lock className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Inicia sesión para continuar
          </h3>
          <p className="text-gray-600 mb-6">
            Para proceder con el pago y generar tu factura electrónica, necesitas iniciar sesión o crear una cuenta.
          </p>

          <div className="space-y-3">
            <button
              onClick={onShowAuth}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Iniciar Sesión / Crear Cuenta
            </button>
            <button
              onClick={onBack}
              className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Volver al Carrito
            </button>
          </div>

          {/* Resumen de pedido */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Resumen de tu pedido:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IVA (13%):</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="font-bold text-purple-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enviar datos de pago
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentData: PaymentData = {
      customerName: formData.customerName,
      customerNIT: formData.customerNIT,
      customerEmail: formData.customerEmail,
      customerAddress: formData.customerAddress,
      customerIVA: formData.customerIVA,
      customerPhone: formData.customerPhone,
      documentType: formData.documentType as 'FE' | 'CCFE',
      paymentMethod,
      ...(paymentMethod === 'card'
        ? {
            cardNumber: formData.cardNumber,
            expiryDate: formData.expiryDate,
            cvv: formData.cvv,
          }
        : {
            accountNumber: formData.accountNumber,
          }),
    };
    onProcessPayment(paymentData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Pasarela de Pago</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de pago */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center mb-6 p-4 bg-green-50 rounded-lg">
            <Lock className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">Conexión segura SSL</span>
            <Shield className="h-5 w-5 text-green-600 ml-2" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información del cliente */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Tipo de Documento Tributario */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Documento Tributario *
                  </label>
                  <select
                    required
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="FE">Factura Electrónica (Consumidor Final)</option>
                    <option value="CCFE">Crédito Fiscal Electrónico (Contribuyente IVA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo o Razón Social *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Juan Pérez / Empresa S.A. de C.V."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIT/DUI *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerNIT}
                    onChange={(e) => setFormData({ ...formData, customerNIT: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0614-123456-102-3"
                  />
                </div>

                {/* Dirección Fiscal */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección Fiscal *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerAddress}
                    onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Calle El Progreso #12, San Salvador"
                  />
                </div>

                {/* Número de IVA (solo si aplica) */}
                {formData.documentType === 'CCFE' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Registro IVA
                    </label>
                    <input
                      type="text"
                      value={formData.customerIVA}
                      onChange={(e) => setFormData({ ...formData, customerIVA: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="12345-6"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="7012-3456"
                  />
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Método de Pago</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Tarjeta de Crédito</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                    paymentMethod === 'transfer'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Building className="h-5 w-5" />
                  <span>Transferencia</span>
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Tarjeta *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Vencimiento *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        placeholder="MM/AA"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Cuenta *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    placeholder="1234567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Procesar Pago - ${total.toFixed(2)}
            </button>
          </form>
        </div>

        {/* Resumen del Pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h3>
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IVA (13%):</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-purple-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Lock className="h-4 w-4 text-green-500 mr-2" />
                <span>Pago 100% seguro</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 text-purple-500 mr-2" />
                <span>Certificado SSL válido</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
