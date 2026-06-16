"use client";
import { useState } from "react";
import styles from "./relatorios.module.css";

export default function ReportFilters({ onApply, initial = {} }) {
  const [from, setFrom] = useState(initial.from || "");
  const [to, setTo] = useState(initial.to || "");
  const [donor, setDonor] = useState(initial.donor || "");
  const [receiver, setReceiver] = useState(initial.receiver || "");

  function apply() {
    onApply({ from, to, donor, receiver });
  }

  return (
    <div className={styles.filtersSection}>
      <div className={styles.filtersGrid}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Data Inicial</label>
          <input 
            type="date" 
            className={styles.filterInput}
            value={from} 
            onChange={(e) => setFrom(e.target.value)} 
          />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Data Final</label>
          <input 
            type="date" 
            className={styles.filterInput}
            value={to} 
            onChange={(e) => setTo(e.target.value)} 
          />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Doador</label>
          <input 
            className={styles.filterInput}
            value={donor} 
            onChange={(e) => setDonor(e.target.value)} 
            placeholder="Nome do doador" 
          />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Beneficiário</label>
          <input 
            className={styles.filterInput}
            value={receiver} 
            onChange={(e) => setReceiver(e.target.value)} 
            placeholder="Nome do beneficiário" 
          />
        </div>
      </div>
      <button className={styles.filterButton} onClick={apply}>
        Aplicar Filtros
      </button>
    </div>
  );
}