"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../components/navegation/navegation";
import MenuBar from "../components/menubar/menubar";
import { voluntaryService } from "../../voluntaryService";

export default function VoluntariosPage() {
  const [voluntarios, setVoluntarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadVoluntarios();
  }, []);

  const loadVoluntarios = async () => {
    try {
      setLoading(true);
      console.log("Buscando voluntários na API...");
      const data = await voluntaryService.getAll();
      console.log("Dados recebidos:", data);
      setVoluntarios(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar voluntários:", err);
      setError(err.message || "Erro ao carregar voluntários");
    } finally {
      setLoading(false);
    }
  };

  const filteredVoluntarios = voluntarios.filter((v) => {
    const searchLower = search.toLowerCase();
    return (
      v.nomeCompleto?.toLowerCase().includes(searchLower) ||
      v.nome?.toLowerCase().includes(searchLower) ||
      v.email?.toLowerCase().includes(searchLower) ||
      v.cpf?.includes(search) ||
      v.telefoneCelular?.includes(search) ||
      v.telefone?.includes(search)
    );
  });

  const handleEdit = (voluntario) => {
    router.push(`/cadastrovoluntario?id=${voluntario.id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este voluntário?")) return;
    
    try {
      await voluntaryService.delete(id);
      loadVoluntarios();
      alert("Voluntário excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir voluntário:", err);
      alert("Erro ao excluir voluntário: " + (err.message || "Erro desconhecido"));
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
            Voluntários Cadastrados
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
          {loading && <p>Carregando voluntários...</p>}

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
          {!loading && !error && filteredVoluntarios.length === 0 && (
            <p style={{ color: "#6b7280" }}>
              Nenhum voluntário encontrado.
            </p>
          )}

          {/* Volunteers List */}
          {!loading && !error && filteredVoluntarios.length > 0 && (
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
                  {filteredVoluntarios.map((voluntario) => (
                    <tr
                      key={voluntario.id}
                      style={{ borderBottom: "1px solid #e5e7eb" }}
                    >
                      <td style={{ padding: "10px" }}>
                        {voluntario.nomeCompleto || voluntario.nome || voluntario.name || "—"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {voluntario.email || "—"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {voluntario.telefoneCelular || voluntario.telefone || voluntario.phone || "—"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {voluntario.cpf || "—"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <button
                          onClick={() => handleDelete(voluntario.id)}
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
                          onClick={() => handleEdit(voluntario)}
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