"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../components/navegation/navegation";

const STORAGE_DOACOES = "mockDoacoes";
const STORAGE_REPASSES = "mockRepasses";
const STORAGE_ESTOQUE = "mockEstoque";

export default function DoacoesPage() {
  const router = useRouter();
  const [doacoes, setDoacoes] = useState([]);
  const [repasses, setRepasses] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [activeTab, setActiveTab] = useState("doacoes");

  const hasNotification = false;

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedDoacoes = JSON.parse(
        localStorage.getItem(STORAGE_DOACOES) || "[]"
      );
      if (Array.isArray(storedDoacoes)) setDoacoes(storedDoacoes);

      const storedRepasses = JSON.parse(
        localStorage.getItem(STORAGE_REPASSES) || "[]"
      );
      if (Array.isArray(storedRepasses)) setRepasses(storedRepasses);

      const storedEstoque = JSON.parse(
        localStorage.getItem(STORAGE_ESTOQUE) || "[]"
      );
      if (Array.isArray(storedEstoque)) setEstoque(storedEstoque);
    } catch (e) {
      console.error("Erro ao carregar dados do localStorage:", e);
    }
  }, []);

  function handleDeleteDoacao(id) {
    const novaLista = doacoes.filter((d) => d.id !== id);
    setDoacoes(novaLista);
    localStorage.setItem(STORAGE_DOACOES, JSON.stringify(novaLista));
  }

  function handleDeleteRepasse(id) {
    const novaLista = repasses.filter((r) => r.id !== id);
    setRepasses(novaLista);
    localStorage.setItem(STORAGE_REPASSES, JSON.stringify(novaLista));
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("pt-BR");
  }

  return (
    <>
      <Navigation />
      <div style={{ minHeight: "100vh", background: "#fff", marginLeft: 220 }}>
        <main
          style={{
            padding: "40px",
            maxWidth: "960px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#1f2933",
                margin: 0,
              }}
            >
              Doações e Repasses
            </h1>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => router.push("/cadastrodoacao")}
                style={{
                  background: "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 20px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.95rem",
                }}
              >
                + Nova Doação
              </button>
              <button
                onClick={() => router.push("/cadastrorepasse")}
                style={{
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 20px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.95rem",
                }}
              >
                + Novo Repasse
              </button>
            </div>
          </div>

          {/* Abas */}
          <div
            style={{
              display: "flex",
              gap: 0,
              marginBottom: "24px",
              borderBottom: "2px solid #e5e7eb",
            }}
          >
            <button
              onClick={() => setActiveTab("doacoes")}
              style={{
                padding: "10px 24px",
                background: activeTab === "doacoes" ? "#10b981" : "transparent",
                color: activeTab === "doacoes" ? "#fff" : "#374151",
                border: "none",
                borderRadius: "8px 8px 0 0",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.95rem",
                transition: "all 0.2s",
              }}
            >
              Doações Recebidas
            </button>
            <button
              onClick={() => setActiveTab("repasses")}
              style={{
                padding: "10px 24px",
                background: activeTab === "repasses" ? "#3b82f6" : "transparent",
                color: activeTab === "repasses" ? "#fff" : "#374151",
                border: "none",
                borderRadius: "8px 8px 0 0",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.95rem",
                transition: "all 0.2s",
              }}
            >
              Repasses Realizados
            </button>
            <button
              onClick={() => setActiveTab("estoque")}
              style={{
                padding: "10px 24px",
                background: activeTab === "estoque" ? "#f59e0b" : "transparent",
                color: activeTab === "estoque" ? "#fff" : "#374151",
                border: "none",
                borderRadius: "8px 8px 0 0",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.95rem",
                transition: "all 0.2s",
              }}
            >
              Itens em Estoque
            </button>
          </div>

          {/* Conteúdo - Doações */}
          {activeTab === "doacoes" && (
            <section
              style={{
                background: "#f9fafb",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#374151",
                }}
              >
                Doações registradas
              </h2>

              {doacoes.length === 0 ? (
                <p style={{ color: "#6b7280" }}>
                  Nenhuma doação registrada ainda.
                </p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.95rem",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          textAlign: "left",
                          borderBottom: "2px solid #e5e7eb",
                        }}
                      >
                        <th style={{ padding: "8px" }}>Doador</th>
                        <th style={{ padding: "8px" }}>Tipo</th>
                        <th style={{ padding: "8px" }}>Categoria</th>
                        <th style={{ padding: "8px" }}>Tamanho</th>
                        <th style={{ padding: "8px" }}>Qtd.</th>
                        <th style={{ padding: "8px" }}>Data</th>
                        <th style={{ padding: "8px" }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doacoes
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )
                        .map((d) => (
                          <tr
                            key={d.id}
                            style={{ borderBottom: "1px solid #e5e7eb" }}
                          >
                            <td style={{ padding: "8px" }}>{d.user}</td>
                            <td style={{ padding: "8px" }}>
                              {d.tipo || d.action || "-"}
                            </td>
                            <td style={{ padding: "8px" }}>
                              {d.categoria || "-"}
                            </td>
                            <td style={{ padding: "8px" }}>
                              {d.tamanho || "-"}
                            </td>
                            <td style={{ padding: "8px" }}>
                              {d.quantidade ?? "-"}
                            </td>
                            <td style={{ padding: "8px" }}>
                              {formatDate(d.date)}
                            </td>
                            <td style={{ padding: "8px" }}>
                              <button
                                onClick={() => handleDeleteDoacao(d.id)}
                                style={{
                                  background: "#ef4444",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: 6,
                                  padding: "4px 10px",
                                  cursor: "pointer",
                                  fontSize: "0.8rem",
                                }}
                              >
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* Conteúdo - Estoque */}
          {activeTab === "estoque" && (
            <section
              style={{
                background: "#f9fafb",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#374151",
                }}
              >
                Itens em estoque
              </h2>

              {estoque.length === 0 ? (
                <p style={{ color: "#6b7280" }}>
                  Nenhum item no estoque.
                </p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.95rem",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          textAlign: "left",
                          borderBottom: "2px solid #e5e7eb",
                        }}
                      >
                        <th style={{ padding: "8px" }}>ID</th>
                        <th style={{ padding: "8px" }}>Tipo</th>
                        <th style={{ padding: "8px" }}>Categoria</th>
                        <th style={{ padding: "8px" }}>Tamanho</th>
                        <th style={{ padding: "8px" }}>Quantidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estoque
                        .filter((item) => (item.quantidade || 0) > 0)
                        .sort((a, b) => (a.id || 0) - (b.id || 0))
                        .map((item) => (
                          <tr
                            key={item.id}
                            style={{ borderBottom: "1px solid #e5e7eb" }}
                          >
                            <td style={{ padding: "8px" }}>{item.id}</td>
                            <td style={{ padding: "8px" }}>{item.nome || "-"}</td>
                            <td style={{ padding: "8px" }}>{item.categoria || "-"}</td>
                            <td style={{ padding: "8px" }}>{item.tamanho || "-"}</td>
                            <td style={{ padding: "8px" }}>{item.quantidade ?? 0}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* Conteúdo - Repasses */}
          {activeTab === "repasses" && (
            <section
              style={{
                background: "#f9fafb",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#374151",
                }}
              >
                Repasses realizados
              </h2>

              {repasses.length === 0 ? (
                <p style={{ color: "#6b7280" }}>
                  Nenhum repasse registrado ainda.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {repasses
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.data).getTime() -
                        new Date(a.data).getTime()
                    )
                    .map((r) => (
                      <div
                        key={r.id}
                        style={{
                          background: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "10px",
                          padding: "16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "12px",
                          }}
                        >
                          <div>
                            <strong style={{ color: "#1f2933" }}>
                              Beneficiário:
                            </strong>{" "}
                            {r.beneficiario}
                            <span style={{ color: "#6b7280", marginLeft: "12px" }}>
                              {formatDate(r.data)}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteRepasse(r.id)}
                            style={{
                              background: "#ef4444",
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              padding: "4px 10px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            Excluir
                          </button>
                        </div>
                        {r.itens && r.itens.length > 0 && (
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              fontSize: "0.85rem",
                            }}
                          >
                            <thead>
                              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                                <th style={{ padding: "6px 8px", textAlign: "left" }}>Item</th>
                                <th style={{ padding: "6px 8px", textAlign: "left" }}>Categoria</th>
                                <th style={{ padding: "6px 8px", textAlign: "left" }}>Tamanho</th>
                                <th style={{ padding: "6px 8px", textAlign: "left" }}>Qtd.</th>
                              </tr>
                            </thead>
                            <tbody>
                              {r.itens.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                  <td style={{ padding: "6px 8px" }}>{item.nome}</td>
                                  <td style={{ padding: "6px 8px" }}>{item.categoria || "-"}</td>
                                  <td style={{ padding: "6px 8px" }}>{item.tamanho || "-"}</td>
                                  <td style={{ padding: "6px 8px" }}>{item.quantidade}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </>
  );
}