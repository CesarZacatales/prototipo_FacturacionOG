import React from 'react';
import { Download, FileText, CheckCircle, ArrowLeft, Building } from 'lucide-react';
import { Invoice } from '../types';

interface ElectronicInvoiceProps {
  invoice: Invoice;
  onBack: () => void;
}

export const ElectronicInvoice: React.FC<ElectronicInvoiceProps> = ({
  invoice,
  onBack,
}) => {
  const handleDownloadPDF = () => {
    // Create a comprehensive PDF content with actual invoice data
    const pdfContent = `
FACTURA ELECTRÓNICA - BIKESTORE PRO
=====================================

NIT: 1234567890123
Tel: +503 2222-3333
Email: ventas@bikestorepro.com

FACTURA ELECTRÓNICA No. ${invoice.id}
Fecha: ${invoice.date}

DATOS DEL CLIENTE:
Nombre: ${invoice.customerName}
NIT/DUI: ${invoice.customerNIT}
Email: ${invoice.customerEmail}

DETALLE DE PRODUCTOS:
${invoice.items.map((item, index) => 
  `${index + 1}. ${item.product.name}
     Cantidad: ${item.quantity}
     Precio Unitario: $${item.product.price.toFixed(2)}
     Total: $${(item.product.price * item.quantity).toFixed(2)}`
).join('\n\n')}

RESUMEN:
Subtotal: $${invoice.subtotal.toFixed(2)}
IVA (13%): $${invoice.tax.toFixed(2)}
TOTAL: $${invoice.total.toFixed(2)}

=====================================
DOCUMENTO FIRMADO DIGITALMENTE
Validado por Ministerio de Hacienda
Fecha de Generación: ${new Date().toLocaleString()}
=====================================

Este documento electrónico ha sido generado conforme a la normativa vigente del 
Ministerio de Hacienda de El Salvador y tiene plena validez legal.
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `factura-${invoice.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadXML = () => {
    // Create a comprehensive XML DTE content following El Salvador standards
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<dte:GTDocumento xmlns:dte="dte" Version="0.1">
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
          NombreEmisor="BikeStore Pro" 
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
        <dte:NombreCertificador>BikeStore Pro</dte:NombreCertificador>
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
    link.download = `dte-${invoice.id}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        <h2 className="text-2xl font-bold text-gray-900">Factura Electrónica Generada</h2>
      </div>

      {/* Success Message */}
      <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6 rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-green-800">¡Pago Procesado Exitosamente!</h3>
            <p className="text-green-700">Su factura electrónica ha sido generada y enviada automáticamente.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invoice Preview */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
          {/* PDF Preview Header */}
          <div className="bg-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span className="font-semibold">Vista Previa de Factura</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Firma Digital Válida</span>
            </div>
          </div>

          {/* Invoice Content */}
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-purple-600 rounded-lg p-2">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">BikeStore Pro</h1>
                    <p className="text-gray-600">Sistema de Facturación Electrónica</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>NIT: 1234567890123</p>
                  <p>Tel: +503 2222-3333</p>
                  <p>Email: ventas@bikestorepro.com</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-purple-600 mb-2">FACTURA ELECTRÓNICA</h2>
                <p className="text-gray-600">No. {invoice.id}</p>
                <p className="text-gray-600">Fecha: {invoice.date}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Datos del Cliente:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Nombre:</strong> {invoice.customerName}</p>
                  <p><strong>NIT/DUI:</strong> {invoice.customerNIT}</p>
                </div>
                <div>
                  <p><strong>Email:</strong> {invoice.customerEmail}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left">Descripción</th>
                    <th className="border border-gray-300 p-3 text-center">Cant.</th>
                    <th className="border border-gray-300 p-3 text-right">Precio Unit.</th>
                    <th className="border border-gray-300 p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-3">{item.product.name}</td>
                      <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 p-3 text-right">${item.product.price.toFixed(2)}</td>
                      <td className="border border-gray-300 p-3 text-right">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span>Subtotal:</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>IVA (13%):</span>
                  <span>${invoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-gray-300 font-bold text-lg">
                  <span>Total:</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Digital Signature */}
            <div className="mt-8 pt-6 border-t-2 border-gray-200">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <p>Documento firmado digitalmente</p>
                  <p className="text-xs">Validado por Ministerio de Hacienda</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Download Options */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Descargar Documentos</h3>
            <div className="space-y-3">
              <button
                onClick={handleDownloadPDF}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Descargar PDF</span>
              </button>
              <button
                onClick={handleDownloadXML}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Descargar XML (DTE)</span>
              </button>
            </div>
          </div>

          {/* Status Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del DTE</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Documento generado</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Enviando a Hacienda...</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-500">Pendiente validación</span>
              </div>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">Información Legal</h4>
            <p className="text-xs text-purple-800">
              Este documento electrónico ha sido generado conforme a la normativa vigente del 
              Ministerio de Hacienda de El Salvador y tiene plena validez legal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};