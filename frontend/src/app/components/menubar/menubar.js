"use client";

import { useEffect, useState } from 'react';
import styles from './menuBar.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { isEstoqueBaixo } from '../../utils/estoqueUtils';

const STORAGE_KEY = "mockEstoque";

export default function MenuBar({ hasNotification: initialNotification, onEstoqueBaixo }) {
  const router = useRouter();
  const [hasNotification, setHasNotification] = useState(initialNotification || false);

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
    <header className={styles.menuBar}>
      <div className={styles.rightSection}>
        <div className={styles.userInfo}>
          <UserIcon />
          <span className={styles.userName}>Fulano da Silva</span>
          <span className={styles.arrowDown}>▼</span>
        </div>
        <div className={styles.iconWrapper} style={{ position: 'relative' }}>
          {hasNotification && (
            <div title="Estoque baixo! Quantidade total < 10 peças">
              <Image
                src="/warning.png"
                alt="Alerta estoque"
                width={24}
                height={24}
              />
            </div>
          )}
        </div>
        <div className={styles.iconWrapper}>
          <LogoutIcon onLogout={handleLogout} />
        </div>
      </div>
    </header>
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
