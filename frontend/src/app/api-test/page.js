"use client";

import { useEffect, useState } from "react";
import { apiClient } from "../../apiClient";

export default function ApiTestPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testApi();
  }, []);

  const testApi = async () => {
    try {
      setLoading(true);
      console.log("Testing API connection...");
      
      // Test volunteers endpoint
      const response = await apiClient.get('/api/voluntaries');
      console.log("API Response:", response);
      setResult({
        status: response.status,
        data: response.data,
        message: "API connection successful!"
      });
      setError(null);
    } catch (err) {
      console.error("API Test Error:", err);
      setError({
        message: err.message || "Unknown error",
        details: err
      });
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "monospace" }}>
      <h1>API Connection Test</h1>
      <button onClick={testApi} style={{ padding: "10px 20px", marginBottom: "20px" }}>
        Test API Again
      </button>

      {loading && <p>Testing...</p>}

      {result && (
        <div style={{ background: "#d1fae5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
          <h2>Success!</h2>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Message:</strong> {result.message}</p>
          <h3>Data:</h3>
          <pre style={{ background: "#fff", padding: "10px", overflow: "auto" }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div style={{ background: "#fee2e2", padding: "20px", borderRadius: "8px" }}>
          <h2>Error</h2>
          <p><strong>Message:</strong> {error.message}</p>
          <pre style={{ background: "#fff", padding: "10px", overflow: "auto" }}>
            {JSON.stringify(error.details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}