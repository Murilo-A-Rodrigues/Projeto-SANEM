"use client";
import React from "react";
import PieChartBeneficiarios from "./PieChartBeneficiarios";

const ReportView = React.forwardRef(({ data = [] }, ref) => {
  const total = data.reduce((s, d) => s + (d.amount || 0), 0);

  // calcula beneficiários únicos e se retiraram ao menos uma vez
  const receivers = new Map();
  data.forEach((d) => {
    const r = (d.receiver || "—").trim();
    if (!receivers.has(r)) receivers.set(r, { collected: false });
    if (d.collected) receivers.set(r, { collected: true });
  });

  const totalReceivers = receivers.size;
  let collectedCount = 0;
  receivers.forEach((v) => {
    if (v.collected) collectedCount++;
  });
  const notCollectedCount = totalReceivers - collectedCount;

  return (
    <div ref={ref} style={{ background: "#fff", padding: 12, borderRadius: 6 }}>
      <h2>Resumo</h2>
      <p>Total de registros: {data.length} — Soma: R$ {total.toFixed(2)}</p>

      <div style={{ marginBottom: 12 }}>
        <PieChartBeneficiarios collectedCount={collectedCount} notCollectedCount={notCollectedCount} />
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: 6 }}>Data</th>
            <th style={{ border: "1px solid #ddd", padding: 6 }}>Doador</th>
            <th style={{ border: "1px solid #ddd", padding: 6 }}>Beneficiário</th>
            <th style={{ border: "1px solid #ddd", padding: 6 }}>Tipo</th>
            <th style={{ border: "1px solid #ddd", padding: 6 }}>Valor</th>
            <th style={{ border: "1px solid #ddd", padding: 6 }}>Retirado</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid #eee", padding: 6 }}>{d.date || "-"}</td>
              <td style={{ border: "1px solid #eee", padding: 6 }}>{d.donor || "-"}</td>
              <td style={{ border: "1px solid #eee", padding: 6 }}>{d.receiver || "-"}</td>
              <td style={{ border: "1px solid #eee", padding: 6 }}>{d.type || "-"}</td>
              <td style={{ border: "1px solid #eee", padding: 6 }}>
                R$ {(d.amount || 0).toFixed(2)}
              </td>
              <td style={{ border: "1px solid #eee", padding: 6 }}>{d.collected ? "Sim" : "Não"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default ReportView;