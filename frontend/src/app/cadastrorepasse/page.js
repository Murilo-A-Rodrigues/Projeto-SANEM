"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../components/navegation/navegation";
import styles from "./cadastrorepasse.module.css";
import { receiverService } from "../../receiverService";
import { transferService } from "../../transferService";
import { itemService } from "../../itemService";

export default function CadastroRepasse() {
  const router = useRouter();
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    beneficiarioTipo: "existente",
    beneficiarioId: "",
    itensSelecionados: [],
    novoBeneficiarioNome: "",
    novoBeneficiarioEmail: "",
    novoBeneficiarioTelefone: "",
    novoBeneficiarioCpf: "",
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      await Promise.all([
        carregarBeneficiarios(),
        carregarEstoque(),
      ]);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar dados: " + (err.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  const carregarBeneficiarios = async () => {
    try {
      const data = await receiverService.getAll();
      if (data && data.length > 0) {
        setBeneficiarios(data);
      }
    } catch (err) {
      console.log("API não disponível para beneficiários:", err.message);
    }
  };

  const carregarEstoque = async () => {
    try {
      const data = await itemService.getAll();
      const lista = Array.isArray(data) ? data : [];
      setEstoque(lista.filter((item) => (item.quantity || 0) > 0));
    } catch (e) {
      console.error("Erro ao carregar estoque do backend:", e);
      setEstoque([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantidadeChange = (itemId, value) => {
    const qtd = Number(value);
    setForm((prev) => {
      const existente = prev.itensSelecionados.find((i) => i.id === itemId);
      if (existente) {
        return {
          ...prev,
          itensSelecionados: prev.itensSelecionados.map((i) =>
            i.id === itemId ? { ...i, quantidadeSelecionada: qtd } : i
          ),
        };
      } else {
        const item = estoque.find((i) => i.id === itemId);
        if (item) {
          return {
            ...prev,
            itensSelecionados: [
              ...prev.itensSelecionados,
              { ...item, quantidadeSelecionada: qtd || 0 },
            ],
          };
        }
        return prev;
      }
    });
  };

  const removerItem = (itemId) => {
    setForm((prev) => ({
      ...prev,
      itensSelecionados: prev.itensSelecionados.filter((i) => i.id !== itemId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.beneficiarioTipo === "existente" && !form.beneficiarioId) {
      setError("Selecione um beneficiário.");
      setLoading(false);
      return;
    }

    if (form.beneficiarioTipo === "novo" && !form.novoBeneficiarioNome) {
      setError("Informe o nome do novo beneficiário.");
      setLoading(false);
      return;
    }

    const itensValidos = form.itensSelecionados.filter(
      (i) => i.quantidadeSelecionada > 0
    );

    if (itensValidos.length === 0) {
      setError("Selecione pelo menos um item do estoque com quantidade válida.");
      setLoading(false);
      return;
    }

    for (const item of itensValidos) {
      const estoqueItem = estoque.find((e) => e.id === item.id);
      if (!estoqueItem || item.quantidadeSelecionada > estoqueItem.quantity) {
        setError(
          `Quantidade do item "${item.name}" excede o estoque disponível (${estoqueItem?.quantity || 0}).`
        );
        setLoading(false);
        return;
      }
    }

    try {
      let receiverId = null;
      if (form.beneficiarioTipo === "existente") {
        receiverId = form.beneficiarioId;
      } else if (form.beneficiarioTipo === "novo") {
        const novoBeneficiario = await receiverService.create({
          nomeCompleto: form.novoBeneficiarioNome,
          email: form.novoBeneficiarioEmail || null,
          telefone: form.novoBeneficiarioTelefone || null,
          cpf: form.novoBeneficiarioCpf || null,
        });
        receiverId = novoBeneficiario.id;
      }

      const transferItems = itensValidos.map((i) => ({
        itemId: i.id,
        quantity: i.quantidadeSelecionada,
      }));

      await transferService.create({
        receiverId: receiverId,
        voluntaryId: null,
        transferDonationItems: transferItems,
      });

      alert("Repasse registrado com sucesso!");
      router.push("/estoque");
    } catch (err) {
      console.error("Erro ao registrar repasse:", err);
      setError("Erro ao registrar repasse: " + (err.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  if (loading && beneficiarios.length === 0 && estoque.length === 0) {
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
          <h1 className={styles.titulo}>Cadastro de Repasse</h1>
          <div className={styles.decoracao}></div>

          <form onSubmit={handleSubmit} className={styles.formulario}>
            <div className={styles.sectionBox}>
              <h3 className={styles.sectionTitle}>Para quem será doado</h3>

              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="beneficiarioTipo"
                    value="existente"
                    checked={form.beneficiarioTipo === "existente"}
                    onChange={handleChange}
                  />
                  <span>Beneficiário existente</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="beneficiarioTipo"
                    value="novo"
                    checked={form.beneficiarioTipo === "novo"}
                    onChange={handleChange}
                  />
                  <span>Cadastrar novo beneficiário</span>
                </label>
              </div>

              {form.beneficiarioTipo === "existente" && (
                <div className={styles.formGroupFullWidth}>
                  <label htmlFor="beneficiarioId"><b>Selecione o beneficiário*</b></label>
                  <select
                    id="beneficiarioId"
                    name="beneficiarioId"
                    value={form.beneficiarioId}
                    onChange={handleChange}
                    required
                    className={styles.selectInput}
                  >
                    <option value="">Selecione um beneficiário</option>
                    {beneficiarios.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nomeCompleto || b.nome || b.name || "Sem nome"}
                        {b.email ? ` - ${b.email}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {form.beneficiarioTipo === "novo" && (
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="novoBeneficiarioNome"><b>Nome completo*</b></label>
                    <input
                      id="novoBeneficiarioNome"
                      name="novoBeneficiarioNome"
                      value={form.novoBeneficiarioNome}
                      onChange={handleChange}
                      required
                      placeholder="Nome do novo beneficiário"
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="novoBeneficiarioEmail"><b>E-mail</b></label>
                    <input
                      id="novoBeneficiarioEmail"
                      name="novoBeneficiarioEmail"
                      type="email"
                      value={form.novoBeneficiarioEmail}
                      onChange={handleChange}
                      placeholder="email@exemplo.com"
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="novoBeneficiarioTelefone"><b>Telefone</b></label>
                    <input
                      id="novoBeneficiarioTelefone"
                      name="novoBeneficiarioTelefone"
                      value={form.novoBeneficiarioTelefone}
                      onChange={handleChange}
                      placeholder="(45) 9 9988-7766"
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="novoBeneficiarioCpf"><b>CPF/CRNM</b></label>
                    <input
                      id="novoBeneficiarioCpf"
                      name="novoBeneficiarioCpf"
                      value={form.novoBeneficiarioCpf}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/\D/g, "");
                        setForm({ ...form, novoBeneficiarioCpf: onlyNums });
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
              <h3 className={styles.sectionTitle}>Itens do Estoque</h3>
              <p className={styles.helpText}>
                Selecione os itens e informe as quantidades para repasse.
              </p>

              {estoque.length === 0 ? (
                <p className={styles.emptyText}>
                  Nenhum item disponível no estoque.
                </p>
              ) : (
                <table className={styles.tabelaItens}>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Categoria</th>
                      <th>Tamanho</th>
                      <th>Disponível</th>
                      <th>Qtd. Repasse</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estoque.map((item) => {
                      const itemSelecionado = form.itensSelecionados.find(
                        (i) => i.id === item.id
                      );
                      return (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.category?.name || item.category || "-"}</td>
                          <td>{item.size?.name || item.size || "-"}</td>
                          <td>{item.quantity}</td>
                          <td>
                            <input
                              type="number"
                              min={0}
                              max={item.quantity}
                              className={styles.qtdInput}
                              value={itemSelecionado?.quantidadeSelecionada || ""}
                              onChange={(e) =>
                                handleQuantidadeChange(item.id, e.target.value)
                              }
                              placeholder="0"
                            />
                          </td>
                          <td>
                            {itemSelecionado && itemSelecionado.quantidadeSelecionada > 0 && (
                              <button
                                type="button"
                                className={styles.btnRemover}
                                onClick={() => removerItem(item.id)}
                              >
                                Remover
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {form.itensSelecionados.filter((i) => i.quantidadeSelecionada > 0).length > 0 && (
                <div className={styles.resumoBox}>
                  <h4 className={styles.resumoTitle}>Itens selecionados para repasse:</h4>
                  <ul className={styles.resumoList}>
                    {form.itensSelecionados
                      .filter((i) => i.quantidadeSelecionada > 0)
                      .map((item) => (
                        <li key={item.id} className={styles.resumoItem}>
                          {item.name} - {item.quantidadeSelecionada}x
                          {item.category?.name ? ` (${item.category.name})` : ""}
                          {item.size?.name ? ` [${item.size.name}]` : ""}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
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
                {loading ? "Registrando..." : "Registrar Repasse"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}