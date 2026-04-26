"use client";

import { useEffect, useState } from "react";
import Navigation from "../components/navegation/navegation";
import MenuBar from "../components/menubar/menubar";
import UserCard from "../components/UserCard";

export default function UsuariosPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(""); // estado do filtro

  // Busca todos os usuários na API fake
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Erro ao buscar usuários:", err));
  }, []);

  // Filtra usuários com base na busca
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

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
            justifyContent: "flex-start",
            minHeight: "80vh",
            padding: "20px",
            width: "100%",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <h2 style={{ color: "#0070f3", marginBottom: "20px" }}>Usuários</h2>

          {/* Input de busca */}
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              maxWidth: "400px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          />

          {/* Renderiza os usuários filtrados */}
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => <UserCard key={u.id} user={u} />)
          ) : (
            <p>Nenhum usuário encontrado.</p>
          )}
        </main>
      </div>
    </>
  );
}
