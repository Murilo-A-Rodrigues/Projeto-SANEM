"use client";
import React from "react";
import PieChartBeneficiarios from "./PieChartBeneficiarios";
import styles from "./relatorios.module.css";

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
    <div ref={ref}>
      <div className={styles.summarySection}>
        <h2 className={styles.summaryTitle}>Resumo Executivo</h2>
        <p className={styles.summaryStats}>
          Total de registros: <strong>{data.length}</strong> | Soma: <strong>R$ {total.toFixed(2)}</strong>
        </p>

        <div className={styles.chartContainer}>
          <PieChartBeneficiarios 
            collectedCount={collectedCount} 
            notCollectedCount={notCollectedCount}
            size={180}
          />
        </div>
      </div>

      <div className={styles.tableSection}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Doador</th>
              <th>Beneficiário</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Retirado</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td>{d.date || "-"}</td>
                <td>{d.donor || "-"}</td>
                <td>{d.receiver || "-"}</td>
                <td>{d.type || "-"}</td>
                <td>
                  <strong>R$ {(d.amount || 0).toFixed(2)}</strong>
                </td>
                <td>
                  <span className={d.collected ? styles.collectedYes : styles.collectedNo}>
                    {d.collected ? "Sim" : "Não"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default ReportView;