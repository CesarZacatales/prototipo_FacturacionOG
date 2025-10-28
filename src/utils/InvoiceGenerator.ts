import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InvoiceItem {
  product: {
    name: string;
    price: number;
  };
  quantity: number;
}

interface InvoiceData {
  tipoDocumento: string;
  customerName: string;
  customerNIT: string;
  customerNRC?: string;
  customerDireccion: string;
  customerTelefono?: string;
  customerEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export const generateInvoicePDF = (data: InvoiceData) => {
  const doc = new jsPDF();

  // 🔹 Encabezado
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("📘 Librería UCA - Factura Electrónica", 14, 20);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Tipo de Documento: ${data.tipoDocumento}`, 14, 30);
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-SV")}`, 150, 30, { align: "right" });

  // 🔹 Información del Cliente
  doc.setFont("helvetica", "bold");
  doc.text("Datos del Cliente", 14, 45);
  doc.setFont("helvetica", "normal");
  const clienteY = 50;
  doc.text(`Nombre / Razón Social: ${data.customerName}`, 14, clienteY);
  doc.text(`NIT: ${data.customerNIT}`, 14, clienteY + 6);
  if (data.customerNRC) doc.text(`NRC: ${data.customerNRC}`, 14, clienteY + 12);
  doc.text(`Dirección: ${data.customerDireccion}`, 14, clienteY + 18);
  if (data.customerTelefono) doc.text(`Teléfono: ${data.customerTelefono}`, 14, clienteY + 24);
  doc.text(`Correo: ${data.customerEmail}`, 14, clienteY + 30);

  // 🔹 Tabla de productos
  autoTable(doc, {
    startY: clienteY + 40,
    head: [["Producto", "Cantidad", "Precio Unitario", "Subtotal"]],
    body: data.items.map((item) => [
      item.product.name,
      item.quantity.toString(),
      `$${item.product.price.toFixed(2)}`,
      `$${(item.product.price * item.quantity).toFixed(2)}`,
    ]),
    headStyles: { fillColor: [104, 33, 122] }, // Morado UCA
    theme: "grid",
  });

  // 🔹 Totales
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text(`Subtotal: $${data.subtotal.toFixed(2)}`, 150, finalY, { align: "right" });
  doc.text(`IVA (13%): $${data.tax.toFixed(2)}`, 150, finalY + 6, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL A PAGAR: $${data.total.toFixed(2)}`, 150, finalY + 12, { align: "right" });

  // 🔹 Pie de página
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text("Gracias por su compra en Librería UCA 📚", 105, 285, { align: "center" });
  doc.text("Documento generado electrónicamente - válido sin firma.", 105, 291, { align: "center" });

  // 🔹 Descargar el PDF
  doc.save(`Factura_${data.customerName.replace(/\s+/g, "_")}.pdf`);
};
