"use client";
import React from "react";

export default function PieChartBeneficiarios({ collectedCount = 0, notCollectedCount = 0, size = 140 }) {
  const total = collectedCount + notCollectedCount;
  const percent = total === 0 ? 0 : Math.round((collectedCount / total) * 100);
  const radius = 40;
  const stroke = 18;
  const circumference = 2 * Math.PI * radius;
  const collectedStroke = total === 0 ? 0 : (collectedCount / total) * circumference;

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
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
          <text x="0" y="-4" textAnchor="middle" fontSize="14" fontWeight="600" fill="#333">
            {percent}%
          </text>
          <text x="0" y="12" textAnchor="middle" fontSize="10" fill="#666">
            retiraram
          </text>
        </g>
      </svg>

      <div style={{ fontSize: 14 }}>
        <div style={{ marginBottom: 6 }}>
          <span style={{ display: "inline-block", width: 12, height: 12, background: "#4caf50", marginRight: 8 }}></span>
          Retiraram: <strong>{collectedCount}</strong>
        </div>
        <div>
          <span style={{ display: "inline-block", width: 12, height: 12, background: "#ddd", marginRight: 8 }}></span>
          Não retiraram: <strong>{notCollectedCount}</strong>
        </div>
        <div style={{ marginTop: 8, color: "#666", fontSize: 12 }}>Total beneficiários: {total}</div>
      </div>
    </div>
  );
}