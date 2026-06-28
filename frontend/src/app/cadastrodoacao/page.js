"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../components/navegation/navegation";
import styles from "./cadastrodoacao.module.css";
import { giverService } from "../../giverService";
import { donationService } from "../../donationService";
import { itemService } from "../../itemService";
import { categoryService } from "../../categoryService";
import { sizeService } from "../../sizeService";

function normalizarNome(str) {
  return (str || "").toLowerCase().trim();
}

export default function CadastroDoacao() {
  const router = useRouter();
  const [doadores, setDoadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    doadorTipo: "existente",
    doadorId: "",
    tipoDoacao: "",
    categoria: "",
    tamanho: "",
    quantidade: "",
    novoDoadorNome: "",
    novoDoadorEmail: "",
    novoDoadorTelefone: "",
    novoDoadorCpf: "",
  });

  useEffect(() => {
    carregarDoadores();
  }, []);

  const carregarDoadores = async () => {
    try {
      setLoading(true);
      const data = await giverService.getAll();
      if (data && data.length > 0) {
        setDoadores(data);
      }
    } catch (err) {
      console.log("API não disponível para doadores:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const quantidade = Number(form.quantidade);

    if (!quantidade || quantidade <= 0) {
      setError("Informe uma quantidade válida.");
      setLoading(false);
      return;
    }

    if (form.doadorTipo === "existente" && !form.doadorId) {
      setError("Selecione um doador.");
      setLoading(false);
      return;
    }

    if (form.doadorTipo === "novo" && !form.novoDoadorNome) {
      setError("Informe o nome do novo doador.");
      setLoading(false);
      return;
    }

    try {
      let giverId = null;
      if (form.doadorTipo === "existente") {
        giverId = form.doadorId;
      } else if (form.doadorTipo === "novo") {
        // Cria novo doador no backend e obtém o ID
        const novoDoador = await giverService.create({
          nomeCompleto: form.novoDoadorNome,
          email: form.novoDoadorEmail || null,
          telefone: form.novoDoadorTelefone || null,
          cpf: form.novoDoadorCpf || null,
        });
        giverId = novoDoador.id;
      }

      const itemNome = form.tipoDoacao || "Doação";

      // Busca/cria categoria e tamanho para obter IDs
      const categoriaObj = await categoryService.findOrCreateByName(form.categoria);
      const tamanhoObj = await sizeService.findOrCreateByName(form.tamanho);

      const categoryId = categoriaObj?.id || null;
      const sizeId = tamanhoObj?.id || null;

      // Cria o item no backend
      const payload = {
        name: itemNome,
        quantity: Number(quantidade),
      };
      if (categoryId) payload.categoryId = categoryId;
      if (sizeId) payload.sizeId = sizeId;

      const novoItem = await itemService.create(payload);

      // Cria a doação vinculando ao item criado
      await donationService.create({
        giverId: giverId,
        voluntaryId: null,
        donationItems: [
          {
            itemId: novoItem.id,
            quantity: Number(quantidade),
          },
        ],
      });

      alert("Doação registrada com sucesso!");
      router.push("/estoque");
    } catch (err) {
      console.error("Erro ao registrar doação:", err);
      setError("Erro ao registrar doação: " + (err.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  if (loading && doadores.length === 0) {
    return (
    <div className={styles.containerGeral}>
      <Navigation />
        <div className={styles.formWrapper}>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.containerGeral}>
      <Navigation />
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <h1 className={styles.titulo}>Cadastro de Doação</h1>
          <div className={styles.decoracao}></div>

          <form onSubmit={handleSubmit} className={styles.formulario}>
            <div className={styles.sectionBox}>
              <h3 className={styles.sectionTitle}>Doador</h3>

              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="doadorTipo"
                    value="existente"
                    checked={form.doadorTipo === "existente"}
                    onChange={handleChange}
                  />
                  <span>Doador existente</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="doadorTipo"
                    value="anonimo"
                    checked={form.doadorTipo === "anonimo"}
                    onChange={handleChange}
                  />
                  <span>Doação anônima</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="doadorTipo"
                    value="novo"
                    checked={form.doadorTipo === "novo"}
                    onChange={handleChange}
                  />
                  <span>Cadastrar novo doador</span>
                </label>
              </div>

              {form.doadorTipo === "existente" && (
                <div className={styles.formGroupFullWidth}>
                  <label htmlFor="doadorId"><b>Selecione o doador*</b></label>
                  <select
                    id="doadorId"
                    name="doadorId"
                    value={form.doadorId}
                    onChange={handleChange}
                    required
                    className={styles.selectInput}
                  >
                    <option value="">Selecione um doador</option>
                    {doadores.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nomeCompleto || d.nome || d.name || "Sem nome"}
                        {d.email ? ` - ${d.email}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {form.doadorTipo === "anonimo" && (
                <div className={styles.anonymousBox}>
                  <p className={styles.anonymousText}>
                    A doação será registrada como anônima.
                  </p>
                </div>
              )}

              {form.doadorTipo === "novo" && (
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="novoDoadorNome"><b>Nome completo*</b></label>
                    <input
                      id="novoDoadorNome"
                      name="novoDoadorNome"
                      value={form.novoDoadorNome}
                      onChange={handleChange}
                      required
                      placeholder="Nome do novo doador"
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="novoDoadorEmail"><b>E-mail</b></label>
                    <input
                      id="novoDoadorEmail"
                      name="novoDoadorEmail"
                      type="email"
                      value={form.novoDoadorEmail}
                      onChange={handleChange}
                      placeholder="email@exemplo.com"
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="novoDoadorTelefone"><b>Telefone</b></label>
                    <input
                      id="novoDoadorTelefone"
                      name="novoDoadorTelefone"
                      value={form.novoDoadorTelefone}
                      onChange={handleChange}
                      placeholder="(45) 9 9988-7766"
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="novoDoadorCpf"><b>CPF</b></label>
                    <input
                      id="novoDoadorCpf"
                      name="novoDoadorCpf"
                      value={form.novoDoadorCpf}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/\D/g, "");
                        setForm({ ...form, novoDoadorCpf: onlyNums });
                      }}
                      maxLength={11}
                      placeholder="11122233355"
                      className={styles.inputField}
                    />
                  </div>
                </>
              )}
            </div>

            <div className={styles.sectionBox}>
              <h3 className={styles.sectionTitle}>Detalhes da Doação</h3>
              <div className={styles.formGroupFullWidth}>
                <label htmlFor="tipoDoacao"><b>Tipo de Doação*</b></label>
                <input
                  id="tipoDoacao"
                  name="tipoDoacao"
                  value={form.tipoDoacao}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Roupas, Alimentos, Brinquedos..."
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="categoria"><b>Categoria</b></label>
                <input
                  id="categoria"
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  placeholder="Ex: Masculino, Feminino, Infantil..."
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="tamanho"><b>Tamanho</b></label>
                <input
                  id="tamanho"
                  name="tamanho"
                  value={form.tamanho}
                  onChange={handleChange}
                  placeholder="Ex: P, M, G, GG, 38, 40..."
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="quantidade"><b>Quantidade*</b></label>
                <input
                  id="quantidade"
                  name="quantidade"
                  type="number"
                  min={1}
                  value={form.quantidade}
                  onChange={handleChange}
                  required
                  placeholder="Quantidade de itens"
                  className={styles.inputField}
                />
              </div>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.buttonRow}>
              <button
                type="button"
                className={styles.btnCancelar}
                onClick={() => router.push("/estoque")}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.btnSalvar}
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrar Doação"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}