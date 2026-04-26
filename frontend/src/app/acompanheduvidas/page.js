"use client";
import { useState } from "react";
import Navigation from '../components/navegation/navegation';
import MenuBar from '../components/menubar/menubar';

// Exemplos de dúvidas do usuário
const minhasDuvidas = [
  {
    texto: "Como alterar minha senha?",
    status: "respondida",
    resposta: "Para alterar sua senha, acesse o menu de configurações e clique em 'Alterar senha'."
  },
  {
    texto: "Como excluir minha conta?",
    status: "em análise",
    resposta: ""
  }
];

export default function AcompanheDuvidasPage() {
  const [abertas, setAbertas] = useState(Array(minhasDuvidas.length).fill(false));
  const [editando, setEditando] = useState(Array(minhasDuvidas.length).fill(false));
  const [novasDuvidas, setNovasDuvidas] = useState(minhasDuvidas.map(d => d.texto));
  const [respostas, setRespostas] = useState(Array(minhasDuvidas.length).fill(""));

  const toggleAberta = idx => {
    setAbertas(prev => prev.map((aberta, i) => (i === idx ? !aberta : aberta)));
  };

  const handleEditar = idx => {
    setEditando(prev => prev.map((ed, i) => (i === idx ? !ed : ed)));
  };

  const handleSalvarEdicao = idx => {
    minhasDuvidas[idx].texto = novasDuvidas[idx];
    setEditando(prev => prev.map((ed, i) => (i === idx ? false : ed)));
  };

  const handleResposta = idx => {
    // Aqui você pode implementar o envio da resposta para o backend, se desejar
    alert("Resposta enviada: " + respostas[idx]);
    setRespostas(prev => prev.map((r, i) => (i === idx ? "" : r)));
  };

  return (
    <>
      <Navigation />
      <div style={{ minHeight: '100vh', background: '#fff', marginLeft: 220 }}>
        <MenuBar />
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '80vh', paddingTop: 40 }}>
          <h1 style={{ marginBottom: 32, textAlign: 'center', width: '100%' }}>Acompanhe suas dúvidas</h1>
          <div style={{ width: '100%', maxWidth: 500 }}>
            <ul style={{ width: '100%', padding: 0, listStyle: 'none', margin: 0 }}>
              {minhasDuvidas.map((d, i) => (
                <li key={i} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #eee', padding: '16px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    {editando[i] && d.status === "em análise" ? (
                      <input
                        value={novasDuvidas[i]}
                        onChange={e => setNovasDuvidas(prev => prev.map((v, idx) => idx === i ? e.target.value : v))}
                        style={{
                          flex: 1,
                          fontSize: 16,
                          padding: 6,
                          borderRadius: 4,
                          border: '1px solid #ccc',
                          marginRight: 8
                        }}
                      />
                    ) : (
                      <button
                        onClick={() => toggleAberta(i)}
                        style={{
                          background: 'none',
                          border: 'none',
                          textAlign: 'left',
                          flex: 1,
                          color: '#222',
                          fontSize: 16,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {d.texto}
                      </button>
                    )}
                    <span style={{
                      color: d.status === "respondida" ? "#0a0" : "#f5a623",
                      fontWeight: 500,
                      fontSize: 14,
                      textTransform: 'capitalize',
                      marginLeft: 12
                    }}>
                      {d.status}
                    </span>
                    {d.status === "em análise" && (
                      <button
                        onClick={() => handleEditar(i)}
                        style={{
                          marginLeft: 12,
                          background: '#f5faff',
                          border: '1px solid #0070f3',
                          color: '#0070f3',
                          borderRadius: 4,
                          padding: '4px 10px',
                          fontSize: 14,
                          cursor: 'pointer'
                        }}
                      >
                        {editando[i] ? "Salvar" : "Editar"}
                      </button>
                    )}
                  </div>
                  {editando[i] && d.status === "em análise" && (
                    <button
                      onClick={() => handleSalvarEdicao(i)}
                      style={{
                        alignSelf: 'flex-end',
                        marginTop: 6,
                        background: '#0070f3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        padding: '4px 14px',
                        fontSize: 14,
                        cursor: 'pointer'
                      }}
                    >
                      Salvar edição
                    </button>
                  )}
                  {abertas[i] && d.status === "respondida" && (
                    <div style={{ marginTop: 12, background: "#f6f6f6", borderRadius: 6, padding: 14 }}>
                      <div style={{ marginBottom: 10, color: "#222" }}>
                        <strong>Resposta:</strong> {d.resposta}
                      </div>
                      <div style={{ marginBottom: 8, color: "#555", fontWeight: 500 }}>
                        Ainda com dúvidas?
                      </div>
                      <textarea
                        placeholder="continue a conversa"
                        value={respostas[i]}
                        onChange={e => setRespostas(prev => prev.map((v, idx) => idx === i ? e.target.value : v))}
                        style={{
                          width: '100%',
                          minHeight: 50,
                          borderRadius: 6,
                          border: '1px solid #ccc',
                          padding: 8,
                          fontSize: 15,
                          marginBottom: 8
                        }}
                      />
                      <button
                        onClick={() => handleResposta(i)}
                        style={{
                          background: '#0070f3',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          padding: '6px 18px',
                          fontSize: 15,
                          cursor: 'pointer'
                        }}
                      >
                        Responder
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </>
  );
}