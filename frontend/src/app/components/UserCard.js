"use client";

export default function UserCard({ user }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "10px",
        background: "#f9f9f9",
      }}
    >
      <h3 style={{ margin: "0 0 5px 0" }}>{user.name}</h3>
      <p style={{ margin: 0, color: "#555" }}>{user.email}</p>
    </div>
  );
}
