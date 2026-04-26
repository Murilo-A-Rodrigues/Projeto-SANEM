"use client";

import { useState } from "react";
import Navigation from "../components/navegation/navegation";
import MenuBar from "../components/menubar/menubar";

export default function ConfiguracoesPage() {
  const [nome, setNome] = useState("Seu Nome Atual");
  const [descricao, setDescricao] = useState("Sua descrição atual");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  function handleSaveProfile() {
    console.log("Salvar nome + descrição", { nome, descricao });
    // Chamar API
  }

  function handleChangePassword() {
    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    console.log("Alterar senha", { senhaAtual, novaSenha });
    // Chamar API
  }

  function handleDeleteAccount() {
    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível!")) {
      console.log("Conta excluída");
      // Chamar API de exclusão
    }
  }

  return (
    <>
      <Navigation />

      <div style={{ minHeight: "100vh", background: "#fff", marginLeft: 220 }}>
        <MenuBar />

        <main
          style={{
            maxWidth: 700,
            margin: "40px auto",
            display: "flex",
            flexDirection: "column",
            gap: 40,
            padding: "0 20px",
          }}
        >

          {/* ============================== */}
          {/*   SEÇÃO: EDITAR PERFIL         */}
          {/* ============================== */}
          <section
            style={{
              padding: 20,
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fafafa",
            }}
          >
            <h2 style={{ marginBottom: 20 }}>Editar Perfil</h2>

            <label style={{ fontWeight: "bold" }}>Nome:</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 20,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />

            <label style={{ fontWeight: "bold" }}>Descrição:</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 20,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />

            <button
              onClick={handleSaveProfile}
              style={{
                padding: "10px 20px",
                background: "#1a73e8",
                color: "#fff",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Salvar Alterações
            </button>
          </section>

          {/* ============================== */}
          {/*   SEÇÃO: ALTERAR SENHA         */}
          {/* ============================== */}
          <section
            style={{
              padding: 20,
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fafafa",
            }}
          >
            <h2 style={{ marginBottom: 20 }}>Alterar Senha</h2>

            <label style={{ fontWeight: "bold" }}>Senha Atual:</label>
            <input
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 20,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />

            <label style={{ fontWeight: "bold" }}>Nova Senha:</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 20,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />

            <label style={{ fontWeight: "bold" }}>Confirmar Nova Senha:</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginBottom: 20,
              }}
            />

            <button
              onClick={handleChangePassword}
              style={{
                padding: "10px 20px",
                background: "#1a73e8",
                color: "#fff",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Atualizar Senha
            </button>
          </section>

          {/* ============================== */}
          {/*   SEÇÃO: EXCLUIR CONTA         */}
          {/* ============================== */}
          <section
            style={{
              padding: 20,
              border: "1px solid #f5b5b5",
              borderRadius: 8,
              background: "#ffecec",
            }}
          >
            <h2 style={{ color: "#d93025" }}>Excluir Conta</h2>
            <p style={{ marginBottom: 20 }}>
              Esta ação é permanente e não poderá ser desfeita.
            </p>

            <button
              onClick={handleDeleteAccount}
              style={{
                padding: "10px 20px",
                background: "#d93025",
                color: "#fff",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Excluir Conta
            </button>
          </section>
        </main>
      </div>
    </>
  );
}