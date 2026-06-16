"use client";
import React from "react";

export default function PieChartBeneficiarios({ collectedCount = 0, notCollectedCount = 0, size = 180 }) {
  const total = collectedCount + notCollectedCount;
  const percent = total === 0 ? 0 : Math.round((collectedCount / total) * 100);
  const radius = 50;
  const stroke = 22;
  const circumference = 2 * Math.PI * radius;
  const collectedStroke = total === 0 ? 0 : (collectedCount / total) * circumference;

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Gráfico de beneficiários">
        <g transform="translate(60,60)">
          {/* fundo */}
          <circle r={radius} fill="transparent" stroke="#eee" strokeWidth={stroke} />
          {/* slice collected */}
          <circle
            r={radius}
            fill="transparent"
            stroke="#4caf50"
            strokeWidth={stroke}
            strokeLinecap="butt"
            strokeDasharray={`${collectedStroke} ${circumference}`}
            transform="rotate(-90)"
            style={{ transition: "stroke-dasharray 400ms ease" }}
          />
          {/* centro do texto */}
          <text x="0" y="-4" textAnchor="middle" fontSize="18" fontWeight="700" fill="#333">
            {percent}%
          </text>
          <text x="0" y="14" textAnchor="middle" fontSize="11" fill="#666" fontWeight="500">
            retiraram
          </text>
        </g>
      </svg>

      <div style={{ fontSize: "0.95rem" }}>
        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ 
            display: "inline-block", 
            width: 16, 
            height: 16, 
            background: "#4caf50", 
            borderRadius: 3 
          }}></span>
          <div>
            <div style={{ fontSize: "0.85rem", color: "#666" }}>Retiraram</div>
            <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "#4caf50" }}>{collectedCount}</div>
          </div>
        </div>
        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ 
            display: "inline-block", 
            width: 16, 
            height: 16, 
            background: "#ddd", 
            borderRadius: 3 
          }}></span>
          <div>
            <div style={{ fontSize: "0.85rem", color: "#666" }}>Não retiraram</div>
            <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "#999" }}>{notCollectedCount}</div>
          </div>
        </div>
        <div style={{ 
          marginTop: 16, 
          paddingTop: 12, 
          borderTop: "1px solid #eee", 
          color: "#666", 
          fontSize: "0.9rem",
          fontWeight: "600"
        }}>
          Total: <strong>{total}</strong> beneficiários
        </div>
      </div>
    </div>
  );
}