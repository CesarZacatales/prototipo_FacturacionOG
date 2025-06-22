import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ProductDashboard } from './components/ProductDashboard';
import { ShoppingCart } from './components/ShoppingCart';
import { PaymentGateway } from './components/PaymentGateway';
import { ElectronicInvoice } from './components/ElectronicInvoice';
import { DTEManagement } from './components/DTEManagement';
import { InvoiceManagement } from './components/InvoiceManagement';
import { CashierDashboard } from './components/CashierDashboard';
import { AuthModal } from './components/AuthModal';
import { Product, CartItem, Invoice, DTERecord, User } from './types';
import { generateDTEJSON } from './utils/dteGenerator';
import { Menu } from 'lucide-react';

type View = 'dashboard' | 'shop' | 'cart' | 'payment' | 'invoice' | 'dte' | 'invoices' | 'cashier';

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Mountain Bike Adventure Pro',
    price: 1250.00,
    stock: 15,
    category: 'Bicicletas',
    image: 'https://www.lacuracaonline.com/media/catalog/product/4/6/462785000017.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700'
  },
  {
    id: '2',
    name: 'Casco de Seguridad Pro',
    price: 85.00,
    stock: 45,
    category: 'Accesorios',
    image: 'https://tatoo.ws/files/public/tips/CascoMultiuso.jpg'
  },
  {
    id: '3',
    name: 'Kit de Herramientas Completo',
    price: 120.00,
    stock: 30,
    category: 'Herramientas',
    image: 'https://m.media-amazon.com/images/I/71an8tEb-DL._UF894,1000_QL80_.jpg'
  },
  {
    id: '4',
    name: 'Bicicleta Urbana Comfort',
    price: 750.00,
    stock: 20,
    category: 'Bicicletas',
    image: 'https://www.thebikecompany.com.ar/img/articulos/orbea_comfort_40_18_imagen1.jpg'
  },
  {
    id: '5',
    name: 'Bicicleta de Carretera Speed',
    price: 1850.00,
    stock: 8,
    category: 'Bicicletas',
    image: 'https://www.thebikecompany.com.ar/img/articulos/orbea_comfort_40_18_imagen1.jpg'
  },
  {
    id: '6',
    name: 'Guantes de Ciclismo Pro',
    price: 35.00,
    stock: 60,
    category: 'Accesorios',
    image: 'https://acdn-us.mitiendanube.com/stores/144/702/products/azul-8dced2f0e8e0a5327117204594337915-1024-1024.jpg'
  },
  {
    id: '7',
    name: 'Luces LED Delanteras',
    price: 45.00,
    stock: 40,
    category: 'Accesorios',
    image: 'https://bicihack.com/wp-content/uploads/mejor-luz-delantera-bicicleta-600x354.jpg'
  },
  {
    id: '8',
    name: 'Bomba de Aire Portátil',
    price: 25.00,
    stock: 35,
    category: 'Herramientas',
    image: 'https://www.hotebike.com/wp-content/uploads/2023/11/Bike-Air-Pump-Foot-Pump-with-160PSI-Intelligent-Pressure-Gauge-Portable-Air-Pump-Inflator-2.jpg'
  },
  {
    id: '9',
    name: 'Candado de Seguridad',
    price: 55.00,
    stock: 25,
    category: 'Accesorios',
    image: 'https://www.santafixie.com/blog/wp-content/uploads/2023/12/candado-kryptonite-100-new-york-1412-negro-1.webp'
  },
  {
    id: '10',
    name: 'Bicicleta Eléctrica Urban',
    price: 2250.00,
    stock: 5,
    category: 'Bicicletas',
    image: 'https://www.santafixie.com/blog/wp-content/uploads/2025/05/santafixie-raval-spiny-1.webp'
  },
  {
    id: '11',
    name: 'Mochila de Hidratación',
    price: 75.00,
    stock: 18,
    category: 'Accesorios',
    image: 'https://m.media-amazon.com/images/I/51trRVOYpaL._SY1000_.jpg'
  },
  {
    id: '12',
    name: 'Kit de Reparación',
    price: 15.00,
    stock: 50,
    category: 'Herramientas',
    image: 'https://i.ebayimg.com/thumbs/images/g/xy8AAOSwE4tgFj0D/s-l1200.jpg'
  },
  {
    id: '13',
    name: 'Bicicleta BMX Freestyle',
    price: 450.00,
    stock: 12,
    category: 'Bicicletas',
    image: 'https://cdn.skatepro.com/product/520/stolen-agent-18-bmx-freestyle-bike.webp'
  },
  {
    id: '14',
    name: 'Gafas de Ciclismo UV',
    price: 65.00,
    stock: 35,
    category: 'Accesorios',
    image: 'https://m.media-amazon.com/images/I/51hRGw04J6L._UF1000,1000_QL80_.jpg'
  },
  {
    id: '15',
    name: 'Cadena de Bicicleta Reforzada',
    price: 28.00,
    stock: 40,
    category: 'Repuestos',
    image: 'https://www.kmmotos.com/cdn/shop/files/KMS-HND0583.png?v=1748398072'
  },
  {
    id: '16',
    name: 'Pedales Antideslizantes',
    price: 42.00,
    stock: 30,
    category: 'Repuestos',
    image: 'https://m.media-amazon.com/images/I/61c9muMxtTL._AC_SL1500_.jpg'
  },
  {
    id: '17',
    name: 'Sillin Ergonómico Pro',
    price: 95.00,
    stock: 22,
    category: 'Repuestos',
    image: 'https://http2.mlstatic.com/D_NQ_NP_914672-MLU78392460589_082024-O.webp'
  },
  {
    id: '18',
    name: 'Manubrio de Carbono',
    price: 180.00,
    stock: 15,
    category: 'Repuestos',
    image: 'https://www.traxion.mx/cdn/shop/files/era_carbon.jpg?v=1749227400&width=1946'
  },
  {
    id: '19',
    name: 'Bicicleta Plegable City',
    price: 650.00,
    stock: 10,
    category: 'Bicicletas',
    image: 'https://www.ubuy.sv/productimg/?image=aHR0cHM6Ly9pbWFnZXMtbmEuc3NsLWltYWdlcy1hbWF6b24uY29tL2ltYWdlcy9JLzcxNzhleUxxaGhMLl9TUzQwMF8uanBn.jpg'
  },
  {
    id: '20',
    name: 'Reflectores de Seguridad',
    price: 18.00,
    stock: 50,
    category: 'Accesorios',
    image: 'https://puntobike.com.pe/web/image/product.template/2122/image_1024?unique=4cbb464'
  },
  {
    id: '21',
    name: 'Timbre Clásico',
    price: 12.00,
    stock: 40,
    category: 'Accesorios',
    //image: 'https://m.media-amazon.com/images/I/41liEJy1uaL._AC_UF1000,1000_QL80_.jpg '
    image: 'https://i.ytimg.com/vi/ckUYk8zgBPs/maxresdefault.jpg'
  },
  {
    id: '22',
    name: 'Portabotellas Aluminio',
    price: 22.00,
    stock: 35,
    category: 'Accesorios',
    image: 'https://storage.googleapis.com/catalog-pictures-carrefour-es/catalog/pictures/hd_510x_/8430808190597_1.jpg'
  },
  {
    id: '23',
    name: 'Neumáticos Todo Terreno',
    price: 85.00,
    stock: 25,
    category: 'Repuestos',
    image: 'https://www.zerie.com/cdn/shop/articles/llantas.jpg?v=1497547975'
  },
  {
    id: '24',
    name: 'Frenos de Disco Hidráulicos',
    price: 150.00,
    stock: 15,
    category: 'Repuestos',
    image: 'https://www.kuakebicycle.com/wp-content/uploads/2021/11/Freno-De-Disco-Mecanico-VS-Hidraulico.jpg'
  }
];

const initialDTERecords: DTERecord[] = [
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
];

function App() {
  // Inicialización mejorada para redirigir según rol de usuario
  const [currentView, setCurrentView] = useState<View>(() => {
    const savedUser = localStorage.getItem('user');
    const savedView = localStorage.getItem('currentView') as View;
    
    if (savedUser) {
      const user: User = JSON.parse(savedUser);
      if (user.role === 'admin') return 'dashboard';
      if (user.role === 'cashier') return 'cashier';
    }
    
    return savedView || 'shop';
  });
  
  const [invoiceSourceView, setInvoiceSourceView] = useState<View>(() => {
    return (localStorage.getItem('invoiceSourceView') as View) || 'shop';
  });
  
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authRequiredRole, setAuthRequiredRole] = useState<'admin' | 'customer' | 'cashier' | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      const parsedProducts: Product[] = JSON.parse(savedProducts);
      
      // Actualizar productos con las imágenes de initialProducts
      return parsedProducts.map(parsedProduct => {
        const initialProduct = initialProducts.find(ip => ip.id === parsedProduct.id);
        return initialProduct ? {
          ...parsedProduct,
          image: initialProduct.image // Usar la imagen de initialProducts
        } : parsedProduct;
      });
    }
    return initialProducts;
  });
  
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(() => {
    const savedInvoice = localStorage.getItem('currentInvoice');
    return savedInvoice ? JSON.parse(savedInvoice) : null;
  });
  
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const savedInvoices = localStorage.getItem('invoices');
    return savedInvoices ? JSON.parse(savedInvoices) : [];
  });
  
  const [dteRecords, setDteRecords] = useState<DTERecord[]>(() => {
    const savedDTEs = localStorage.getItem('dteRecords');
    return savedDTEs ? JSON.parse(savedDTEs) : initialDTERecords;
  });

  // Limpiar localStorage en desarrollo para forzar uso de initialProducts
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      localStorage.removeItem('products');
    }
  }, []);

  // Guardar invoiceSourceView en localStorage
  useEffect(() => {
    localStorage.setItem('invoiceSourceView', invoiceSourceView);
  }, [invoiceSourceView]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (currentInvoice) {
      localStorage.setItem('currentInvoice', JSON.stringify(currentInvoice));
    } else {
      localStorage.removeItem('currentInvoice');
    }
  }, [currentInvoice]);

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('dteRecords', JSON.stringify(dteRecords));
  }, [dteRecords]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
    setSidebarOpen(false);
    
    // Usar setTimeout para permitir que el estado de user se actualice
    setTimeout(() => {
      // Redirección basada en rol
      if (userData.role === 'admin') {
        setCurrentView('dashboard');
        localStorage.setItem('currentView', 'dashboard');
      } else if (userData.role === 'cashier') {
        setCurrentView('cashier');
        localStorage.setItem('currentView', 'cashier');
      } else {
        setCurrentView('shop');
        localStorage.setItem('currentView', 'shop');
      }
    }, 0);
  };

  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
    setCurrentView('shop');
    setInvoiceSourceView('shop');
    setSidebarOpen(false);
    
    // Limpiar datos específicos del usuario
    localStorage.removeItem('user');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('currentInvoice');
    localStorage.removeItem('invoiceSourceView');
    localStorage.removeItem('currentView'); // Limpiamos la vista guardada
    localStorage.setItem('currentView', 'shop'); // Establecemos la vista a 'shop'
  };

  const handleShowAuth = (requiredRole?: 'admin' | 'customer' | 'cashier') => {
    setAuthRequiredRole(requiredRole);
    setShowAuthModal(true);
  };

  const handleViewChange = (view: View) => {
    // Check if admin views require admin authentication
    if ((view === 'dashboard' || view === 'dte') && (!user || user.role !== 'admin')) {
      handleShowAuth('admin');
      return;
    }
    
    // Check if cashier view requires cashier authentication
    if (view === 'cashier' && (!user || user.role !== 'cashier')) {
      handleShowAuth('cashier');
      return;
    }
    
    // Check if payment requires customer authentication
    if (view === 'payment' && !user) {
      handleShowAuth('customer');
      return;
    }

    // Check if invoices view requires authentication
    if (view === 'invoices' && !user) {
      handleShowAuth('customer');
      return;
    }
    
    // Si vamos a la vista de factura, guardar la vista actual como fuente
    if (view === 'invoice') {
      setInvoiceSourceView(currentView);
    }
    
    setCurrentView(view);
    localStorage.setItem('currentView', view); // Guardamos la vista en localStorage
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
      status: 'generated',
      ...(user?.role === 'cashier' && {
        cashierName: user.name,
        cashierId: user.id
      })
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
    handleViewChange('invoice');
  };

  const updateInvoiceStatus = (invoiceId: string, status: Invoice['status']) => {
    setInvoices(invoices.map(invoice =>
      invoice.id === invoiceId ? { ...invoice, status } : invoice
    ));
  };

  const sendInvoiceByEmail = async (invoiceId: string, email: string) => {
    // Simulate email sending with XML attachment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update invoice status to sent
    updateInvoiceStatus(invoiceId, 'sent');
    
    // Show success message with more details
    alert(`✅ Factura enviada exitosamente a ${email}\n\n📧 Se ha enviado:\n• Factura en formato PDF\n• Documento XML (DTE)\n• Código QR para verificación\n\nEl cliente recibirá el correo en los próximos minutos.`);
  };

  const generateOfficialPDFContent = (invoice: Invoice) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('es-SV');
    const formattedTime = currentDate.toLocaleTimeString('es-SV');
    
    return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
/F2 6 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 4500
>>
stream
BT
/F2 14 Tf
50 750 Td
(DOCUMENTO TRIBUTARIO ELECTRONICO) Tj
0 -20 Td
(FACTURA) Tj
0 -40 Td
/F1 10 Tf
(Ministerio de Hacienda - Republica de El Salvador) Tj
0 -15 Td
(Fecha y Hora de Generacion: ${formattedDate} ${formattedTime}) Tj

% Header Box
50 680 512 60 re
S

% Company Info
/F2 12 Tf
60 720 Td
(ADVENTUREWORKS) Tj
0 -15 Td
/F1 10 Tf
(BikeStore) Tj
0 -15 Td
(NIT: 1234567890123) Tj
0 -15 Td
(NRC: 123456) Tj

% QR Code placeholder
480 690 50 50 re
S
485 715 Td
/F1 8 Tf
(QR CODE) Tj

% Document Info
350 720 Td
/F1 10 Tf
(No. de Control: DTE-01-${invoice.id}) Tj
0 -12 Td
(Codigo de Generacion: ${invoice.id}) Tj
0 -12 Td
(Sello de Recepcion: MH) Tj
0 -12 Td
(Fecha y Hora de Procesamiento:) Tj
0 -10 Td
(${formattedDate} ${formattedTime}) Tj

% Customer Info Section
50 620 512 40 re
S
60 650 Td
/F2 10 Tf
(DATOS DEL RECEPTOR) Tj
0 -15 Td
/F1 9 Tf
(Nombre: ${invoice.customerName}) Tj
200 0 Td
(Documento: ${invoice.customerNIT}) Tj
-200 -12 Td
(Actividad Economica: CONSUMIDOR FINAL) Tj
200 0 Td
(Direccion: SAN SALVADOR) Tj

% Items Table Header
50 560 512 25 re
S
60 575 Td
/F2 9 Tf
(No.) Tj
80 0 Td
(Cantidad) Tj
80 0 Td
(Descripcion) Tj
150 0 Td
(Precio Unit.) Tj
80 0 Td
(Ventas No Suj.) Tj
80 0 Td
(Ventas Exentas) Tj
80 0 Td
(Ventas Gravadas) Tj

% Items
${invoice.items.map((item, index) => {
  const yPos = 550 - (index * 15);
  const total = item.product.price * item.quantity;
  return `
60 ${yPos} Td
/F1 8 Tf
(${index + 1}) Tj
80 0 Td
(${item.quantity}) Tj
80 0 Td
(${item.product.name.substring(0, 20)}) Tj
150 0 Td
($${item.product.price.toFixed(2)}) Tj
80 0 Td
($0.00) Tj
80 0 Td
($0.00) Tj
80 0 Td
($${total.toFixed(2)}) Tj
-480 0 Td`;
}).join('')}

% Totals Section
50 400 512 80 re
S
60 470 Td
/F2 10 Tf
(RESUMEN) Tj
0 -15 Td
/F1 9 Tf
(Suma de Operaciones: $${invoice.subtotal.toFixed(2)}) Tj
0 -12 Td
(Total de Operaciones Exentas: $0.00) Tj
0 -12 Td
(Total de Operaciones Gravadas: $${invoice.subtotal.toFixed(2)}) Tj
0 -12 Td
(Sub-Total: $${invoice.subtotal.toFixed(2)}) Tj
0 -12 Td
(IVA Percibido (13%): $${invoice.tax.toFixed(2)}) Tj
0 -12 Td
/F2 10 Tf
(TOTAL A PAGAR: $${invoice.total.toFixed(2)}) Tj

% Payment Info
50 300 512 40 re
S
60 330 Td
/F2 10 Tf
(CONDICION DE LA OPERACION) Tj
0 -15 Td
/F1 9 Tf
(Contado) Tj
200 0 Td
(Forma de Pago: Efectivo) Tj
-200 -12 Td
(Monto: $${invoice.total.toFixed(2)}) Tj

% Footer
50 200 512 60 re
S
60 250 Td
/F1 8 Tf
(Valor en Letras: ${numeroALetras(invoice.total)}) Tj
0 -15 Td
(Observaciones: Factura generada electronicamente por BikeStore Pro) Tj
0 -15 Td
(Este documento es una representacion impresa de un DTE) Tj
0 -15 Td
(Para verificar este documento ingrese a: https://admin.factura.gob.sv/consultaPublica) Tj

% Digital Signature
50 100 512 40 re
S
60 130 Td
/F2 9 Tf
(FIRMA ELECTRONICA) Tj
0 -12 Td
/F1 7 Tf
(Sello Digital: MH-DTE-${invoice.id}-${Date.now()}) Tj
0 -10 Td
(Cadena Original: ||1.0|DTE-01|${invoice.id}|${formattedDate}|${invoice.total.toFixed(2)}||) Tj

ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj

xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000004826 00000 n 
0000004904 00000 n 
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
4987
%%EOF`;
  };

  // Función auxiliar para convertir números a letras
  const numeroALetras = (numero: number): string => {
    const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const decenas = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    
    if (numero === 0) return 'CERO DOLARES';
    
    const entero = Math.floor(numero);
    const centavos = Math.round((numero - entero) * 100);
    
    let resultado = '';
    
    if (entero >= 1000) {
      const miles = Math.floor(entero / 1000);
      resultado += numeroALetrasSimple(miles) + ' MIL ';
      const resto = entero % 1000;
      if (resto > 0) {
        resultado += numeroALetrasSimple(resto) + ' ';
      }
    } else {
      resultado += numeroALetrasSimple(entero) + ' ';
    }
    
    resultado += entero === 1 ? 'DOLAR' : 'DOLARES';
    
    if (centavos > 0) {
      resultado += ' CON ' + numeroALetrasSimple(centavos) + ' ' + (centavos === 1 ? 'CENTAVO' : 'CENTAVOS');
    }
    
    return resultado;
  };

  const numeroALetrasSimple = (numero: number): string => {
    if (numero === 0) return '';
    if (numero < 10) return ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'][numero];
    if (numero < 20) {
      return ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'][numero - 10];
    }
    if (numero < 100) {
      const decena = Math.floor(numero / 10);
      const unidad = numero % 10;
      if (numero < 30 && unidad > 0) {
        return 'VEINTI' + numeroALetrasSimple(unidad);
      }
      return decenas[decena] + (unidad > 0 ? ' Y ' + numeroALetrasSimple(unidad) : '');
    }
    if (numero < 1000) {
      const centena = Math.floor(numero / 100);
      const resto = numero % 100;
      const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];
      if (numero === 100) return 'CIEN';
      return centenas[centena] + (resto > 0 ? ' ' + numeroALetrasSimple(resto) : '');
    }
    return numero.toString();
  };

  const handleDownloadPDF = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    const pdfContent = generateOfficialPDFContent(invoice);
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DTE-${invoiceId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadXML = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<dte:GTDocumento xmlns:dte="http://www.mh.gob.sv/dte/fel/0.2.0" Version="0.1">
  <dte:SAT ClaseDocumento="dte">
    <dte:DTE ID="DatosCertificados">
      <dte:DatosEmision ID="DatosEmision">
        <dte:DatosGenerales 
          Tipo="FACT" 
          FechaHoraEmision="${invoice.date}T00:00:00.000-06:00" 
          MonedaOperacion="USD" 
          TipoOperacion="VENTA"
          NumeroDocumento="${invoice.id}"
        />
        <dte:Emisor 
          NITEmisor="1234567890123" 
          NombreEmisor="AdventureWorks BikeStore" 
          CodigoEstablecimiento="1" 
          NombreComercial="BikeStore Pro" 
          AfiliacionIVA="GEN"
          Telefono="+503 2222-3333"
          CorreoEmisor="ventas@bikestorepro.com"
        />
        <dte:Receptor 
          IDReceptor="${invoice.customerNIT}" 
          NombreReceptor="${invoice.customerName}" 
          CorreoReceptor="${invoice.customerEmail}"
        />
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
        <dte:Complementos>
          <dte:Complemento IDComplemento="1" NombreComplemento="FirmaDigital" URIComplemento="#FirmaDigital">
            <dte:FirmaDigital>
              <dte:Certificado>MIIEXjCCA0agAwIBAgIJAKZK4jqvKvKKMA0GCSqGSIb3DQEBCwUAMIGBMQswCQYDVQQGEwJTVjEQMA4GA1UECAwHU2FuU2FsMRAwDgYDVQQHDAdTYW5TYWwxEjAQBgNVBAoMCUJpa2VTdG9yZTEMMAoGA1UECwwDRFRFMQwwCgYDVQQDDANEVEUxHjAcBgkqhkiG9w0BCQEWD2R0ZUBiaWtlc3RvcmUuY29t</dte:Certificado>
              <dte:FechaHoraFirma>${new Date().toISOString()}</dte:FechaHoraFirma>
            </dte:FirmaDigital>
          </dte:Complemento>
        </dte:Complementos>
      </dte:DatosEmision>
      <dte:Certificacion>
        <dte:NITCertificador>1234567890123</dte:NITCertificador>
        <dte:NombreCertificador>AdventureWorks BikeStore</dte:NombreCertificador>
        <dte:NumeroResolucion>RES-001-2024</dte:NumeroResolucion>
        <dte:FechaResolucion>2024-01-01</dte:FechaResolucion>
      </dte:Certificacion>
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

  const handleDownloadDTEJSON = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    const dteJSON = generateDTEJSON(invoice);
    const blob = new Blob([dteJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dte-${invoiceId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBackNavigation = () => {
    // Regresar a la vista desde donde se accedió a la factura
    setCurrentView(invoiceSourceView);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    handleViewChange('invoice');
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
      case 'cashier':
        return user?.role === 'cashier' ? (
          <CashierDashboard
            products={products}
            onAddToCart={addToCart}
            cartItems={cartItems}
            onUpdateCartQuantity={updateCartQuantity}
            onProcessPayment={processPayment}
            onSendInvoiceByEmail={sendInvoiceByEmail}
            user={user}
          />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600">Acceso Denegado</h2>
            <p className="text-gray-500 mt-2">Se requieren permisos de cajera</p>
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
                  onError={(e) => {
                    // Manejar errores de carga de imagen
                    if (product.image) {
                      e.currentTarget.src = 'https://via.placeholder.com/300?text=Imagen+no+disponible';
                    }
                  }}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                  <p className="text-gray-600 text-sm">{product.category}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xl font-bold text-purple-600">${product.price}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product, 1)}
                    disabled={product.stock === 0}
                    className="w-full mt-3 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
            onBack={handleBackNavigation}
            onDownloadPDF={handleDownloadPDF}
            onDownloadXML={handleDownloadXML}
            onDownloadDTEJSON={handleDownloadDTEJSON}
          />
        ) : null;
      case 'invoices':
        return (
          <InvoiceManagement
            invoices={invoices}
            user={user}
            onViewInvoice={handleViewInvoice}
            onDownloadPDF={handleDownloadPDF}
            onDownloadXML={handleDownloadXML}
            onDownloadDTEJSON={handleDownloadDTEJSON}
            onUpdateInvoiceStatus={updateInvoiceStatus}
            onSendInvoiceByEmail={sendInvoiceByEmail}
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
            <h1 className="text-lg font-semibold text-gray-900">AdventureWorks BikeStore</h1>
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