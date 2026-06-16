"use client";
import MenuBar from "../components/menubar/menubar";
import Navigation from "../components/navegation/navegation";
import { mockEstoque as mockEstoqueOrig } from "../../mocks/mockEstoque";
import styles from "./estoque.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "mockEstoque";

export default function EstoquePage() {
  const [mockEstoque, setMockEstoque] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    categoria: "",
    tamanho: "",
    quantidade: "",
  });
  const [editProduto, setEditProduto] = useState({
    id: null,
    nome: "",
    categoria: "",
    tamanho: "",
    quantidade: "",
  });
  const router = useRouter();
  const hasNotification = false;

  // 🔹 Carrega do localStorage ou, se não tiver, inicializa com o mock do arquivo
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setMockEstoque(parsed);
          return;
        }
      }
    } catch (e) {
      console.error("Erro lendo estoque do localStorage:", e);
    }

    // fallback: mock original
    setMockEstoque(mockEstoqueOrig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEstoqueOrig));
  }, []);

  function salvarNoStorage(updated) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

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

  function openEditModal(item) {
    setEditProduto({
      id: item.id,
      nome: item.nome,
      categoria: item.categoria,
      tamanho: item.tamanho,
      quantidade: item.quantidade,
    });
    setShowEditModal(true);
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditProduto((prev) => ({
      ...prev,
      [name]: name === "quantidade" ? Number(value) : value,
    }));
  }

  function saveEditProduto(e) {
    e.preventDefault();
    const updated = mockEstoque.map((item) =>
      item.id === editProduto.id
        ? {
            ...item,
            nome: editProduto.nome,
            categoria: editProduto.categoria,
            tamanho: editProduto.tamanho,
            quantidade: editProduto.quantidade,
          }
        : item
    );
    setMockEstoque(updated);
    salvarNoStorage(updated);
    setShowEditModal(false);
    setEditProduto({
      id: null,
      nome: "",
      categoria: "",
      tamanho: "",
      quantidade: "",
    });
  }

  function cancelEditProduto() {
    setShowEditModal(false);
    setEditProduto({
      id: null,
      nome: "",
      categoria: "",
      tamanho: "",
      quantidade: "",
    });
  }

  // (essa função do router vc nem está usando, mas deixei se quiser telas futuras)
  function handleEditProduto(item) {
    router.push(`/estoque/editar/${item.id}`);
  }

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <MenuBar hasNotification={hasNotification} />
        <main className={styles.main}>
          <div className={styles.headerContainer}>
            <h1 className={styles.titulo}>Controle de Estoque</h1>
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
                  <td>{item.nome}</td>
                  <td>{item.categoria}</td>
                  <td>{item.tamanho}</td>
                  <td>{item.quantidade}</td>
                  <td>
                    <button
                      className={`${styles.btn} ${styles.btnEditar}`}
                      onClick={() => openEditModal(item)}
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
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal Adicionar */}
          {showAddModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2
                  className={styles.titulo}
                  style={{ fontSize: "1.3rem", marginBottom: 16 }}
                >
                  Adicionar Produto
                </h2>
                <form className={styles.formulario} onSubmit={handleAddProduto}>
                  <label className={styles.formLabel}>
                    Nome
                    <input
                      className={styles.formInput}
                      required
                      value={novoProduto.nome}
                      onChange={(e) =>
                        setNovoProduto({ ...novoProduto, nome: e.target.value })
                      }
                    />
                  </label>
                  <label className={styles.formLabel}>
                    Categoria
                    <input
                      className={styles.formInput}
                      required
                      value={novoProduto.categoria}
                      onChange={(e) =>
                        setNovoProduto({
                          ...novoProduto,
                          categoria: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label className={styles.formLabel}>
                    Tamanho
                    <input
                      className={styles.formInput}
                      required
                      value={novoProduto.tamanho}
                      onChange={(e) =>
                        setNovoProduto({
                          ...novoProduto,
                          tamanho: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label className={styles.formLabel}>
                    Quantidade
                    <input
                      className={styles.formInput}
                      required
                      type="number"
                      min={1}
                      value={novoProduto.quantidade}
                      onChange={(e) =>
                        setNovoProduto({
                          ...novoProduto,
                          quantidade: e.target.value,
                        })
                      }
                    />
                  </label>
                  <div className={styles.modalBotoes}>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnExcluir}`}
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={`${styles.btn} ${styles.btnAdicionar}`}
                    >
                      Adicionar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

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
          )}

          {/* Modal Editar */}
          {showEditModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2
                  className={styles.titulo}
                  style={{ fontSize: "1.3rem", marginBottom: 16 }}
                >
                  Editar Produto
                </h2>
                <form className={styles.formulario} onSubmit={saveEditProduto}>
                  <label className={styles.formLabel}>
                    Nome
                    <input
                      className={styles.formInput}
                      required
                      name="nome"
                      value={editProduto.nome}
                      onChange={handleEditChange}
                    />
                  </label>
                  <label className={styles.formLabel}>
                    Categoria
                    <input
                      className={styles.formInput}
                      required
                      name="categoria"
                      value={editProduto.categoria}
                      onChange={handleEditChange}
                    />
                  </label>
                  <label className={styles.formLabel}>
                    Tamanho
                    <input
                      className={styles.formInput}
                      required
                      name="tamanho"
                      value={editProduto.tamanho}
                      onChange={handleEditChange}
                    />
                  </label>
                  <label className={styles.formLabel}>
                    Quantidade
                    <input
                      className={styles.formInput}
                      required
                      type="number"
                      min={1}
                      name="quantidade"
                      value={editProduto.quantidade}
                      onChange={handleEditChange}
                    />
                  </label>
                  <div className={styles.modalBotoes}>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnExcluir}`}
                      onClick={cancelEditProduto}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={`${styles.btn} ${styles.btnAdicionar}`}
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}