"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MenuBar from "../components/menubar/menubar";
import Navegation from "../components/navegation/navegation";
import styles from "./cadastrobeneficiario.module.css";
import { receiverService } from "../../receiverService";
import { addressService } from "../../addressService";
import { personService } from "../../personService";

const CadastroBeneficiario = () => {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = !!editId;

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
  const [originalPerson, setOriginalPerson] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (isEdit && editId) {
      loadBeneficiaryForEdit(editId);
    }
  }, [editId]);

  const loadBeneficiaryForEdit = async (id) => {
    try {
      setLoading(true);
      const data = await receiverService.getById(id);
      // The receiver data includes a person object with all the fields
      const person = data.person || {};
      setOriginalPerson(person);
      setForm({
        nomeCompleto: person.name || "",
        telefoneCelular: person.phone || "",
        email: person.email || "",
        cpfCrnm: person.cpf || "",
        nif: data.nif || "",
        endereco: person.address?.street || "",
        bairro: person.address?.neighborhood || "",
        numero: person.address?.number?.toString() || "",
        complemento: person.address?.complement || "",
        pontoReferencia: person.address?.referencePoint || ""
      });
    } catch (err) {
      console.error("Erro ao carregar beneficiário:", err);
      setError("Erro ao carregar beneficiário: " + (err.message || "Erro desconhecido"));
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
      let personId;
      let addressId;

      if (isEdit && originalPerson) {
        // ===== MODO EDIÇÃO =====
        // Reutilizar o address_id existente (ou criar/atualizar se mudou)
        addressId = originalPerson.address?.id;

        // Verificar se o endereço mudou
        const addressChanged =
          originalPerson.address?.street !== form.endereco ||
          originalPerson.address?.number !== parseInt(form.numero) ||
          originalPerson.address?.neighborhood !== form.bairro;

        if (addressChanged || !addressId) {
          // Criar/atualizar endereço
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

        // Atualizar pessoa
        const pessoaData = {
          name: form.nomeCompleto,
          phone: form.telefoneCelular,
          email: form.email,
          cpf: cpfCrnmLimpo.length > 0 ? cpfCrnmLimpo : "00000000000",
          idAddress: addressId
        };
        await personService.update(originalPerson.id, pessoaData);
        personId = originalPerson.id;

        // Atualizar beneficiário
        const dadosAtualizados = {
          personId: personId,
          nif: cpfCrnmLimpo.length > 0 ? null : (nifLimpo || null),
          isFit: true
        };
        await receiverService.update(editId, dadosAtualizados);
        alert("Beneficiário atualizado com sucesso!");
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
        addressId = enderecoCriado.id;

        // Criar pessoa - o backend exige CPF
        const novaPessoa = {
          name: form.nomeCompleto,
          phone: form.telefoneCelular,
          email: form.email,
          cpf: cpfCrnmLimpo.length > 0 ? cpfCrnmLimpo : "00000000000",
          idAddress: addressId
        };
        const pessoaCriada = await personService.create(novaPessoa);
        personId = pessoaCriada.id;

        // Criar beneficiário
        const novoBeneficiario = {
          personId: personId,
          nif: cpfCrnmLimpo.length > 0 ? null : (nifLimpo || null),
          isFit: true
        };
        await receiverService.create(novoBeneficiario);
        alert("Beneficiário cadastrado com sucesso!");
      }

      // Limpar formulário
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
      router.push("/beneficiarios");
    } catch (err) {
      console.error("Erro ao salvar:", err);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);
      const errorMsg = err.response?.data?.message || err.message || "Erro desconhecido";
      setError(`Erro ao ${isEdit ? "atualizar" : "cadastrar"} beneficiário: ` + errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navegation />
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <h1 className={styles.titulo}>{isEdit ? "Editar Beneficiário" : "Cadastro de Beneficiário"}</h1>
          <div className={styles.decoracao}></div>
          <form onSubmit={handleSubmit} className={styles.formulario}>
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
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="fulano@gmail.com"
              />
            </div>

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
                pattern="[0-9]*"
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
                pattern="[0-9]*"
                value={form.nif}
                onChange={e => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  setForm({ ...form, nif: onlyNums });
                }}
                placeholder="123456789"
              />
            </div>

            <hr className={styles.separador} />

            <div className={styles.formGroupFullWidth}>
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
              <label htmlFor="complemento"><b>Complemento</b></label>
              <input
                id="complemento"
                name="complemento"
                value={form.complemento}
                onChange={handleChange}
                placeholder="Ap 307"
              />
            </div>

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
              <label htmlFor="pontoReferencia"><b>Ponto de referência</b></label>
              <input
                id="pontoReferencia"
                name="pontoReferencia"
                value={form.pontoReferencia}
                onChange={handleChange}
                placeholder="Em frente ao parque"
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? (isEdit ? "Atualizando..." : "Cadastrando...") : (isEdit ? "Atualizar Beneficiário" : "Cadastrar Beneficiário")}
            </button>
            {error && <div className={styles.errorMessage}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroBeneficiario;
