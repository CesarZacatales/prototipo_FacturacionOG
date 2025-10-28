import React from 'react';
import { Download, CheckCircle, ArrowLeft, QrCode } from 'lucide-react';
import { Invoice } from '../types';


interface ElectronicInvoiceProps {
  invoice: Invoice;
  onBack: () => void;
  onDownloadPDF: (invoiceId: string) => void;
  onDownloadXML: (invoiceId: string) => void;
  onDownloadDTEJSON: (invoiceId: string) => void;
}

export const ElectronicInvoice: React.FC<ElectronicInvoiceProps> = ({
  invoice,
  onDownloadPDF,
  onDownloadXML,
  onDownloadDTEJSON,
}) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('es-SV');
  const formattedTime = currentDate.toLocaleTimeString('es-SV');

  return (
    <div className="max-w-4xl mx-auto">

      {/* Success Message */}
      <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6 rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-green-800">¡DTE Generado Exitosamente!</h3>
            <p className="text-green-700">Su documento tributario electrónico ha sido procesado y está listo para descargar.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invoice Preview */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md border">
          {/* Official Header */}
          <div className="bg-gray-100 p-4 border-b">
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900">DOCUMENTO TRIBUTARIO ELECTRÓNICO</h1>
              <h2 className="text-xl font-bold text-gray-900">FACTURA</h2>
              <p className="text-sm text-gray-600">Ministerio de Hacienda - República de El Salvador</p>
              <p className="text-xs text-gray-500">Fecha y Hora de Generación: {formattedDate} {formattedTime}</p>
            </div>
          </div>

          {/* Company and Document Info */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Company Info */}
              <div className="md:col-span-1">
                <div className="border p-4 rounded">
                  <h3 className="font-bold text-lg text-purple-600">ADVENTUREWORKS</h3>
                  <p className="text-sm font-medium">BikeStore</p>
                  <div className="mt-2 text-xs space-y-1">
                    <p><strong>NIT:</strong> 1234567890123</p>
                    <p><strong>NRC:</strong> 123456</p>
                    <p><strong>Actividad:</strong> Venta de Bicicletas</p>
                    <p><strong>Tel:</strong> +503 2222-3333</p>
                    <p><strong>Email:</strong> ventas@adventureworks.com</p>
                  </div>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="md:col-span-1 flex justify-center items-center">
                <div className="border-2 border-dashed border-gray-300 p-4 rounded text-center">
                  <QrCode className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Código QR</p>
                  <p className="text-xs text-gray-500">Verificación MH</p>
                </div>
              </div>

              {/* Document Info */}
              <div className="md:col-span-1">
                <div className="border p-4 rounded">
                  <div className="text-xs space-y-1">
                    <p><strong>No. de Control:</strong></p>
                    <p className="text-purple-600">DTE-01-{invoice.id}</p>
                    <p><strong>Código de Generación:</strong></p>
                    <p className="text-purple-600 break-all">{invoice.id}</p>
                    <p><strong>Sello de Recepción:</strong> MH</p>
                    <p><strong>Fecha y Hora de Procesamiento:</strong></p>
                    <p>{formattedDate} {formattedTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-6 border-b">
            <div className="border p-4 rounded">
              <h3 className="font-bold text-gray-900 mb-3">DATOS DEL RECEPTOR</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Nombre:</strong> {invoice.customerName}</p>
                  <p><strong>Actividad Económica:</strong> CONSUMIDOR FINAL</p>
                </div>
                <div>
                  <p><strong>Documento:</strong> {invoice.customerNIT}</p>
                  <p><strong>Dirección:</strong> SAN SALVADOR</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-6 border-b">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-2 text-left">No.</th>
                    <th className="border border-gray-300 p-2 text-left">Cantidad</th>
                    <th className="border border-gray-300 p-2 text-left">Descripción</th>
                    <th className="border border-gray-300 p-2 text-right">Precio Unit.</th>
                    <th className="border border-gray-300 p-2 text-right">Ventas No Suj.</th>
                    <th className="border border-gray-300 p-2 text-right">Ventas Exentas</th>
                    <th className="border border-gray-300 p-2 text-right">Ventas Gravadas</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{item.quantity}</td>
                      <td className="border border-gray-300 p-2">{item.product.name}</td>
                      <td className="border border-gray-300 p-2 text-right">${item.product.price.toFixed(2)}</td>
                      <td className="border border-gray-300 p-2 text-right">$0.00</td>
                      <td className="border border-gray-300 p-2 text-right">$0.00</td>
                      <td className="border border-gray-300 p-2 text-right">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="p-6 border-b">
            <div className="border p-4 rounded">
              <h3 className="font-bold text-gray-900 mb-3">RESUMEN</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Suma de Operaciones:</span>
                    <span>${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total de Operaciones Exentas:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total de Operaciones Gravadas:</span>
                    <span>${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sub-Total:</span>
                    <span>${invoice.subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>IVA Percibido (13%):</span>
                    <span>${invoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>TOTAL A PAGAR:</span>
                    <span className="text-purple-600">${invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Condition */}
          <div className="p-6 border-b">
            <div className="border p-4 rounded">
              <h3 className="font-bold text-gray-900 mb-3">CONDICIÓN DE LA OPERACIÓN</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Tipo:</strong> Contado</p>
                  <p><strong>Monto:</strong> ${invoice.total.toFixed(2)}</p>
                </div>
                <div>
                  <p><strong>Forma de Pago:</strong> Efectivo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6">
            <div className="border p-4 rounded bg-gray-50">
              <div className="text-xs space-y-2">
                <p><strong>Observaciones:</strong> Factura generada electrónicamente por AdventureWorks BikeStore</p>
                <p>Este documento es una representación impresa de un DTE</p>
                <p>Para verificar este documento ingrese a: https://admin.factura.gob.sv/consultaPublica</p>
                <div className="mt-4 pt-4 border-t">
                  <p className="font-bold">FIRMA ELECTRÓNICA</p>
                  <p>Sello Digital: MH-DTE-{invoice.id}-{Date.now()}</p>
                  <p className="break-all">Cadena Original: ||1.0|DTE-01|{invoice.id}|{formattedDate}|{invoice.total.toFixed(2)}||</p>
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
                onClick={() => onDownloadPDF(invoice.id)}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Descargar PDF</span>
              </button>
              <button
                onClick={() => onDownloadXML(invoice.id)}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Descargar XML (DTE)</span>
              </button>
              <button
                onClick={() => onDownloadDTEJSON(invoice.id)}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Descargar JSON (DTE)</span>
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
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">JSON DTE creado</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Enviado a Hacienda</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Validación completada</span>
              </div>
            </div>
          </div>

          {/* DTE Information */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">Formato DTE Oficial</h4>
            <p className="text-xs text-purple-800">
              Este documento cumple con el formato oficial del Ministerio de Hacienda de El Salvador 
              para Documentos Tributarios Electrónicos (DTE) versión 1.0.
            </p>
          </div>

          {/* Legal Notice */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Información Legal</h4>
            <p className="text-xs text-blue-800">
              Este documento electrónico ha sido generado conforme a la normativa vigente del 
              Ministerio de Hacienda de El Salvador y tiene plena validez legal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};