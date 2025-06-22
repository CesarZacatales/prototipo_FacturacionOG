import { Invoice, DTEOficial, DTEIdentificacion, DTEEmisor, DTEReceptor, DTECuerpoDocumento, DTEResumen, DTEExtension } from '../types';

// Función para generar UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16).toUpperCase();
  });
}

// Función para generar número de control DTE
function generateNumeroControl(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `DTE-01-${random}-${timestamp.substring(3)}`;
}

// Función para convertir números a letras (simplificada)
function numeroALetras(numero: number): string {
  const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenas = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];
  
  if (numero === 0) return 'CERO DÓLARES';
  
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
  
  resultado += entero === 1 ? 'DÓLAR' : 'DÓLARES';
  
  if (centavos > 0) {
    resultado += ' CON ' + numeroALetrasSimple(centavos) + ' ' + (centavos === 1 ? 'CENTAVO' : 'CENTAVOS');
  }
  
  return resultado;
}

function numeroALetrasSimple(numero: number): string {
  if (numero === 0) return '';
  if (numero < 10) return ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'][numero];
  if (numero < 100) {
    const decena = Math.floor(numero / 10);
    const unidad = numero % 10;
    if (numero < 20) {
      return ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'][numero - 10];
    }
    const decenas = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
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
}

export function generateDTEFromInvoice(invoice: Invoice): DTEOficial {
  const now = new Date();
  const fechaEmision = now.toISOString().split('T')[0];
  const horaEmision = now.toTimeString().split(' ')[0];
  
  // Identificación
  const identificacion: DTEIdentificacion = {
    version: 1,
    ambiente: "00", // 00 = Pruebas, 01 = Producción
    tipoDte: "01", // Factura
    numeroControl: generateNumeroControl(),
    codigoGeneracion: generateUUID(),
    tipoModelo: 1, // Facturación Normal
    tipoOperacion: 1, // Transmisión Normal
    tipoContingencia: null,
    motivoContin: null,
    fecEmi: fechaEmision,
    horEmi: horaEmision,
    tipoMoneda: "USD"
  };

  // Emisor (BikeStore Pro)
  const emisor: DTEEmisor = {
    nit: "12345678901234",
    nrc: "123456",
    nombre: "BIKESTORE PRO SOCIEDAD ANONIMA DE CAPITAL VARIABLE",
    codActividad: "47730",
    descActividad: "VENTA AL POR MENOR DE BICICLETAS Y ACCESORIOS",
    nombreComercial: "BikeStore Pro",
    tipoEstablecimiento: "01", // Casa Matriz
    direccion: {
      departamento: "06", // San Salvador
      municipio: "01", // San Salvador
      complemento: "COLONIA ESCALÓN, AVENIDA MASFERRER NORTE, EDIFICIO COMERCIAL BIKESTORE, LOCAL 101"
    },
    telefono: "+503 2222-3333",
    correo: "ventas@bikestorepro.com",
    codEstableMH: "0001",
    codEstable: "0001",
    codPuntoVentaMH: "0001",
    codPuntoVenta: "TIENDA-01"
  };

  // Receptor (Cliente)
  const receptor: DTEReceptor = {
    tipoDocumento: invoice.customerNIT.includes('-') ? "13" : "36", // DUI o NIT
    numDocumento: invoice.customerNIT,
    nrc: null,
    nombre: invoice.customerName,
    codActividad: null,
    descActividad: null,
    direccion: {
      departamento: "06",
      municipio: "01",
      complemento: "SAN SALVADOR, EL SALVADOR"
    },
    telefono: null,
    correo: invoice.customerEmail
  };

  // Cuerpo del documento (productos)
  const cuerpoDocumento: DTECuerpoDocumento[] = invoice.items.map((item, index) => ({
    numItem: index + 1,
    tipoItem: 1, // Bien
    numeroDocumento: null,
    cantidad: item.quantity,
    codigo: item.product.id,
    codTributo: null,
    uniMedida: 59, // Unidad
    descripcion: item.product.name,
    precioUni: item.product.price,
    montoDescu: 0,
    ventaNoSuj: 0,
    ventaExenta: 0,
    ventaGravada: item.product.price * item.quantity,
    tributos: ["20"], // IVA
    psv: 0,
    noGravado: 0,
    ivaItem: (item.product.price * item.quantity) * 0.13
  }));

  // Resumen
  const totalGravada = invoice.subtotal;
  const totalIva = invoice.tax;
  const montoTotal = invoice.total;

  const resumen: DTEResumen = {
    totalNoSuj: 0,
    totalExenta: 0,
    totalGravada: totalGravada,
    subTotalVentas: totalGravada,
    descuNoSuj: 0,
    descuExenta: 0,
    descuGravada: 0,
    porcentajeDescuento: 0,
    totalDescu: 0,
    tributos: [
      {
        codigo: "20",
        descripcion: "Impuesto al Valor Agregado 13%",
        valor: totalIva
      }
    ],
    subTotal: totalGravada,
    ivaRete1: 0,
    reteRenta: 0,
    montoTotalOperacion: montoTotal,
    totalNoGravado: 0,
    totalPagar: montoTotal,
    totalLetras: numeroALetras(montoTotal),
    totalIva: totalIva,
    saldoFavor: 0,
    condicionOperacion: 1, // Contado
    pagos: [
      {
        codigo: "01", // Efectivo
        montoPago: montoTotal,
        referencia: null,
        plazo: null,
        periodo: null
      }
    ],
    numPagoElectronico: null
  };

  // Extensión
  const extension: DTEExtension = {
    nombEntrega: "SISTEMA AUTOMATIZADO BIKESTORE PRO",
    docuEntrega: "12345678-9",
    nombRecibe: invoice.customerName,
    docuRecibe: invoice.customerNIT,
    observaciones: `Factura generada automáticamente por el sistema de BikeStore Pro. Total de artículos: ${invoice.items.length}`,
    placaVehiculo: null
  };

  // DTE completo
  const dte: DTEOficial = {
    identificacion,
    documentoRelacionado: null,
    emisor,
    receptor,
    otrosDocumentos: null,
    ventaTercero: null,
    cuerpoDocumento,
    resumen,
    extension,
    apendice: null
  };

  return dte;
}

export function generateDTEJSON(invoice: Invoice): string {
  const dte = generateDTEFromInvoice(invoice);
  return JSON.stringify(dte, null, 2);
}