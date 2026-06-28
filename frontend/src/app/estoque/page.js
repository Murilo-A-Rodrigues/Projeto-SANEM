"use client";
import Navigation from "../components/navegation/navegation";
import styles from "./estoque.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { itemService } from "@/itemService";
import { donationService } from "@/donationService";
import { transferService } from "@/transferService";

export default function EstoquePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("estoque");
  const [estoque, setEstoque] = useState([]);
  const [doacoes, setDoacoes] = useState([]);
  const [repasses, setRepasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalStockQuantity, setTotalStockQuantity] = useState(0);

  useEffect(() => {
    carregarTudo();
  }, []);

  const carregarTudo = async () => {
    setLoading(true);
    await Promise.all([
      carregarEstoque(),
      carregarDoacoes(),
      carregarRepasses(),
    ]);
    setLoading(false);
  };

  const carregarEstoque = async () => {
    try {
      const data = await itemService.getAll();
      if (!Array.isArray(data)) {
      setEstoque([]);
      setTotalStockQuantity(0);
      return;
      }
      const comQuantidade = data.map((it) => ({
        id: it.id,
        tipo: it.name || it.nome || "-",
        categoria: typeof it.category === "object" && it.category?.name
          ? it.category.name
          : it.categoria || it.category || "-",
        tamanho: typeof it.size === "object" && it.size?.name
          ? it.size.name
          : it.tamanho || it.size || "-",
        quantidade: it.quantity ?? it.quantidade ?? 0,
      }));
      setEstoque(comQuantidade.filter((it) => (it.quantidade || 0) > 0));
      const total = comQuantidade.reduce((sum, item) => sum + (item.quantidade || 0), 0);
      setTotalStockQuantity(total);
    } catch (e) {
      console.error("Erro ao carregar estoque:", e);
      setEstoque([]);
      setTotalStockQuantity(0);
    }
  };

  const carregarDoacoes = async () => {
    try {
      const data = await donationService.getAll();
      if (!Array.isArray(data)) { setDoacoes([]); return; }
      const items = await itemService.getAll().catch(() => []);
      const lista = data.map((d) => {
        const dataStr = d.date ? new Date(d.date).toLocaleDateString("pt-BR") : "-";
        const itensDoacao = (d.items || []).map((di) => {
          const item = Array.isArray(items) ? items.find((i) => i.id === di.itemId) : null;
          return {
            tipo: item?.name || item?.nome || "-",
            categoria: typeof item?.category === "object" && item.category?.name
              ? item.category.name
              : item?.categoria || item?.category || "-",
            tamanho: typeof item?.size === "object" && item.size?.name
              ? item.size.name
              : item?.tamanho || item?.size || "-",
            quantidade: di.quantity ?? 0,
          };
        });
        return { id: d.id, doadorId: d.giverId, data: dataStr, itens: itensDoacao };
      });
      setDoacoes(lista);
    } catch (e) {
      console.error("Erro ao carregar doações:", e);
      setDoacoes([]);
    }
  };

  const carregarRepasses = async () => {
    try {
      const data = await transferService.getAll();
      if (!Array.isArray(data)) { setRepasses([]); return; }
      const items = await itemService.getAll().catch(() => []);
      const lista = data.map((r) => {
        const dataStr = r.date ? new Date(r.date).toLocaleDateString("pt-BR") : "-";
        const itensRepasse = (r.items || []).map((ri) => {
          const item = Array.isArray(items) ? items.find((i) => i.id === ri.itemId) : null;
          return {
            tipo: item?.name || item?.nome || "-",
            categoria: typeof item?.category === "object" && item.category?.name
              ? item.category.name
              : item?.categoria || item?.category || "-",
            tamanho: typeof item?.size === "object" && item.size?.name
              ? item.size.name
              : item?.tamanho || item?.size || "-",
            quantidade: ri.quantity ?? 0,
          };
        });
        return { id: r.id, beneficiarioId: r.receiverId, data: dataStr, itens: itensRepasse };
      });
      setRepasses(lista);
    } catch (e) {
      console.error("Erro ao carregar repasses:", e);
      setRepasses([]);
    }
  };

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.titulo}>Controle de Estoque</h1>

          <div className={styles.buttonRow}>
            <button className={styles.btnDoacao} onClick={() => router.push("/cadastrodoacao")}>
              + Cadastrar Doação
            </button>
            <button className={styles.btnRepasse} onClick={() => router.push("/cadastrorepasse")}>
              + Cadastrar Repasse
            </button>
          </div>

          {/* Abas */}
          <div className={styles.tabsContainer}>
            <button
              className={`${styles.tab} ${activeTab === "estoque" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("estoque")}
            >
              Itens em Estoque
            </button>
            <button
              className={`${styles.tab} ${activeTab === "doacoes" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("doacoes")}
            >
              Doações Recebidas
            </button>
            <button
              className={`${styles.tab} ${activeTab === "repasses" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("repasses")}
            >
              Repasses Realizados
            </button>
          </div>

          {loading ? (
            <p className={styles.loadingText}>Carregando dados...</p>
          ) : activeTab === "estoque" ? (
            <div className={styles.tableWrapper}>
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Categoria</th>
                    <th>Tamanho</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {estoque.length === 0 ? (
                    <tr><td colSpan={4} className={styles.emptyCell}>Nenhum item em estoque.</td></tr>
                  ) : (
                    estoque.map((item) => (
                      <tr key={item.id}>
                        <td>{item.tipo}</td>
                        <td>{item.categoria}</td>
                        <td>{item.tamanho}</td>
                        <td>{item.quantidade}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === "doacoes" ? (
            <div className={styles.tableWrapper}>
              {doacoes.length === 0 ? (
                <p className={styles.emptyText}>Nenhuma doação registrada.</p>
              ) : (
                doacoes.map((doacao) => (
                  <div key={doacao.id} className={styles.cardGroup}>
                    <div className={styles.cardHeader}>
                      <span><strong>Data:</strong> {doacao.data}</span>
                      <span><strong>Doador ID:</strong> {doacao.doadorId}</span>
                    </div>
                    <table className={styles.tabelaInner}>
                      <thead>
                        <tr>
                          <th>Tipo</th>
                          <th>Categoria</th>
                          <th>Tamanho</th>
                          <th>Quantidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doacao.itens.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.tipo}</td>
                            <td>{item.categoria}</td>
                            <td>{item.tamanho}</td>
                            <td>{item.quantidade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              {repasses.length === 0 ? (
                <p className={styles.emptyText}>Nenhum repasse registrado.</p>
              ) : (
                repasses.map((repasse) => (
                  <div key={repasse.id} className={styles.cardGroup}>
                    <div className={styles.cardHeader}>
                      <span><strong>Data:</strong> {repasse.data}</span>
                      <span><strong>Beneficiário ID:</strong> {repasse.beneficiarioId}</span>
                    </div>
                    <table className={styles.tabelaInner}>
                      <thead>
                        <tr>
                          <th>Tipo</th>
                          <th>Categoria</th>
                          <th>Tamanho</th>
                          <th>Quantidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {repasse.itens.map((item, idx) => (
                          <tr key={item.id || idx}>
                            <td>{item.tipo}</td>
                            <td>{item.categoria}</td>
                            <td>{item.tamanho}</td>
                            <td>{item.quantidade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}