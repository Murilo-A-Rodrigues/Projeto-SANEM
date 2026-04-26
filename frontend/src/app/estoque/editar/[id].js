"use client";
import MenuBar from '../../components/menubar/menubar';
import Navigation from '../../components/navegation/navegation';
import styles from '../estoque.module.css';
import { mockEstoque as mockEstoqueOrig } from '../../../mocks/mockEstoque';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EditarProdutoPage() {
  const router = useRouter();
  const params = useSearchParams();
  const id = Number(router.query?.id || params.get('id'));
  const [produto, setProduto] = useState(null);
  const [form, setForm] = useState({ nome: '', categoria: '', tamanho: '', quantidade: '' });
  const hasNotification = false;

  useEffect(() => {
    const prod = mockEstoqueOrig.find(p => p.id === id);
    if (prod) {
      setProduto(prod);
      setForm({ nome: prod.nome, categoria: prod.categoria, tamanho: prod.tamanho, quantidade: prod.quantidade });
    }
  }, [id]);

  function handleSubmit(e) {
    e.preventDefault();
    // Aqui você pode salvar no backend ou atualizar o mock
    alert('Produto atualizado com sucesso!');
    router.push('/estoque');
  }

  if (!produto) return <div>Carregando...</div>;

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <MenuBar hasNotification={hasNotification} />
        <main className={styles.main}>
          <h1 className={styles.titulo}>Editar Produto</h1>
          <form className={styles.formulario} onSubmit={handleSubmit} style={{ maxWidth: 400, width: '100%' }}>
            <label className={styles.formLabel}>Nome
              <input className={styles.formInput} required value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
            </label>
            <label className={styles.formLabel}>Categoria
              <input className={styles.formInput} required value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} />
            </label>
            <label className={styles.formLabel}>Tamanho
              <input className={styles.formInput} required value={form.tamanho} onChange={e => setForm({ ...form, tamanho: e.target.value })} />
            </label>
            <label className={styles.formLabel}>Quantidade
              <input className={styles.formInput} required type="number" min={1} value={form.quantidade} onChange={e => setForm({ ...form, quantidade: e.target.value })} />
            </label>
            <div className={styles.modalBotoes}>
              <button type="button" className={`${styles.btn} ${styles.btnExcluir}`} onClick={() => router.push('/estoque')}>Cancelar</button>
              <button type="submit" className={`${styles.btn} ${styles.btnAdicionar}`}>Salvar</button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
} 