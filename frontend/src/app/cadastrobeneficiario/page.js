"use client";
import React, { useState } from "react";
import MenuBar from "../components/menubar/menubar";
import Navegation from "../components/navegation/navegation";
import { useRouter } from "next/navigation";
import styles from "./cadastrobeneficiario.module.css";

const CadastroBeneficiario = () => {
  const [form, setForm] = useState({
    nomeCompleto: "",
    telefoneCelular: "",
    email: "",
    cpfCrnm: "",
    nif: "",
    endereco: "",
    bairro: "",
    numero: "",
    complemento: "",
    pontoReferencia: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Validação: pelo menos um dos campos (CPF/CRNM ou NIF) deve ser preenchido
    const cpfCrnmLimpo = form.cpfCrnm.replace(/\D/g, "");
    const nifLimpo = form.nif.replace(/\D/g, "");
    
    if (cpfCrnmLimpo.length === 0 && nifLimpo.length === 0) {
      setError("É obrigatório preencher pelo menos um dos campos: CPF/CRNM ou NIF.");
      setLoading(false);
      return;
    }
    
    // Se CPF/CRNM foi preenchido, validar formato (11 dígitos para CPF)
    if (cpfCrnmLimpo.length > 0 && cpfCrnmLimpo.length !== 11) {
      setError("CPF/CRNM deve conter 11 dígitos numéricos.");
      setLoading(false);
      return;
    }

    // Validação de email (regex simples)
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Por favor, insira um e-mail válido.");
      setLoading(false);
      return;
    }

    try {
      const novoBeneficiario = {
        id: Date.now(),
        nomeCompleto: form.nomeCompleto,
        telefoneCelular: form.telefoneCelular,
        email: form.email,
        cpfCrnm: cpfCrnmLimpo,
        nif: nifLimpo,
        endereco: form.endereco,
        bairro: form.bairro,
        numero: form.numero,
        complemento: form.complemento,
        pontoReferencia: form.pontoReferencia
      };
      const beneficiarios = JSON.parse(localStorage.getItem('mockBeneficiarios') || '[]');
      beneficiarios.push(novoBeneficiario);
      localStorage.setItem('mockBeneficiarios', JSON.stringify(beneficiarios));
      setForm({
        nomeCompleto: "",
        telefoneCelular: "",
        email: "",
        cpfCrnm: "",
        nif: "",
        endereco: "",
        bairro: "",
        numero: "",
        complemento: "",
        pontoReferencia: ""
      });
      alert("Beneficiário cadastrado com sucesso!");
      router.push("/sucesso?tipo=beneficiarios");
    } catch (err) {
      setError("Erro ao cadastrar beneficiário");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navegation />
      <div className={styles.formWrapper}> {/* Novo wrapper para centralização e largura */}
        <div className={styles.formContainer}>
          <h1 className={styles.titulo}>Cadastro de Beneficiário</h1>
          <div className={styles.decoracao}></div>
          <form onSubmit={handleSubmit} className={styles.formulario}>
            {/* Linha Nome e E-mail */}
            <div className={styles.formGroup}>
              <label htmlFor="nomeCompleto"><b>Nome completo*</b></label>
              <input 
                id="nomeCompleto"
                name="nomeCompleto" 
                value={form.nomeCompleto} 
                onChange={handleChange} 
                required 
                placeholder="Fulano da Silva" 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email"><b>E-mail*</b></label>
              <input 
                id="email"
                name="email" 
                type="email" // Usar type="email" para validação básica de navegador
                value={form.email} 
                onChange={handleChange} 
                required 
                placeholder="fulano@gmail.com" 
              />
            </div>

            {/* Linha Telefone, CPF/CRNM, NIF */}
            <div className={styles.formGroup}>
              <label htmlFor="telefoneCelular"><b>Telefone*</b></label>
              <input 
                id="telefoneCelular"
                name="telefoneCelular" 
                value={form.telefoneCelular} 
                onChange={handleChange} 
                required 
                placeholder="(45) 9 9988-7766" 
                type="tel" 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cpfCrnm"><b>CPF/CRNM (opcional se NIF for preenchido)</b></label>
              <input 
                id="cpfCrnm"
                name="cpfCrnm" 
                type="text" 
                pattern="[0-9]*" // Permite apenas números
                maxLength={11} 
                value={form.cpfCrnm} 
                onChange={e => { 
                  const onlyNums = e.target.value.replace(/\D/g, ""); 
                  setForm({ ...form, cpfCrnm: onlyNums }); 
                }} 
                placeholder="11122233355" 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="nif"><b>NIF (opcional se CPF/CRNM for preenchido)</b></label>
              <input 
                id="nif"
                name="nif" 
                type="text" 
                pattern="[0-9]*" // Permite apenas números
                value={form.nif} 
                onChange={e => { 
                  const onlyNums = e.target.value.replace(/\D/g, ""); 
                  setForm({ ...form, nif: onlyNums }); 
                }} 
                placeholder="123456789" 
              />
            </div>

            <hr className={styles.separador} />

            {/* Linha Endereço, Número, Complemento */}
            <div className={styles.formGroupFullWidth}> {/* Ocupa a largura total da linha */}
              <label htmlFor="endereco"><b>Endereço*</b></label>
              <input 
                id="endereco"
                name="endereco" 
                value={form.endereco} 
                onChange={handleChange} 
                required 
                placeholder="Rua da Água" 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="numero"><b>Número*</b></label>
              <input 
                id="numero"
                name="numero" 
                type="number" 
                value={form.numero} 
                onChange={handleChange} 
                required 
                placeholder="2015" 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="complemento"><b>Complemento</b></label> {/* Tornando Complemento opcional */}
              <input 
                id="complemento"
                name="complemento" 
                value={form.complemento} 
                onChange={handleChange} 
                placeholder="Ap 307" 
              />
            </div>

            {/* Linha Bairro, Ponto de Referência */}
            <div className={styles.formGroupFullWidth}>
              <label htmlFor="bairro"><b>Bairro*</b></label>
              <input 
                id="bairro"
                name="bairro" 
                value={form.bairro} 
                onChange={handleChange} 
                required 
                placeholder="Centro" 
              />
            </div>
            <div className={styles.formGroupFullWidth}>
              <label htmlFor="pontoReferencia"><b>Ponto de referência</b></label> {/* Tornando Ponto de Referência opcional */}
              <input 
                id="pontoReferencia"
                name="pontoReferencia" 
                value={form.pontoReferencia} 
                onChange={handleChange} 
                placeholder="Em frente ao parque" 
              />
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Beneficiário"}
            </button>
            {error && <div className={styles.errorMessage}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroBeneficiario;