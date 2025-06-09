import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ProductDashboard } from './components/ProductDashboard';
import { ShoppingCart } from './components/ShoppingCart';
import { PaymentGateway } from './components/PaymentGateway';
import { ElectronicInvoice } from './components/ElectronicInvoice';
import { DTEManagement } from './components/DTEManagement';
import { InvoiceManagement } from './components/InvoiceManagement';
import { AuthModal } from './components/AuthModal';
import { Product, CartItem, Invoice, DTERecord, User } from './types';
import { Menu } from 'lucide-react';

type View = 'dashboard' | 'shop' | 'cart' | 'payment' | 'invoice' | 'dte' | 'invoices';

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Mountain Bike Adventure Pro',
    price: 1250.00,
    stock: 15,
    category: 'Bicicletas',
    image: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '2',
    name: 'Casco de Seguridad',
    price: 85.00,
    stock: 45,
    category: 'Accesorios',
    image: 'https://www.freundferreteria.com/Productos/GetMultimedia?idProducto=d6a2518e-1b1a-4f6d-a5b4-aff1870e7135&idMultimediaProducto=bc64e1cf-34e5-40c6-9555-3304d7229bf9&width=500&height=500&qa=90&esImagen=True&ext=.jpg'
  },
  {
    id: '3',
    name: 'Kit de Herramientas Completo',
    price: 120.00,
    stock: 30,
    category: 'Herramientas',
    image: 'https://imagenes.elpais.com/resizer/v2/4XCIT36TCBFIBL7Z2J4CSU5XNE.webp?auth=ba1ada808bfc6a8ac79e9b34bda6e94fcc19f6e2c850a231c0a701abbf06346b&width=1960'
  },
  {
    id: '4',
    name: 'Bicicleta Urbana Comfort',
    price: 750.00,
    stock: 20,
    category: 'Bicicletas',
    image: 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
,{
  id: '5',
  name: 'Chaleco Reflectante',
  price: 95.00,
  stock: 15,
  category: 'Equipo de Seguridad',
  image: 'https://contents.mediadecathlon.com/p1805083/k$2585a9345257cd7083c5155018b0dd3e/chaleco-visibilidad-ciclismo.jpg?format=auto&quality=40&f=800x800'
}
,{
  id: '6',
  name: 'Guantes de Ciclismo',
  price: 45.00,
  stock: 50,
  category: 'Accesorios',
  image: 'https://www.lidl.es/media/product/0/0/4/0/5/7/2/guantes-de-ciclismo-zoom--3.jpg'
}
];

function App() {
  const [currentView, setCurrentView] = useState<View>('shop');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authRequiredRole, setAuthRequiredRole] = useState<'admin' | 'customer' | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [dteRecords, setDteRecords] = useState<DTERecord[]>([
    {
      id: 'DTE-2024-001',
      customerName: 'Juan Pérez Empresa S.A.',
      amount: 1435.00,
      status: 'approved',
      date: '2024-01-15',
      xmlUrl: '#',
      pdfUrl: '#'
    },
    {
      id: 'DTE-2024-002',
      customerName: 'María González Comercial',
      amount: 205.00,
      status: 'pending',
      date: '2024-01-15',
      xmlUrl: '#',
      pdfUrl: '#'
    },
    {
      id: 'DTE-2024-003',
      customerName: 'Carlos Ruiz Deportes',
      amount: 870.00,
      status: 'rejected',
      date: '2024-01-14',
      xmlUrl: '#',
      pdfUrl: '#'
    }
  ]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
    setSidebarOpen(false);
    
    // Redirect based on user role
    if (userData.role === 'admin') {
      setCurrentView('dashboard');
    } else {
      setCurrentView('shop');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
    setCurrentView('shop');
    setSidebarOpen(false);
  };

  const handleShowAuth = (requiredRole?: 'admin' | 'customer') => {
    setAuthRequiredRole(requiredRole);
    setShowAuthModal(true);
  };

  const handleViewChange = (view: View) => {
    // Check if admin views require admin authentication
    if ((view === 'dashboard' || view === 'dte') && (!user || user.role !== 'admin')) {
      handleShowAuth('admin');
      return;
    }
    
    // Check if payment requires customer authentication
    if (view === 'payment' && !user) {
      handleShowAuth('customer');
      return;
    }
    
    setCurrentView(view);
    setSidebarOpen(false);
  };

  const addToCart = (product: Product, quantity: number) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { product, quantity }]);
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter(item => item.product.id !== productId));
    } else {
      setCartItems(cartItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString()
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const processPayment = (paymentData: any) => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.13; // 13% IVA
    const total = subtotal + tax;

    const invoice: Invoice = {
      id: `INV-${Date.now()}`,
      customerName: paymentData.customerName,
      customerNIT: paymentData.customerNIT,
      customerEmail: paymentData.customerEmail,
      items: cartItems,
      subtotal,
      tax,
      total,
      date: new Date().toISOString().split('T')[0],
      status: 'generated'
    };

    setCurrentInvoice(invoice);
    setInvoices([invoice, ...invoices]);
    
    // Add to DTE records
    const newDTE: DTERecord = {
      id: `DTE-${Date.now()}`,
      customerName: paymentData.customerName,
      amount: total,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      xmlUrl: '#',
      pdfUrl: '#'
    };
    setDteRecords([newDTE, ...dteRecords]);
    
    // Clear cart
    setCartItems([]);
    setCurrentView('invoice');
  };

  const handleDownloadPDF = (invoiceId: string) => {
    // Create a simple PDF content
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    const pdfContent = `
FACTURA ELECTRÓNICA - BIKESTORE PRO
=====================================

Factura: ${invoice.id}
Fecha: ${invoice.date}
Cliente: ${invoice.customerName}
NIT/DUI: ${invoice.customerNIT}
Email: ${invoice.customerEmail}

PRODUCTOS:
${invoice.items.map(item => 
  `${item.product.name} x${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}`
).join('\n')}

Subtotal: $${invoice.subtotal.toFixed(2)}
IVA (13%): $${invoice.tax.toFixed(2)}
TOTAL: $${invoice.total.toFixed(2)}

Documento firmado digitalmente
Validado por Ministerio de Hacienda
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `factura-${invoiceId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadXML = (invoiceId: string) => {
    // Create a simple XML DTE content
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<dte:GTDocumento xmlns:dte="http://www.sat.gob.gt/dte/fel/0.2.0" Version="0.1">
  <dte:SAT ClaseDocumento="dte">
    <dte:DTE ID="DatosCertificados">
      <dte:DatosEmision ID="DatosEmision">
        <dte:DatosGenerales Tipo="FACT" FechaHoraEmision="${invoice.date}T00:00:00.000-06:00" MonedaOperacion="GTQ" TipoOperacion="VENTA"/>
        <dte:Emisor NITEmisor="1234567890123" NombreEmisor="BikeStore Pro" CodigoEstablecimiento="1" NombreComercial="BikeStore Pro" AfiliacionIVA="GEN"/>
        <dte:Receptor IDReceptor="${invoice.customerNIT}" NombreReceptor="${invoice.customerName}" CorreoReceptor="${invoice.customerEmail}"/>
        <dte:Items>
          ${invoice.items.map((item, index) => `
          <dte:Item NumeroLinea="${index + 1}" BienOServicio="B">
            <dte:Cantidad>${item.quantity}</dte:Cantidad>
            <dte:UnidadMedida>UNI</dte:UnidadMedida>
            <dte:Descripcion>${item.product.name}</dte:Descripcion>
            <dte:PrecioUnitario>${item.product.price.toFixed(2)}</dte:PrecioUnitario>
            <dte:Precio>${(item.product.price * item.quantity).toFixed(2)}</dte:Precio>
            <dte:Descuento>0.00</dte:Descuento>
            <dte:Impuestos>
              <dte:Impuesto>
                <dte:NombreCorto>IVA</dte:NombreCorto>
                <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                <dte:MontoGravable>${(item.product.price * item.quantity).toFixed(2)}</dte:MontoGravable>
                <dte:MontoImpuesto>${((item.product.price * item.quantity) * 0.13).toFixed(2)}</dte:MontoImpuesto>
              </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${(item.product.price * item.quantity * 1.13).toFixed(2)}</dte:Total>
          </dte:Item>`).join('')}
        </dte:Items>
        <dte:Totales>
          <dte:TotalImpuestos>
            <dte:TotalImpuesto NombreCorto="IVA" TotalMontoImpuesto="${invoice.tax.toFixed(2)}"/>
          </dte:TotalImpuestos>
          <dte:GranTotal>${invoice.total.toFixed(2)}</dte:GranTotal>
        </dte:Totales>
      </dte:DatosEmision>
    </dte:DTE>
  </dte:SAT>
</dte:GTDocumento>`;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dte-${invoiceId}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return user?.role === 'admin' ? (
          <ProductDashboard
            products={products}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
          />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600">Acceso Denegado</h2>
            <p className="text-gray-500 mt-2">Se requieren permisos de administrador</p>
          </div>
        );
      case 'shop':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                  <p className="text-gray-600 text-sm">{product.category}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">${product.price}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product, 1)}
                    disabled={product.stock === 0}
                    className="w-full mt-3 bg-purple-600 text-white py-2 px-4 rounded-lg bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'cart':
        return (
          <ShoppingCart
            items={cartItems}
            onUpdateQuantity={updateCartQuantity}
            onProceedToPayment={() => handleViewChange('payment')}
          />
        );
      case 'payment':
        return (
          <PaymentGateway
            cartItems={cartItems}
            user={user}
            onProcessPayment={processPayment}
            onBack={() => setCurrentView('cart')}
            onShowAuth={() => handleShowAuth('customer')}
          />
        );
      case 'invoice':
        return currentInvoice ? (
          <ElectronicInvoice
            invoice={currentInvoice}
            onBack={() => setCurrentView('shop')}
          />
        ) : null;
      case 'invoices':
        return (
          <InvoiceManagement
            invoices={invoices}
            user={user}
            onViewInvoice={(invoice) => {
              setCurrentInvoice(invoice);
              setCurrentView('invoice');
            }}
            onDownloadPDF={handleDownloadPDF}
            onDownloadXML={handleDownloadXML}
          />
        );
      case 'dte':
        return user?.role === 'admin' ? (
          <DTEManagement
            records={dteRecords}
            onUpdateStatus={(id, status) => {
              setDteRecords(dteRecords.map(record =>
                record.id === id ? { ...record, status } : record
              ));
            }}
          />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600">Acceso Denegado</h2>
            <p className="text-gray-500 mt-2">Se requieren permisos de administrador</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        user={user}
        cartItemCount={cartItems.length}
        onViewChange={handleViewChange}
        onShowAuth={handleShowAuth}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">BikeStore Pro</h1>
            <div className="w-10"></div> {/* Spacer */}
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          {renderCurrentView()}
        </main>
      </div>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        requiredRole={authRequiredRole}
      />
    </div>
  );
}

export default App;