"use client";

import { useEffect, useState } from 'react';
import styles from './menuBar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isEstoqueBaixo } from '../../../utils/estoqueUtils';

const STORAGE_KEY = "mockEstoque";

export default function MenuBar({ hasNotification: initialNotification, onEstoqueBaixo }) {
  const router = useRouter();
  const [hasNotification, setHasNotification] = useState(initialNotification || false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);

  useEffect(() => {
    // Verifica o estoque do localStorage
    if (typeof window === "undefined") return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored);
        const baixo = isEstoqueBaixo(items);
        setHasNotification(baixo);
        if (onEstoqueBaixo) {
          onEstoqueBaixo(baixo);
        }
      }
    } catch (e) {
      console.error("Erro verificando estoque:", e);
    }
  }, [onEstoqueBaixo]);

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja fazer logout?")) {
      localStorage.clear();
      sessionStorage.clear();
      router.push('/');
    }
  };

  return (
    <>
      <header className={styles.menuBar}>
        <div className={styles.rightSection}>
          <div className={styles.userInfo}>
            <UserIcon />
            <span className={styles.userName}>Fulano da Silva</span>
            <span className={styles.arrowDown}>▼</span>
          </div>
          <div className={styles.iconWrapper} style={{ position: 'relative' }}>
            {hasNotification && (
              <button
                onClick={() => setShowWarningPopup(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  title: 'Estoque baixo! Clique para mais detalhes'
                }}
              >
                <Image
                  src="/warning.png"
                  alt="Alerta estoque"
                  width={24}
                  height={24}
                />
              </button>
            )}
          </div>
          <div className={styles.iconWrapper}>
            <LogoutIcon onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {showWarningPopup && hasNotification && (
        <>
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
              Deseja cadastrar uma doação para repor o estoque?
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setShowWarningPopup(false)}
                style={{
                  padding: '10px 20px',
                  background: '#ccc',
                  color: '#333',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 'bold'
                }}
              >
                Fechar
              </button>
              <Link
                href="/cadastrodoador"
                style={{
                  padding: '10px 20px',
                  background: '#ff9800',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
                onClick={() => setShowWarningPopup(false)}
              >
                Cadastrar Doação
              </Link>
            </div>
          </div>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 999
          }} onClick={() => setShowWarningPopup(false)} />
        </>
      )}
    </>
  );
}

function UserIcon() {
    return (
        <Image
            src="/user-icon.png"
            alt="User"
            width={24}
            height={24}
            style={{ marginRight: 12 }}
        />
    );
}

function LogoutIcon({ onLogout }) {
    return (
        <button
            onClick={onLogout}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center'
            }}
            title="Fazer logout"
        >
            <Image
                src="/logout-icon.png"
                alt="Logout"
                width={24}
                height={24}
                style={{ marginRight: 12 }}
            />
        </button>
    );
}
