import styles from './menuBar.module.css';
import Image from 'next/image';

export default function MenuBar({ hasNotification }) {
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
          <LogoutIcon />
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

function LogoutIcon() {
    return (
        <Image
            src="/logout-icon.png"
            alt="Logout"
            width={24}
            height={24}
            style={{ marginRight: 12 }}
        />
    );
}
