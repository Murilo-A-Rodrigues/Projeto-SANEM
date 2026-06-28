"use client";

import { useEffect, useState } from 'react';
import styles from './menuBar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { itemService } from '@/itemService';

export default function MenuBar() {
  const router = useRouter();
  const [hasNotification, setHasNotification] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);

  useEffect(() => {
    const checkStock = async () => {
      try {
        const data = await itemService.getAll();
        if (!Array.isArray(data)) {
          setHasNotification(true);
          return;
        }
        const total = data.reduce((sum, item) => sum + (item.quantity ?? item.quantidade ?? 0), 0);
        setHasNotification(total < 10);
      } catch (e) {
        setHasNotification(true);
      }
    };
    checkStock();
  }, []);

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
            {hasNotification && (
              <button
                className={styles.warningIconBtn}
                onClick={() => setShowWarningPopup(true)}
                title="Estoque baixo! Clique para mais detalhes"
                style={{ fontSize: 20, lineHeight: 1 }}
              >
                ⚠️
              </button>
            )}
            <span className={styles.userName}>Fulano da Silva</span>
            <span className={styles.arrowDown}>▼</span>
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
                href="/cadastrodoacao"
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