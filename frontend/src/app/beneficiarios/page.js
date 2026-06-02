"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../components/navegation/navegation";
import MenuBar from "../components/menubar/menubar";
import { receiverService } from "../../receiverService";

export default function BeneficiariosPage() {
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadBeneficiarios();
  }, []);

  const loadBeneficiarios = async () => {
    try {
      setLoading(true);
      const data = await receiverService.getAll();
      setBeneficiarios(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar beneficiários:", err);
      setError(err.message || "Erro ao carregar beneficiários");
    } finally {
      setLoading(false);
    }
  };

  const filteredBeneficiarios = beneficiarios.filter((b) => {
    const searchLower = search.toLowerCase();
    return (
      b.nomeCompleto?.toLowerCase().includes(searchLower) ||
      b.nome?.toLowerCase().includes(searchLower) ||
      b.email?.toLowerCase().includes(searchLower) ||
      b.cpfCrnm?.includes(search) ||
      b.cpf?.includes(search) ||
      b.telefoneCelular?.includes(search) ||
      b.telefone?.includes(search) ||
      b.nif?.includes(search)
    );
  });

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este beneficiário?")) return;

    try {
      await receiverService.delete(id);
      loadBeneficiarios();
      alert("Beneficiário excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir beneficiário:", err);
      const errorMsg = err.response?.data?.message || err.message || "Erro desconhecido";
      alert("Erro ao excluir beneficiário: " + errorMsg);
    }
  };

  const handleEdit = (beneficiario) => {
    // Navega para a página de cadastro com o ID do beneficiário para edição
    router.push(`/cadastrobeneficiario?id=${beneficiario.id}`);
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
            Beneficiários Cadastrados
          </h2>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Buscar por nome, email, CPF, NIF ou telefone..."
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
          {loading && <p>Carregando beneficiários...</p>}

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
          {!loading && !error && filteredBeneficiarios.length === 0 && (
            <p style={{ color: "#6b7280" }}>
              Nenhum beneficiário encontrado.
            </p>
          )}

          {/* Beneficiaries List */}
          {!loading && !error && filteredBeneficiarios.length > 0 && (
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
                    <th style={{ padding: "10px" }}>NIF</th>
                    <th style={{ padding: "10px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBeneficiarios.map((beneficiario) => (
                    <tr
                      key={beneficiario.id}
                      style={{ borderBottom: "1px solid #e5e7eb" }}
                    >
                      <td style={{ padding: "10px" }}>
                        {beneficiario.nomeCompleto || beneficiario.nome || beneficiario.name || "—"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {beneficiario.email || "—"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {beneficiario.telefoneCelular || beneficiario.telefone || beneficiario.phone || "—"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {beneficiario.cpfCrnm || beneficiario.cpf || "—"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {beneficiario.nif || "—"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <button
                          onClick={() => handleDelete(beneficiario.id)}
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
                          onClick={() => handleEdit(beneficiario)}
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