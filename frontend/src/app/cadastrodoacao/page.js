"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MenuBar from "../components/menubar/menubar";
import Navigation from "../components/navegation/navegation";
import styles from "./cadastrodoacao.module.css";
import { giverService } from "../../giverService";
import { donationService } from "../../donationService";
import { itemService } from "../../itemService";

const STORAGE_KEY = "mockEstoque";

export default function CadastroDoacao() {
  const router = useRouter();
  const [doadores, setDoadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [estoque, setEstoque] = useState([]);

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
    carregarEstoque();
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

  const carregarEstoque = async () => {
    try {
      const data = await itemService.getAll();
      setEstoque(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Erro ao carregar estoque:", e);
      setEstoque([]);
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
      let nomeDoador = "Anônimo";
      let giverId = null;
      if (form.doadorTipo === "existente") {
        const doador = doadores.find((d) => d.id === form.doadorId);
        nomeDoador = doador?.nomeCompleto || doador?.nome || doador?.name || "Doador";
        giverId = form.doadorId;
      } else if (form.doadorTipo === "novo") {
        nomeDoador = form.novoDoadorNome;
      }

      // Tenta enviar doação ao backend
      try {
        const itemExistente = estoque.find(
          (i) =>
            (i.nome || "").toLowerCase() === (form.tipoDoacao || "Doação").toLowerCase() &&
            (i.categoria || "").toLowerCase() === (form.categoria || "").toLowerCase() &&
            (i.tamanho || "").toLowerCase() === (form.tamanho || "").toLowerCase()
        );

        let itemId = itemExistente ? itemExistente.id : null;

        // Se não existe no backend, cria o item primeiro
        if (!itemId) {
          try {
            const novoItem = await itemService.create({
              nome: form.tipoDoacao || "Doação",
              categoria: form.categoria || "",
              tamanho: form.tamanho || "",
              quantidade: quantidade,
            });
            itemId = novoItem.id;
          } catch (itemErr) {
            console.error("Falha ao criar item no backend:", itemErr);
          }
        }

        if (itemId && giverId) {
          await donationService.create({
            giverId: giverId,
            voluntaryId: null,
            donationItems: [
              {
                itemId: itemId,
                quantity: quantidade,
              },
            ],
          });
        }
      } catch (apiErr) {
        console.error("Falha ao enviar doação para o servidor, salvando apenas localmente:", apiErr);
      }

      // Salva no localStorage
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        let estoqueAtual = stored ? JSON.parse(stored) : [];

        const novoItemId = estoqueAtual.length
          ? Math.max(...estoqueAtual.map((i) => i.id)) + 1
          : 1;

        const novoItem = {
          id: novoItemId,
          nome: form.tipoDoacao || "Doação",
          categoria: form.categoria,
          tamanho: form.tamanho,
          quantidade: quantidade,
        };

        estoqueAtual.push(novoItem);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(estoqueAtual));

        const STORAGE_DOACOES = "mockDoacoes";
        const storedDoacoes = localStorage.getItem(STORAGE_DOACOES);
        const doacoes = storedDoacoes ? JSON.parse(storedDoacoes) : [];

        const hoje = new Date();
        const novaDoacao = {
          id: Date.now(),
          user: nomeDoador,
          action: form.tipoDoacao || "Doação",
          date: hoje.toISOString(),
          tipo: form.tipoDoacao,
          categoria: form.categoria,
          tamanho: form.tamanho,
          quantidade: quantidade,
          itemEstoqueId: novoItemId,
        };

        doacoes.push(novaDoacao);
        localStorage.setItem(STORAGE_DOACOES, JSON.stringify(doacoes));
      }

      alert("Doação registrada com sucesso!");
      router.push("/doacoes");
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
        <MenuBar />
        <Navigation />
        <div className={styles.formWrapper}>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
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
                onClick={() => router.push("/doacoes")}
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