"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../components/navegation/navegation";
import MenuBar from "../components/menubar/menubar";
import { giverService } from "../../giverService";

export default function DoadoresPage() {
  const [doadores, setDoadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadDoadores();
  }, []);

  const loadDoadores = async () => {
    try {
      setLoading(true);
      const data = await giverService.getAll();
      setDoadores(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar doadores:", err);
      setError(err.message || "Erro ao carregar doadores");
    } finally {
      setLoading(false);
    }
  };

  const filteredDoadores = doadores.filter((d) => {
    const searchLower = search.toLowerCase();
    return (
      d.nomeCompleto?.toLowerCase().includes(searchLower) ||
      d.nome?.toLowerCase().includes(searchLower) ||
      d.email?.toLowerCase().includes(searchLower) ||
      d.cpf?.includes(search) ||
      d.telefoneCelular?.includes(search) ||
      d.telefone?.includes(search)
    );
  });

  const handleEdit = (doador) => {
    router.push(`/cadastrodoador?id=${doador.id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este doador?")) return;
    
    try {
      await giverService.delete(id);
      loadDoadores();
      alert("Doador excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir doador:", err);
      alert("Erro ao excluir doador: " + (err.message || "Erro desconhecido"));
    }
  };

  return (
    <>
      <Navigation />
      <div style={{ minHeight: "100vh", background: "#fff", marginLeft: 220 }}>
        <MenuBar />
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px",
          }}
        >
          <h2 style={{ color: "#0070f3", marginBottom: "30px" }}>
            Doadores Cadastrados
          </h2>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Buscar por nome, email, CPF ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              maxWidth: "500px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          />

          {/* Loading State */}
          {loading && <p>Carregando doadores...</p>}

          {/* Error State */}
          {error && (
            <div
              style={{
                background: "#fee2e2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "20px",
                width: "100%",
                maxWidth: "500px",
              }}
            >
              {error}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && filteredDoadores.length === 0 && (
            <p style={{ color: "#6b7280" }}>
              Nenhum doador encontrado.
            </p>
          )}

          {/* Donors List */}
          {!loading && !error && filteredDoadores.length > 0 && (
            <div
              style={{
                width: "100%",
                maxWidth: "800px",
                background: "#f9fafb",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      textAlign: "left",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    <th style={{ padding: "10px" }}>Nome</th>
                    <th style={{ padding: "10px" }}>Email</th>
                    <th style={{ padding: "10px" }}>Telefone</th>
                    <th style={{ padding: "10px" }}>CPF</th>
                    <th style={{ padding: "10px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoadores.map((doador) => (
                    <tr
                      key={doador.id}
                      style={{ borderBottom: "1px solid #e5e7eb" }}
                    >
                      <td style={{ padding: "10px" }}>
                        {doador.nomeCompleto || doador.nome || doador.name || "—"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {doador.email || "—"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {doador.telefoneCelular || doador.telefone || doador.phone || "—"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {doador.cpf || "—"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <button
                          onClick={() => handleDelete(doador.id)}
                          style={{
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginRight: "8px",
                          }}
                        >
                          Excluir
                        </button>
                        <button
                          onClick={() => handleEdit(doador)}
                          style={{
                            background: "#3b82f6",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
}