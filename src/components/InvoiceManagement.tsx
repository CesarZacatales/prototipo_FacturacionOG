import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Eye, 
  Calendar,
  DollarSign,
  CheckCircle,
  Send,
  Mail
} from 'lucide-react';
import { Invoice, User } from '../types';

interface InvoiceManagementProps {
  invoices: Invoice[];
  user: User | null;
  onViewInvoice: (invoice: Invoice) => void;
  onDownloadPDF: (invoiceId: string) => void;
  onDownloadXML: (invoiceId: string) => void;
  onDownloadDTEJSON: (invoiceId: string) => void;
  onUpdateInvoiceStatus: (invoiceId: string, status: Invoice['status']) => void;
  onSendInvoiceByEmail: (invoiceId: string, email: string) => void;
}

export const InvoiceManagement: React.FC<InvoiceManagementProps> = ({
  invoices,
  user,
  onViewInvoice,
  onDownloadPDF,
  onDownloadXML,
  onDownloadDTEJSON,
  onUpdateInvoiceStatus,
  onSendInvoiceByEmail,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Invoice['status'] | 'all'>('all');
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  // Filter invoices based on user role
  const userInvoices = user?.role === 'admin' 
    ? invoices 
    : user?.role === 'cashier'
    ? invoices.filter(invoice => invoice.cashierId === user.id)
    : invoices.filter(invoice => invoice.customerEmail === user?.email);

  const filteredInvoices = userInvoices.filter(invoice => {
    const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'sent':
        return <Mail className="h-5 w-5 text-blue-600" />;
      case 'generated':
        return <FileText className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'paid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'sent':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'generated':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  const getStatusText = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'Pagada';
      case 'sent':
        return 'Enviada';
      case 'generated':
        return 'Generada';
    }
  };

  const handleSendEmail = async (invoice: Invoice) => {
    setSendingEmail(invoice.id);
    try {
      await onSendInvoiceByEmail(invoice.id, invoice.customerEmail);
    } finally {
      setSendingEmail(null);
    }
  };

  const totalInvoices = filteredInvoices.length;
  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidInvoices = filteredInvoices.filter(i => i.status === 'paid').length;

  const getTitle = () => {
    switch (user?.role) {
      case 'admin':
        return 'Gestión de Facturas';
      case 'cashier':
        return 'Mis Ventas';
      default:
        return 'Mis Facturas';
    }
  };

  const getSubtitle = () => {
    switch (user?.role) {
      case 'admin':
        return 'Panel de administración de facturas electrónicas';
      case 'cashier':
        return 'Historial de facturas generadas por ti';
      default:
        return 'Historial de tus facturas electrónicas';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-purple-600 rounded-lg p-3">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
          <p className="text-gray-600">{getSubtitle()}</p>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Facturas</p>
              <p className="text-3xl font-bold text-gray-900">{totalInvoices}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monto Total</p>
              <p className="text-3xl font-bold text-green-600">${totalAmount.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pagadas</p>
              <p className="text-3xl font-bold text-purple-600">{paidInvoices}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente o factura..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Invoice['status'] | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">Todos los estados</option>
                <option value="generated">Generadas</option>
                <option value="sent">Enviadas</option>
                <option value="paid">Pagadas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Factura
                </th>
                {(user?.role === 'admin' || user?.role === 'cashier') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                )}
                {user?.role === 'admin' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cajera
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-purple-600 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.id}
                      </div>
                    </div>
                  </td>
                  {(user?.role === 'admin' || user?.role === 'cashier') && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.customerName}</div>
                      <div className="text-sm text-gray-500">{invoice.customerEmail}</div>
                    </td>
                  )}
                  {user?.role === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {invoice.cashierName || 'Sistema'}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${invoice.total.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {invoice.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(invoice.status)}
                      <span className={getStatusBadge(invoice.status)}>
                        {getStatusText(invoice.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewInvoice(invoice)}
                        className="text-purple-600 hover:text-purple-900 flex items-center space-x-1"
                        title="Ver Factura"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDownloadPDF(invoice.id)}
                        className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                        title="Descargar PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDownloadXML(invoice.id)}
                        className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                        title="Descargar XML (DTE)"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDownloadDTEJSON(invoice.id)}
                        className="text-purple-600 hover:text-purple-900 flex items-center space-x-1"
                        title="Descargar JSON (DTE)"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      {(user?.role === 'admin' || user?.role === 'cashier') && invoice.status === 'generated' && (
                        <button
                          onClick={() => handleSendEmail(invoice)}
                          disabled={sendingEmail === invoice.id}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1 disabled:opacity-50"
                          title="Enviar por Email"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      {user?.role === 'admin' && (
                        <div className="flex space-x-1">
                          {invoice.status !== 'paid' && (
                            <button
                              onClick={() => onUpdateInvoiceStatus(invoice.id, 'paid')}
                              className="text-green-600 hover:text-green-900"
                              title="Marcar como Pagada"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay facturas</h3>
            <p className="text-gray-500">
              {user?.role === 'admin' 
                ? 'No se han generado facturas aún' 
                : user?.role === 'cashier'
                ? 'No has generado facturas aún'
                : 'No tienes facturas generadas'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};