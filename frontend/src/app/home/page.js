import MenuBar from '../components/menubar/menubar';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../components/navegation/navegation';
import styles from './home.module.css';
import { FaHome, FaUserPlus, FaBoxes, FaHandHoldingHeart, FaUsers, FaUserFriends, FaChartBar, FaCog } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { isEstoqueBaixo } from '../utils/estoqueUtils';

const STORAGE_KEY = "mockEstoque";

export default function Home() {
  const [estoqueBaixo, setEstoqueBaixo] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored);
        const baixo = isEstoqueBaixo(items);
        setEstoqueBaixo(baixo);
        if (baixo) {
          setShowAlert(true);
        }
      }
    } catch (e) {
      console.error("Erro verificando estoque:", e);
    }
  }, []);

  // Opções de navegação para o grid (removido Usuários)
  const navOptions = [
    { href: '/home', label: 'Home', icon: <FaHome /> },
    { href: '/cadastrooption', label: 'Cadastro', icon: <FaUserPlus /> },
    { href: '/estoque', label: 'Estoque', icon: <FaBoxes /> },
    { href: '/cadastrodoador/lista', label: 'Doadores', icon: <FaHandHoldingHeart /> },
    { href: '/cadastrobeneficiario/lista', label: 'Beneficiários', icon: <FaUsers /> },
    { href: '/cadastrovoluntario/lista', label: 'Voluntários', icon: <FaUserFriends /> },
    { href: '/relatorios', label: 'Relatórios', icon: <FaChartBar /> },
    { href: '/configuracoes', label: 'Configurações', icon: <FaCog /> },
  ];

  return (
    <div className={styles.container}>
      <Navigation />
      <MenuBar onEstoqueBaixo={setEstoqueBaixo} />
      
      {showAlert && estoqueBaixo && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          border: '2px solid #ff9800',
          borderRadius: 8,
          padding: 24,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          zIndex: 1000,
          maxWidth: 400,
          textAlign: 'center'
        }}>
          <Image
            src="/warning.png"
            alt="Aviso"
            width={48}
            height={48}
            style={{ marginBottom: 16 }}
          />
          <h2 style={{ color: '#ff9800', marginBottom: 8 }}>⚠️ Estoque Baixo!</h2>
          <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
            A quantidade total de peças em estoque está inferior a 10 unidades. 
            Por favor, reponha o estoque.
          </p>
          <button
            onClick={() => setShowAlert(false)}
            style={{
              padding: '10px 24px',
              background: '#ff9800',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 'bold'
            }}
          >
            Entendi
          </button>
        </div>
      )}

      {showAlert && estoqueBaixo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 999
        }} onClick={() => setShowAlert(false)} />
      )}

      <main className={styles.main}>
        <Image
          src="/doantion.jpg"
          alt="Doação"
          width={320}
          height={180}
          className={styles.donationImage}
          priority
        />
        <h1 className={styles.title}>Bem-vindo à Sanem!</h1>
        <p className={styles.effectPhrase}>
          "A solidariedade transforma vidas. Doe hoje e faça a diferença!"
        </p>
        <div className={styles.gridNav}>
          {navOptions.map((opt) => (
            <Link key={opt.href} href={opt.href} className={styles.gridNavItem}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {opt.icon}
                {opt.label}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
} 