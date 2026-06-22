"use client";
import MenuBar from "../components/menubar/menubar";
import Navigation from "../components/navegation/navegation";
import styles from "./estoque.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { itemService } from "@/itemService";

export default function EstoquePage() {
<<<<<<< Updated upstream
  const [mockEstoque, setMockEstoque] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    categoria: "",
    tamanho: "",
    quantidade: "",
  });
  const [editId, setEditId] = useState(null);
  const [editProduto, setEditProduto] = useState({
    nome: "",
    categoria: "",
    tamanho: "",
    quantidade: "",
  });
=======
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
>>>>>>> Stashed changes
  const router = useRouter();
  const hasNotification = false;

  useEffect(() => {
    carregarEstoque();
  }, []);

  const carregarEstoque = async () => {
    setLoading(true);
    try {
      const data = await itemService.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Erro ao carregar estoque:", e);
      setItems([]);
    }
    setLoading(false);
  };


  function toCategoryName(category) {
    if (!category || typeof category !== "object") return "-";
    return category.name || category.toString() || "-";
  }

<<<<<<< Updated upstream
  function handleAddProduto(e) {
    e.preventDefault();
    const novo = {
      id: mockEstoque.length ? Math.max(...mockEstoque.map((i) => i.id)) + 1 : 1,
      ...novoProduto,
      quantidade: Number(novoProduto.quantidade),
    };
    const updated = [...mockEstoque, novo];
    setMockEstoque(updated);
    salvarNoStorage(updated);
    setNovoProduto({ nome: "", categoria: "", tamanho: "", quantidade: "" });
    setShowAddModal(false);
  }

  function handleDeleteProduto() {
    const updated = mockEstoque.filter((item) => item.id !== itemToDelete.id);
    setMockEstoque(updated);
    salvarNoStorage(updated);
    setShowDeleteModal(false);
    setItemToDelete(null);
  }

  function openDeleteModal(item) {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }

  function startEditProduto(item) {
    setEditId(item.id);
    setEditProduto({
      nome: item.nome,
      categoria: item.categoria,
      tamanho: item.tamanho,
      quantidade: item.quantidade,
    });
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditProduto((prev) => ({
      ...prev,
      [name]: name === "quantidade" ? Number(value) : value,
    }));
  }

  function saveEditProduto(id) {
    const updated = mockEstoque.map((item) =>
      item.id === id ? { ...item, ...editProduto } : item
    );
    setMockEstoque(updated);
    salvarNoStorage(updated);
    setEditId(null);
    setEditProduto({
      nome: "",
      categoria: "",
      tamanho: "",
      quantidade: "",
    });
  }

  function cancelEditProduto() {
    setEditId(null);
    setEditProduto({
      nome: "",
      categoria: "",
      tamanho: "",
      quantidade: "",
    });
  }

  // (essa função do router vc nem está usando, mas deixei se quiser telas futuras)
  function handleEditProduto(item) {
    router.push(`/estoque/editar/${item.id}`);
=======
  function toSizeName(size) {
    if (!size || typeof size !== "object") return "-";
    return size.name || size.description || size.toString() || "-";
>>>>>>> Stashed changes
  }

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <MenuBar hasNotification={hasNotification} />
        <main className={styles.main}>
<<<<<<< Updated upstream
          <h1 className={styles.titulo}>Controle de Estoque</h1>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 24,
            }}
          >
            <button
              className={`${styles.btn} ${styles.btnAdicionar}`}
              onClick={() => setShowAddModal(true)}
            >
              + Adicionar Produto
            </button>
          </div>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Tamanho</th>
                <th>Quantidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {mockEstoque.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  {editId === item.id ? (
                    <>
                      <td>
                        <input
                          className={styles.formInput}
                          name="nome"
                          value={editProduto.nome}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          className={styles.formInput}
                          name="categoria"
                          value={editProduto.categoria}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          className={styles.formInput}
                          name="tamanho"
                          value={editProduto.tamanho}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          className={styles.formInput}
                          name="quantidade"
                          type="number"
                          min={1}
                          value={editProduto.quantidade}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <button
                          className={`${styles.btn} ${styles.btnAdicionar}`}
                          onClick={() => saveEditProduto(item.id)}
                        >
                          Salvar
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnExcluir}`}
                          onClick={cancelEditProduto}
                        >
                          Cancelar
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.nome}</td>
                      <td>{item.categoria}</td>
                      <td>{item.tamanho}</td>
                      <td>{item.quantidade}</td>
                      <td>
                        <button
                          className={`${styles.btn} ${styles.btnEditar}`}
                          onClick={() => startEditProduto(item)}
                        >
                          Editar
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnExcluir}`}
                          onClick={() => openDeleteModal(item)}
                        >
                          Excluir
                        </button>
                      </td>
                    </>
                  )}
=======
          <div className={styles.headerContainer}>
            <h1 className={styles.titulo}>Controle de Estoque</h1>
            <div className={styles.headerButtons}>
              <button
                className={`${styles.btn} ${styles.btnDoacao}`}
                onClick={() => router.push("/cadastrodoacao")}
              >
                + Registrar Doação
              </button>
              <button
                className={`${styles.btn} ${styles.btnRepasse}`}
                onClick={() => router.push("/cadastrorepasse")}
              >
                + Registrar Repasse
              </button>
            </div>
          </div>
          {loading ? (
            <p style={{ color: "#6b7280", marginTop: 40 }}>Carregando estoque...</p>
          ) : (
            <table className={styles.tabela}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Categoria</th>
                  <th>Tamanho</th>
                  <th>Quantidade</th>
                  <th>Doador</th>
>>>>>>> Stashed changes
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{toCategoryName(item.category)}</td>
                    <td>{toSizeName(item.size)}</td>
                    <td>{item.quantity}</td>
                    <td>{item.sex === 'm' ? 'Masculino' : 'Feminino'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
<<<<<<< Updated upstream

          {/* Modal Excluir */}
          {showDeleteModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2
                  className={styles.titulo}
                  style={{ fontSize: "1.3rem", marginBottom: 16 }}
                >
                  Confirmar Exclusão
                </h2>
                <p>
                  Tem certeza que deseja excluir o produto{" "}
                  <b>{itemToDelete?.nome}</b>?
                </p>
                <div className={styles.modalBotoes}>
                  <button
                    className={`${styles.btn} ${styles.btnExcluir}`}
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Não
                  </button>
                  <button
                    className={`${styles.btn} ${styles.btnAdicionar}`}
                    onClick={handleDeleteProduto}
                  >
                    Sim
                  </button>
                </div>
              </div>
            </div>
=======
          {!loading && items.length === 0 && (
            <p style={{ color: "#6b7280", marginTop: 20 }}>
              Nenhum item no estoque.
            </p>
>>>>>>> Stashed changes
          )}
        </main>
      </div>
    </>
  );
}
