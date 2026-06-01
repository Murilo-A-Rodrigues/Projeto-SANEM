"use client";
import Navigation from "../components/navegation/navegation";
import MenuBar from "../components/menubar/menubar";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    people: 0,
    donations: 0,
    receivers: 0,
    items: 0,
    volunteers: 0,
    givers: 0,
  });

  const [recentActions, setRecentActions] = useState([]);
  const [chartData, setChartData] = useState([]);

  function getItemQuantity(item) {
    return (
      Number(
        item?.quantity ??
          item?.quantidade ??
          item?.qtd ??
          item?.qtde ??
          item?.unidades ??
          0
      ) || 0
    );
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const voluntarios = JSON.parse(
        localStorage.getItem("mockVoluntarios") || "[]"
      );
      const beneficiarios = JSON.parse(
        localStorage.getItem("mockBeneficiarios") || "[]"
      );
      const doadores = JSON.parse(
        localStorage.getItem("mockDoadores") || "[]"
      );
      const estoque = JSON.parse(
        localStorage.getItem("mockEstoque") || "[]"
      );

      let doacoesRaw = [];
      try {
        doacoesRaw = JSON.parse(
          localStorage.getItem("mockDoacoes") || "[]"
        );
      } catch {
        doacoesRaw = [];
      }

      const peopleCount =
        voluntarios.length + beneficiarios.length + doadores.length;

      const itemsUnits = (estoque || []).reduce(
        (acc, item) => acc + getItemQuantity(item),
        0
      );

      setStats({
        people: peopleCount,
        donations: doacoesRaw.length,
        receivers: beneficiarios.length,
        volunteers: voluntarios.length,
        givers: doadores.length,
        items: itemsUnits,
      });

      const doacoesNormalizadas = (doacoesRaw || [])
        .map((d) => ({
          user: d.user ?? d.nomeDoador ?? "Doador",
          action: d.action ?? "Doação registrada",
          date: normalizeDate(d),
        }))
        .sort((a, b) => {
          const da = a.date ? new Date(a.date).getTime() : 0;
          const db = b.date ? new Date(b.date).getTime() : 0;
          return db - da;
        });

      setRecentActions(doacoesNormalizadas.slice(0, 3));

      const donationsForChart = doacoesNormalizadas.map((d) => ({
        date: d.date,
      }));
      setChartData(groupByMonth(donationsForChart, 12)); // 👈 12 meses
    } catch (err) {
      console.error("Erro ao ler dados do localStorage:", err);
    }
  }, []);

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
          <h2 style={{ color: "#0070f3", marginBottom: "30px" }}>Dashboard</h2>

          {/* Cards */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "40px",
            }}
          >
            <Card title="Pessoas" value={stats.people} color="#0070f3" />
            <Card title="Doações" value={stats.donations} color="#10b981" />
            <Card title="Receptores" value={stats.receivers} color="#f59e0b" />
            <Card title="Voluntários" value={stats.volunteers} color="#ec4899" />
            <Card title="Doadores" value={stats.givers} color="#3b82f6" />
            <Card
              title="Unidades em Estoque"
              value={stats.items}
              color="#6366f1"
            />
          </div>

          {/* Gráfico */}
          <div
            style={{
              background: "#f9fafb",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              width: "100%",
              maxWidth: "800px",
              marginBottom: "40px",
            }}
          >
            <h3 style={{ marginBottom: "10px", color: "#374151" }}>
              Gráfico de Doações (últimos 12 meses)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="doacoes" fill="#0070f3" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Últimas ações */}
          <div
            style={{
              background: "#f9fafb",
              borderRadius: "12px",
              padding: "20px",
              width: "100%",
              maxWidth: "800px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginBottom: "15px", color: "#374151" }}>
              Últimas Ações
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    borderBottom: "2px solid #e5e7eb",
                  }}
                >
                  <th style={{ padding: "10px" }}>Usuário</th>
                  <th style={{ padding: "10px" }}>Ação</th>
                  <th style={{ padding: "10px" }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {recentActions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      style={{ padding: "10px", color: "#6b7280" }}
                    >
                      Sem registros recentes.
                    </td>
                  </tr>
                ) : (
                  recentActions.map((a, index) => (
                    <tr
                      key={index}
                      style={{ borderBottom: "1px solid #e5e7eb" }}
                    >
                      <td style={{ padding: "10px" }}>{a.user ?? "—"}</td>
                      <td style={{ padding: "10px" }}>{a.action ?? "—"}</td>
                      <td style={{ padding: "10px" }}>{a.date ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}

function normalizeDate(d) {
  const raw =
    d?.date ??
    d?.data ??
    d?.createdAt ??
    d?.created_at ??
    null;

  if (!raw) return null;
  const dt = new Date(raw);
  if (isNaN(dt.getTime())) return null;
  return dt.toISOString();
}

function groupByMonth(donations, monthsBack = 4) {
  const fmt = new Intl.DateTimeFormat("pt-BR", { month: "short" });
  const now = new Date();
  const buckets = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.push({ key, label: capitalize(fmt.format(d)), count: 0 });
  }

  (donations ?? []).forEach((don) => {
    if (!don?.date) return;
    const dt = new Date(d.date);
    if (isNaN(dt.getTime())) return;
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
    const b = buckets.find((x) => x.key === key);
    if (b) b.count += 1;
  });

  return buckets.map((b) => ({ mes: b.label, doacoes: b.count }));
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function Card({ title, value, color }) {
  return (
    <div
      style={{
        background: color,
        color: "#fff",
        borderRadius: "12px",
        padding: "20px 30px",
        minWidth: "200px",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
    >
      <h3 style={{ color: "#fff", fontWeight: "600", marginBottom: "8px" }}>
        {title}
      </h3>
      <p style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
        {value}
      </p>
    </div>
  );
}
