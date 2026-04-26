"use client";

import { useEffect, useState } from "react";
import Navigation from "../components/navegation/navegation";
import MenuBar from "../components/menubar/menubar";

const STORAGE_DOACOES = "mockDoacoes";
const STORAGE_ESTOQUE = "mockEstoque";

export default function DoacoesPage() {
  const [doacoes, setDoacoes] = useState([]);
  const [estoque, setEstoque] = useState([]);

  const [form, setForm] = useState({
    nomeDoador: "",
    tipo: "",
    data: "",
    produtoId: "",
    quantidade: "",
  });

  const hasNotification = false;

  // Carrega doações e estoque do localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedDoacoes = JSON.parse(
        localStorage.getItem(STORAGE_DOACOES) || "[]"
      );
      if (Array.isArray(storedDoacoes)) setDoacoes(storedDoacoes);

      const storedEstoque = JSON.parse(
        localStorage.getItem(STORAGE_ESTOQUE) || "[]"
      );
      if (Array.isArray(storedEstoque)) setEstoque(storedEstoque);
    } catch (e) {
      console.error("Erro ao carregar dados do localStorage:", e);
    }
  }, []);

  function salvarDoacoesStorage(lista) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_DOACOES, JSON.stringify(lista));
  }

  function salvarEstoqueStorage(lista) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_ESTOQUE, JSON.stringify(lista));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const produtoId = Number(form.produtoId);
    const qtd = Number(form.quantidade);

    if (!produtoId) {
      alert("Selecione um produto do estoque.");
      return;
    }
    if (!qtd || qtd <= 0) {
      alert("Informe uma quantidade válida.");
      return;
    }

    const produto = estoque.find((p) => p.id === produtoId);
    if (!produto) {
      alert("Produto não encontrado no estoque.");
      return;
    }

    if ((produto.quantidade ?? 0) < qtd) {
      alert(
        `Quantidade maior que o estoque disponível (${produto.quantidade}).`
      );
      return;
    }

    // Data ISO
    const hoje = new Date();
    const dataISO = form.data
      ? new Date(form.data + "T00:00:00").toISOString()
      : hoje.toISOString();

    const novaDoacao = {
      id: Date.now(),
      user: form.nomeDoador || "Doador",
      action:
        form.tipo?.trim() !== ""
          ? form.tipo
          : `Doação de ${qtd}x ${produto.nome}`,
      date: dataISO,
      produtoId: produto.id,
      produtoNome: produto.nome,
      quantidade: qtd,
    };

    // Atualiza lista de doações
    const novaListaDoacoes = [...doacoes, novaDoacao];
    setDoacoes(novaListaDoacoes);
    salvarDoacoesStorage(novaListaDoacoes);

    // Atualiza estoque (subtrai)
    const novoEstoque = estoque.map((p) =>
      p.id === produto.id
        ? { ...p, quantidade: (p.quantidade ?? 0) - qtd }
        : p
    );
    setEstoque(novoEstoque);
    salvarEstoqueStorage(novoEstoque);

    // Limpa formulário
    setForm({
      nomeDoador: "",
      tipo: "",
      data: "",
      produtoId: "",
      quantidade: "",
    });
  }

  function handleDelete(id) {
    const doacao = doacoes.find((d) => d.id === id);

    // Remove doação
    const novaLista = doacoes.filter((d) => d.id !== id);
    setDoacoes(novaLista);
    salvarDoacoesStorage(novaLista);

    // Opcional: devolve ao estoque o que foi doado
    if (doacao?.produtoId && doacao?.quantidade) {
      const novoEstoque = estoque.map((p) =>
        p.id === doacao.produtoId
          ? {
              ...p,
              quantidade: (p.quantidade ?? 0) + Number(doacao.quantidade),
            }
          : p
      );
      setEstoque(novoEstoque);
      salvarEstoqueStorage(novoEstoque);
    }
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
        <MenuBar hasNotification={hasNotification} />
        <main
          style={{
            padding: "40px",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#1f2933",
              marginBottom: "24px",
            }}
          >
            Registro de Doações
          </h1>

          {/* Formulário */}
          <section
            style={{
              background: "#f9fafb",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              marginBottom: "32px",
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
              Nova doação
            </h2>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <label style={{ display: "flex", flexDirection: "column" }}>
                Nome do doador
                <input
                  name="nomeDoador"
                  value={form.nomeDoador}
                  onChange={handleChange}
                  required
                  style={{
                    marginTop: 4,
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                  }}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column" }}>
                Tipo / descrição
                <input
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  placeholder="Roupas, brinquedos, alimentos..."
                  style={{
                    marginTop: 4,
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                  }}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column" }}>
                Data da doação
                <input
                  type="date"
                  name="data"
                  value={form.data}
                  onChange={handleChange}
                  style={{
                    marginTop: 4,
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                  }}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column" }}>
                Produto doado
                <select
                  name="produtoId"
                  value={form.produtoId}
                  onChange={handleChange}
                  required
                  style={{
                    marginTop: 4,
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                  }}
                >
                  <option value="">Selecione um produto</option>
                  {estoque.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.quantidade} em estoque)
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: "flex", flexDirection: "column" }}>
                Quantidade
                <input
                  type="number"
                  min={1}
                  name="quantidade"
                  value={form.quantidade}
                  onChange={handleChange}
                  required
                  style={{
                    marginTop: 4,
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                  }}
                />
              </label>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="submit"
                  style={{
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 20px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Salvar doação
                </button>
              </div>
            </form>
          </section>

          {/* Lista de doações */}
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
                    <th style={{ padding: "8px" }}>Descrição</th>
                    <th style={{ padding: "8px" }}>Produto</th>
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
                        <td style={{ padding: "8px" }}>{d.action}</td>
                        <td style={{ padding: "8px" }}>
                          {d.produtoNome ?? "-"}
                        </td>
                        <td style={{ padding: "8px" }}>
                          {d.quantidade ?? "-"}
                        </td>
                        <td style={{ padding: "8px" }}>
                          {formatDate(d.date)}
                        </td>
                        <td style={{ padding: "8px" }}>
                          <button
                            onClick={() => handleDelete(d.id)}
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
            )}
          </section>
        </main>
      </div>
    </>
  );
}
