"use client";

import styles from './menuBar.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MenuBar({ hasNotification }) {
  const router = useRouter();

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
