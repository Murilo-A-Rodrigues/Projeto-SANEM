"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navegation from "../components/navegation/navegation";
import styles from "./cadastrodoador.module.css";
import { giverService } from "../../giverService";
import { addressService } from "../../addressService";
import { personService } from "../../personService";

const CadastroDoador = () => {
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
      loadGiverForEdit(editId);
    }
  }, [editId]);

  const loadGiverForEdit = async (id) => {
    try {
      setLoading(true);
      const data = await giverService.getById(id);
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
      console.error("Erro ao carregar doador:", err);
      setError("Erro ao carregar doador: " + (err.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Limpa o CPF para garantir que só vai número
    const cpfLimpo = form.cpf.replace(/\D/g, "");
    
    if (cpfLimpo.length > 0 && cpfLimpo.length !== 11) {
      setError("CPF deve conter 11 dígitos numéricos.");
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
          phone: form.telefoneCelular,
          email: form.email,
          cpf: cpfLimpo,
          idAddress: addressId
        };
        await personService.update(originalPerson.id, pessoaData);
        personId = originalPerson.id;

        const doadorData = {
          personId: personId
        };
        await giverService.update(editId, doadorData);
        alert("Doador atualizado com sucesso!");
      } else {
        // ===== MODO CRIAÇÃO =====
        // Criar endereço
        const novoEndereco = {
          street: form.endereco,
          number: parseInt(form.numero),
          complement: form.complemento || null,
          neighborhood: form.bairro,
          referencePoint: form.pontoReferencia
        };
        const enderecoCriado = await addressService.findOrCreate(novoEndereco);

        // Criar pessoa
        const novaPessoa = {
          name: form.nomeCompleto,
          phone: form.telefoneCelular,
          email: form.email,
          cpf: cpfLimpo,
          idAddress: enderecoCriado.id
        };
        const pessoaCriada = await personService.create(novaPessoa);

        // Criar doador
        const novoDoador = {
          personId: pessoaCriada.id
        };
        await giverService.create(novoDoador);
        alert("Doador cadastrado com sucesso!");
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
      router.push("/doadores");
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      setError(`Erro ao ${isEdit ? "atualizar" : "cadastrar"} doador: ` + (err.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.containerGeral}>
      <Navegation />
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <h1 className={styles.titulo}>{isEdit ? "Editar Doador" : "Cadastro de Doador"}</h1>
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
              <input id="telefoneCelular" name="telefoneCelular" value={form.telefoneCelular} onChange={handleChange} required placeholder="(45) 9 9988-7766"/>
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
              {loading ? (isEdit ? "Atualizando..." : "Cadastrando...") : (isEdit ? "Atualizar Doador" : "Cadastrar Doador")}
            </button>
            {error && <div className={styles.errorMessage}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroDoador;