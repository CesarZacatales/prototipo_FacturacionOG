import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Download, FileText, Search, Filter, Building, Code } from 'lucide-react';
import { DTERecord } from '../types';

interface DTEManagementProps {
  records: DTERecord[];
  onUpdateStatus: (id: string, status: DTERecord['status']) => void;
}

export const DTEManagement: React.FC<DTEManagementProps> = ({
  records,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DTERecord['status'] | 'all'>('all');

  // 🔎 Filtrado
  const filteredRecords = records.filter(record => {
    const matchesSearch =
      record.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 🟢 Helpers de UI
  const getStatusIcon = (status: DTERecord['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: DTERecord['status']) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  const getStatusText = (status: DTERecord['status']) => {
    switch (status) {
      case 'approved':
        return 'Aprobado';
      case 'rejected':
        return 'Rechazado';
      case 'pending':
        return 'Pendiente';
    }
  };

  // 📦 Totales
  const totalDTEs = records.length;
  const approvedDTEs = records.filter(r => r.status === 'approved').length;
  const pendingDTEs = records.filter(r => r.status === 'pending').length;
  const rejectedDTEs = records.filter(r => r.status === 'rejected').length;

  // 🧾 Funciones de descarga
  const handleDownload = (record: DTERecord, type: 'xml' | 'json' | 'pdf') => {
    let content = '';
    let mimeType = '';
    let extension = '';

    switch (type) {
      case 'xml':
        content = `
          <DTE>
            <ID>${record.id}</ID>
            <Cliente>${record.customerName}</Cliente>
            <Monto>${record.amount.toFixed(2)}</Monto>
            <Fecha>${record.date}</Fecha>
            <Estado>${record.status}</Estado>
          </DTE>
        `.trim();
        mimeType = 'application/xml';
        extension = 'xml';
        break;
      case 'json':
        content = JSON.stringify(record, null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;
      case 'pdf':
        // Por ahora simulamos con texto, luego puedes conectarlo a una librería (jspdf o backend)
        content = `DTE PDF SIMULADO\n\nID: ${record.id}\nCliente: ${record.customerName}\nMonto: $${record.amount.toFixed(2)}\nFecha: ${record.date}\nEstado: ${record.status}`;
        mimeType = 'text/plain';
        extension = 'pdf';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${record.id}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-600 rounded-lg p-3">
          <Building className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de DTEs</h2>
          <p className="text-gray-600">Panel de administración - Ministerio de Hacienda</p>
        </div>
      </div>

      {/* Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600">Total DTEs</p>
          <p className="text-3xl font-bold">{totalDTEs}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600">Aprobados</p>
          <p className="text-3xl font-bold text-green-600">{approvedDTEs}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600">Pendientes</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingDTEs}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600">Rechazados</p>
          <p className="text-3xl font-bold text-red-600">{rejectedDTEs}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente o DTE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as DTERecord['status'] | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="approved">Aprobados</option>
              <option value="pending">Pendientes</option>
              <option value="rejected">Rechazados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de DTEs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DTE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">{record.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">{record.customerName}</td>
                  <td className="px-6 py-4 text-sm font-medium">${record.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{record.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(record.status)}
                      <span className={getStatusBadge(record.status)}>
                        {getStatusText(record.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleDownload(record, 'pdf')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Descargar PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(record, 'xml')}
                        className="text-green-600 hover:text-green-900"
                        title="Descargar XML"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(record, 'json')}
                        className="text-gray-600 hover:text-gray-900"
                        title="Descargar JSON"
                      >
                        <Code className="h-4 w-4" />
                      </button>

                      {record.status === 'pending' && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => onUpdateStatus(record.id, 'approved')}
                            className="text-green-600 hover:text-green-900"
                            title="Aprobar"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onUpdateStatus(record.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                            title="Rechazar"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
        <div className="flex items-center">
          <Building className="h-6 w-6 text-blue-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800">
              Ministerio de Hacienda - El Salvador
            </h3>
            <p className="text-blue-700 text-sm mt-1">
              Sistema integrado de validación automática de Documentos Tributarios Electrónicos (DTE).
              Todos los documentos procesados cumplen con la normativa fiscal vigente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
