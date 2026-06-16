"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReportFilters from "./ReportFilters";
import ReportView from "./ReportView";
import { fetchDonations, exportElementToPdf } from "./reportClient";
import styles from "./relatorios.module.css";

export default function RelatoriosPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({ from: "", to: "", donor: "", receiver: "" });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const reportRef = useRef();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchDonations(filters);
        setData(res);
      } catch (err) {
        setError(err.message || "Erro ao carregar doações");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filters]);

  return (
    <main className={styles.mainContainer}>
      <div className={styles.headerContainer}>
        <button 
          className={styles.backButton}
          onClick={() => router.back()}
        >
          ← Voltar
        </button>
        <h1 className={styles.title}>Relatórios de Doações</h1>
      </div>
      <ReportFilters onApply={(f) => setFilters(f)} initial={filters} />
      <div className={styles.actionButtons}>
        <button 
          className={styles.actionButton}
          onClick={() => exportElementToPdf(reportRef.current, "relatorio-doacoes.pdf")}
        >
          Exportar para PDF
        </button>
      </div>
      {loading && <p className={styles.loadingMessage}>Carregando relatório...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div ref={reportRef}>
        <ReportView data={data} />
      </div>
    </main>
  );
}