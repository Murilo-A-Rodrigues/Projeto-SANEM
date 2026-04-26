"use client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function fetchDonations(filters = {}) {
  // cria query simples
  const params = new URLSearchParams();
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.donor) params.set("donor", filters.donor);
  if (filters.receiver) params.set("receiver", filters.receiver);

  const url = `/api/donations?${params.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const json = await res.json();
    return Array.isArray(json) ? json : json.data || [];
  } catch (err) {
    console.warn("fetchDonations falhou, usando mock. Erro:", err.message);
    // Mock leve para permitir testar frontend sem backend
    return [
      { date: "2025-01-10", donor: "Maria Silva", receiver: "Lar Acolher", type: "Dinheiro", amount: 150.0, collected: true },
      { date: "2025-01-12", donor: "João Souza", receiver: "Banco de Alimentos", type: "Alimentos", amount: 0, collected: true },
      { date: "2025-02-03", donor: "Clara Lima", receiver: "Lar Acolher", type: "Roupas", amount: 0, collected: false },
      { date: "2025-02-10", donor: "Pedro Alves", receiver: "Casa Esperança", type: "Dinheiro", amount: 200.0, collected: false },
      // ...adicione mais itens de teste se quiser...
    ];
  }
}

export async function exportElementToPdf(element, filename = "relatorio.pdf") {
  if (!element) {
    alert("Elemento de relatório não encontrado.");
    return;
  }
  try {
    // aumenta DPI para melhor qualidade
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      // multi-page
      let heightLeft = imgHeight;
      let position = 0;
      const pageCanvasHeight = (pageHeight * imgProps.width) / imgWidth;

      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        if (heightLeft > 0) pdf.addPage();
        position -= pageHeight;
      }
    }

    pdf.save(filename);
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    alert("Falha ao gerar PDF: " + err.message);
  }
}