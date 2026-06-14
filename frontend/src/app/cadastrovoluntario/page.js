"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MenuBar from "../components/menubar/menubar";
import Navegation from "../components/navegation/navegation";
import styles from "./cadastrovoluntario.module.css";
import { voluntaryService } from "../../voluntaryService";
import { addressService } from "../../addressService";
import { personService } from "../../personService";

const CadastroVoluntario = () => {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = !!editId;

  const [form, setForm] = useState({
    nomeCompleto: "",
    telefoneCelular: "",
    email: "",
    cpf: "",
    endereco: "",
    bairro: "",
    numero: "",
    complemento: "",
    pontoReferencia: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [originalPerson, setOriginalPerson] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (isEdit && editId) {
      loadVoluntaryForEdit(editId);
    }
  }, [editId]);

  const loadVoluntaryForEdit = async (id) => {
    try {
      setLoading(true);
      const data = await voluntaryService.getById(id);
      const person = data.person || {};
      setOriginalPerson(person);
      setForm({
        nomeCompleto: person.name || "",
        telefoneCelular: person.phone || "",
        email: person.email || "",
        cpf: person.cpf || "",
        endereco: person.address?.street || "",
        bairro: person.address?.neighborhood || "",
        numero: person.address?.number?.toString() || "",
        complemento: person.address?.complement || "",
        pontoReferencia: person.address?.referencePoint || ""
      });
    } catch (err) {
      console.error("Erro ao carregar voluntário:", err);
      setError("Erro ao carregar voluntário: " + (err.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const cpfLimpo = form.cpf.replace(/\D/g, "");
    const telefoneLimpo = form.telefoneCelular.replace(/\D/g, "");
    
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      setError("Telefone deve conter entre 10 e 11 dígitos (incluindo DDD).");
      setLoading(false);
      return;
    }

    if (cpfLimpo.length !== 11) {
      setError("CPF deve conter 11 dígitos numéricos.");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Por favor, insira um e-mail válido.");
      setLoading(false);
      return;
    }

    try {
      let personId;
      let addressId;

      if (isEdit && originalPerson) {
        // ===== MODO EDIÇÃO =====
        addressId = originalPerson.address?.id;

        const addressChanged =
          originalPerson.address?.street !== form.endereco ||
          originalPerson.address?.number !== parseInt(form.numero) ||
          originalPerson.address?.neighborhood !== form.bairro;

        if (addressChanged || !addressId) {
          const novoEndereco = {
            street: form.endereco,
            number: parseInt(form.numero),
            complement: form.complemento || null,
            neighborhood: form.bairro,
            referencePoint: form.pontoReferencia
          };
          const enderecoCriado = await addressService.findOrCreate(novoEndereco);
          addressId = enderecoCriado.id;
        }

        const pessoaData = {
          name: form.nomeCompleto,
          phone: telefoneLimpo,
          email: form.email,
          cpf: cpfLimpo,
          idAddress: addressId
        };
        await personService.update(originalPerson.id, pessoaData);
        personId = originalPerson.id;

        const voluntarioData = {
          personId: personId,
          password: "voluntario123",
          isActive: true
        };
        await voluntaryService.update(editId, voluntarioData);
        alert("Voluntário atualizado com sucesso!");
      } else {
        // ===== MODO CRIAÇÃO =====
        const enderecoData = {
          street: form.endereco,
          number: parseInt(form.numero),
          complement: form.complemento || null,
          neighborhood: form.bairro,
          referencePoint: form.pontoReferencia
        };
        const enderecoRes = await addressService.findOrCreate(enderecoData);
        const enderecoId = enderecoRes.id;

        const pessoaData = {
          name: form.nomeCompleto,
          phone: telefoneLimpo,
          email: form.email,
          cpf: cpfLimpo,
          idAddress: enderecoId
        };
        const pessoaRes = await personService.create(pessoaData);
        const pessoaId = pessoaRes.id;

        const voluntarioData = {
          personId: pessoaId,
          password: "voluntario123",
          isActive: true
        };
        await voluntaryService.create(voluntarioData);
        alert("Voluntário cadastrado com sucesso!");
      }

      setForm({
        nomeCompleto: "",
        telefoneCelular: "",
        email: "",
        cpf: "",
        endereco: "",
        bairro: "",
        numero: "",
        complemento: "",
        pontoReferencia: ""
      });
      router.push("/voluntarios");
    } catch (err) {
      console.error("Erro detalhado ao cadastrar voluntário:", err);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);
      setError(`Erro ao ${isEdit ? "atualizar" : "cadastrar"} voluntário: ` + (err.message || "") + (err.response?.data?.message ? " - " + err.response.data.message : ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navegation />
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <h1 className={styles.titulo}>{isEdit ? "Editar Funcionário" : "Cadastro de Funcionário"}</h1>
          <div className={styles.decoracao}></div>
          <form onSubmit={handleSubmit} className={styles.formulario}>
            <div className={styles.formGroup}>
              <label htmlFor="nomeCompleto"><b>Nome completo*</b></label>
              <input id="nomeCompleto" name="nomeCompleto" value={form.nomeCompleto} onChange={handleChange} required placeholder="Fulano da Silva" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email"><b>E-mail*</b></label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="fulano@gmail.com" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="telefoneCelular"><b>Telefone*</b></label>
              <input id="telefoneCelular" name="telefoneCelular" value={form.telefoneCelular} onChange={handleChange} required placeholder="(45) 9 9988-7766" type="tel" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cpf"><b>CPF*</b></label>
              <input id="cpf" name="cpf" type="text" pattern="[0-9]*" maxLength={11} value={form.cpf} onChange={e => { const onlyNums = e.target.value.replace(/\D/g, ""); setForm({ ...form, cpf: onlyNums }); }} placeholder="11122233355" required />
            </div>
            <hr className={styles.separador} />
            <div className={styles.formGroupFullWidth}>
              <label htmlFor="endereco"><b>Endereço*</b></label>
              <input id="endereco" name="endereco" value={form.endereco} onChange={handleChange} required placeholder="Rua da Água" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="numero"><b>Número*</b></label>
              <input id="numero" name="numero" type="number" value={form.numero} onChange={handleChange} required placeholder="2015" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="complemento"><b>Complemento</b></label>
              <input id="complemento" name="complemento" value={form.complemento} onChange={handleChange} placeholder="Ap 307" />
            </div>
            <div className={styles.formGroupFullWidth}>
              <label htmlFor="bairro"><b>Bairro*</b></label>
              <input id="bairro" name="bairro" value={form.bairro} onChange={handleChange} required placeholder="Centro" />
            </div>
            <div className={styles.formGroupFullWidth}>
              <label htmlFor="pontoReferencia"><b>Ponto de referência</b></label>
              <input id="pontoReferencia" name="pontoReferencia" value={form.pontoReferencia} onChange={handleChange} placeholder="Em frente ao parque" />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? (isEdit ? "Atualizando..." : "Cadastrando...") : (isEdit ? "Atualizar Voluntário" : "Cadastrar Voluntário")}
            </button>
            {error && <div className={styles.errorMessage}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroVoluntario;