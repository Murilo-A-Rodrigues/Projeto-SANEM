"use client";
import React, { useEffect, useState } from "react";
import MenuBar from "../../components/menubar/menubar";
import Navigation from "../../components/navegation/navegation";
// Importar o CSS Modules específico para a lista
import styles from "./lista.module.css";
// Se você mantiver o formContainer no styles de cadastrobeneficiario, importe-o também
// import formStyles from "../cadastrobeneficiario.module.css";
import { useRouter } from "next/navigation";
import modalStyles from "./lista.module.css";

export default function ListaBeneficiarios() {
  const [beneficiarios, setBeneficiarios] = useState([]); // [{id, nomeCompleto, email, telefoneCelular, nif, ...}]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null); // objeto do beneficiário a editar
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    try {
      const mock = JSON.parse(localStorage.getItem('mockBeneficiarios') || '[]');
      setBeneficiarios(mock);
    } catch (err) {
      setError("Erro ao carregar beneficiários do mock");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEdit = (id) => {
    router.push(`/cadastrobeneficiario/editar/${id}`);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este beneficiário?")) return;
    setLoading(true);
    setError("");
    try {
      const novos = beneficiarios.filter((b) => b.id !== id);
      setBeneficiarios(novos);
      localStorage.setItem('mockBeneficiarios', JSON.stringify(novos));
      alert("Beneficiário excluído com sucesso!");
    } catch (err) {
      setError("Erro ao excluir beneficiário");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (beneficiario) => {
    setEditForm({ ...beneficiario });
    setEditModalOpen(true);
    setEditError("");
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditForm(null);
    setEditError("");
  };
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    // Validação: pelo menos um dos campos (CPF/CRNM ou NIF) deve ser preenchido
    const cpfCrnmLimpo = editForm.cpfCrnm.replace(/\D/g, "");
    const nifLimpo = editForm.nif.replace(/\D/g, "");
    if (cpfCrnmLimpo.length === 0 && nifLimpo.length === 0) {
      setEditError("É obrigatório preencher pelo menos um dos campos: CPF/CRNM ou NIF.");
      setEditLoading(false);
      return;
    }
    if (cpfCrnmLimpo.length > 0 && cpfCrnmLimpo.length !== 11) {
      setEditError("CPF/CRNM deve conter 11 dígitos numéricos.");
      setEditLoading(false);
      return;
    }
    // Validação de telefone (aceita ambos formatos)
    const telefoneLimpo = editForm.telefoneCelular.replace(/\D/g, "");
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      setEditError("Telefone deve conter entre 10 e 11 dígitos (incluindo DDD).");
      setEditLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      setEditError("Por favor, insira um e-mail válido.");
      setEditLoading(false);
      return;
    }
    try {
      const novos = beneficiarios.map((b) => b.id === editForm.id ? { ...editForm, cpfCrnm: cpfCrnmLimpo, nif: nifLimpo } : b);
      setBeneficiarios(novos);
      localStorage.setItem('mockBeneficiarios', JSON.stringify(novos));
      setEditModalOpen(false);
      setEditForm(null);
    } catch (err) {
      setEditError("Erro ao salvar edição");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navigation />
      <div className={styles.contentWrapper}> {/* Novo wrapper para centralização e largura */}
        <div className={styles.listContainer}> {/* Usando listContainer para diferenciar do formContainer */}
          <h1 className={styles.titulo}>Beneficiários Cadastrados</h1>
          <div className={styles.decoracao}></div> {/* Linha decorativa */}

          <div className={styles.actionsHeader}>
            <button
              className={styles.addButton}
              onClick={() => router.push("/cadastrobeneficiario")}
            >
              + Adicionar Beneficiário
            </button>
          </div>
          <div className={styles.tableWrapper}> {/* Para permitir rolagem em telas pequenas */}
            <table className={styles.beneficiariosTable}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>NIF</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className={styles.loadingMessage}>Carregando...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className={styles.errorMessage}>{error}</td>
                  </tr>
                ) : beneficiarios.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.noDataMessage}>Nenhum beneficiário cadastrado ainda.</td>
                  </tr>
                ) : (
                  beneficiarios.map((b) => (
                    <tr key={b.id}>
                      <td>{b.nomeCompleto}</td>
                      <td>{b.email}</td>
                      <td>{b.telefoneCelular}</td>
                      <td>{b.nif || '–'}</td>
                      <td className={styles.actionButtons}>
                        <button 
                          className={styles.editButton} 
                          onClick={() => openEditModal(b)}
                          disabled={loading}
                        >
                          Editar
                        </button>
                        <button 
                          className={styles.deleteButton} 
                          onClick={() => handleDelete(b.id)}
                          disabled={loading}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Modal de edição */}
      {editModalOpen && (
        <div className={modalStyles.modalOverlay}>
          <div className={modalStyles.modalContent}>
            <h2 className={modalStyles.titulo}>Editar Beneficiário</h2>
            <form onSubmit={handleEditSubmit} className={modalStyles.formulario}>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_nomeCompleto"><b>Nome completo*</b></label>
                <input id="edit_nomeCompleto" name="nomeCompleto" value={editForm.nomeCompleto} onChange={handleEditChange} required placeholder="Fulano da Silva" />
              </div>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_email"><b>E-mail*</b></label>
                <input id="edit_email" name="email" type="email" value={editForm.email} onChange={handleEditChange} required placeholder="fulano@gmail.com" />
              </div>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_telefoneCelular"><b>Telefone*</b></label>
                <input id="edit_telefoneCelular" name="telefoneCelular" value={editForm.telefoneCelular} onChange={handleEditChange} required placeholder="(45) 9 9988-7766" type="tel" />
              </div>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_cpfCrnm"><b>CPF/CRNM (opcional se NIF for preenchido)</b></label>
                <input id="edit_cpfCrnm" name="cpfCrnm" type="text" pattern="[0-9]*" maxLength={11} value={editForm.cpfCrnm} onChange={e => { const onlyNums = e.target.value.replace(/\D/g, ""); setEditForm({ ...editForm, cpfCrnm: onlyNums }); }} placeholder="11122233355" />
              </div>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_nif"><b>NIF (opcional se CPF/CRNM for preenchido)</b></label>
                <input id="edit_nif" name="nif" type="text" pattern="[0-9]*" value={editForm.nif} onChange={e => { const onlyNums = e.target.value.replace(/\D/g, ""); setEditForm({ ...editForm, nif: onlyNums }); }} placeholder="123456789" />
              </div>
              <hr className={modalStyles.separador} />
              <div className={modalStyles.formGroupFullWidth}>
                <label htmlFor="edit_endereco"><b>Endereço*</b></label>
                <input id="edit_endereco" name="endereco" value={editForm.endereco} onChange={handleEditChange} required placeholder="Rua da Água" />
              </div>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_numero"><b>Número*</b></label>
                <input id="edit_numero" name="numero" type="number" value={editForm.numero} onChange={handleEditChange} required placeholder="2015" />
              </div>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_complemento"><b>Complemento</b></label>
                <input id="edit_complemento" name="complemento" value={editForm.complemento} onChange={handleEditChange} placeholder="Ap 307" />
              </div>
              <div className={modalStyles.formGroupFullWidth}>
                <label htmlFor="edit_bairro"><b>Bairro*</b></label>
                <input id="edit_bairro" name="bairro" value={editForm.bairro} onChange={handleEditChange} required placeholder="Centro" />
              </div>
              <div className={modalStyles.formGroupFullWidth}>
                <label htmlFor="edit_pontoReferencia"><b>Ponto de referência</b></label>
                <input id="edit_pontoReferencia" name="pontoReferencia" value={editForm.pontoReferencia} onChange={handleEditChange} placeholder="Em frente ao parque" />
              </div>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', width: '100%' }}>
                <button type="button" onClick={closeEditModal} style={{ background: '#aaa', color: '#fff' }}>Cancelar</button>
                <button type="submit" disabled={editLoading}>{editLoading ? "Salvando..." : "Salvar Alterações"}</button>
              </div>
              {editError && <div className={modalStyles.errorMessage}>{editError}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}