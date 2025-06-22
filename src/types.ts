export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Invoice {
  id: string;
  customerName: string;
  customerNIT: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  date: string;
  status: 'generated' | 'sent' | 'paid';
  cashierName?: string;
  cashierId?: string;
}

export interface DTERecord {
  id: string;
  customerName: string;
  amount: number;
  status: 'approved' | 'rejected' | 'pending';
  date: string;
  xmlUrl: string;
  pdfUrl: string;
}

export interface PaymentData {
  customerName: string;
  customerNIT: string;
  customerEmail: string;
  paymentMethod: 'card' | 'transfer';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  accountNumber?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer' | 'cashier';
  nit?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Tipos para el formato JSON DTE oficial de El Salvador
export interface DTEIdentificacion {
  version: number;
  ambiente: "00" | "01";
  tipoDte: "01";
  numeroControl: string;
  codigoGeneracion: string;
  tipoModelo: 1 | 2;
  tipoOperacion: 1 | 2;
  tipoContingencia: null | 1 | 2 | 3 | 4 | 5;
  motivoContin: string | null;
  fecEmi: string;
  horEmi: string;
  tipoMoneda: "USD";
}

export interface DTEDireccion {
  departamento: string;
  municipio: string;
  complemento: string;
}

export interface DTEEmisor {
  nit: string;
  nrc: string;
  nombre: string;
  codActividad: string;
  descActividad: string;
  nombreComercial: string | null;
  tipoEstablecimiento: "01" | "02" | "04" | "07" | "20";
  direccion: DTEDireccion;
  telefono: string;
  correo: string;
  codEstableMH: string | null;
  codEstable: string | null;
  codPuntoVentaMH: string | null;
  codPuntoVenta: string | null;
}

export interface DTEReceptor {
  tipoDocumento: null | "36" | "13" | "02" | "03" | "37";
  numDocumento: string | null;
  nrc: string | null;
  nombre: string | null;
  codActividad: string | null;
  descActividad: string | null;
  direccion: DTEDireccion | null;
  telefono: string | null;
  correo: string | null;
}

export interface DTECuerpoDocumento {
  numItem: number;
  tipoItem: 1 | 2 | 3 | 4;
  numeroDocumento: string | null;
  cantidad: number;
  codigo: string | null;
  codTributo: string | null;
  uniMedida: number;
  descripcion: string;
  precioUni: number;
  montoDescu: number;
  ventaNoSuj: number;
  ventaExenta: number;
  ventaGravada: number;
  tributos: string[] | null;
  psv: number;
  noGravado: number;
  ivaItem: number;
}

export interface DTETributo {
  codigo: string;
  descripcion: string;
  valor: number;
}

export interface DTEPago {
  codigo: string;
  montoPago: number;
  referencia: string | null;
  plazo: string | null;
  periodo: number | null;
}

export interface DTEResumen {
  totalNoSuj: number;
  totalExenta: number;
  totalGravada: number;
  subTotalVentas: number;
  descuNoSuj: number;
  descuExenta: number;
  descuGravada: number;
  porcentajeDescuento: number;
  totalDescu: number;
  tributos: DTETributo[] | null;
  subTotal: number;
  ivaRete1: number;
  reteRenta: number;
  montoTotalOperacion: number;
  totalNoGravado: number;
  totalPagar: number;
  totalLetras: string;
  totalIva: number;
  saldoFavor: number;
  condicionOperacion: 1 | 2 | 3;
  pagos: DTEPago[] | null;
  numPagoElectronico: string | null;
}

export interface DTEExtension {
  nombEntrega: string | null;
  docuEntrega: string | null;
  nombRecibe: string | null;
  docuRecibe: string | null;
  observaciones: string | null;
  placaVehiculo: string | null;
}

export interface DTEOficial {
  identificacion: DTEIdentificacion;
  documentoRelacionado: any[] | null;
  emisor: DTEEmisor;
  receptor: DTEReceptor | null;
  otrosDocumentos: any[] | null;
  ventaTercero: any | null;
  cuerpoDocumento: DTECuerpoDocumento[];
  resumen: DTEResumen;
  extension: DTEExtension | null;
  apendice: any[] | null;
}