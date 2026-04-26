"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";


export default function Login() {
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const senha = form[1].value;
    if (senha !== "1234") {
      setError("Usuário ou senha incorretos.");
    } else {
      alert("Login realizado com sucesso!");
      window.location.href = "/home";
    }
  }

  return (
    <>
      <div className={styles.page}>
        <div className={styles.loginBox}>
          <div className={styles.logoContainer}>
            <Image src="/logo-sanem.svg" alt="Logo SANEM" width={120} height={120} className={styles.logo} />
          </div>
          <h2 className={styles.loginTitle}>Login</h2>
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <input type="text" placeholder="Usuário" className={styles.input} />
            <input type="password" placeholder="Senha" className={styles.input} />
            <button type="submit" className={styles.button}>Login</button>
          </form>
          {error && <div className={styles.errorMsg}>{error}</div>}
          <a href="#" className={styles.forgot}>Esqueci minha senha</a>
        </div>
      </div>
    </>
  );
}
