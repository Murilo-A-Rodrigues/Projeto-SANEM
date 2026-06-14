"use client";
import { useState } from "react";

export default function ReportFilters({ onApply, initial = {} }) {
  const [from, setFrom] = useState(initial.from || "");
  const [to, setTo] = useState(initial.to || "");
  const [donor, setDonor] = useState(initial.donor || "");
  const [receiver, setReceiver] = useState(initial.receiver || "");

  function apply() {
    onApply({ from, to, donor, receiver });
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <label>
        De: <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
      </label>
      <label>
        Até: <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </label>
      <label>
        Doador: <input value={donor} onChange={(e) => setDonor(e.target.value)} placeholder="nome" />
      </label>
      <label>
        Beneficiário: <input value={receiver} onChange={(e) => setReceiver(e.target.value)} placeholder="nome" />
      </label>
      <button onClick={apply}>Aplicar</button>
    </div>
  );
}