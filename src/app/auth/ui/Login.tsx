'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { Laptop, Facebook, Twitter } from 'lucide-react';
import styles from './Login.module.css';
import PasswordResetModal from './PasswordResetModal';
import { useModalStore } from '../../../store/modalStore';
import { authenticate } from '../../../actions/auth/login';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { openModal } = useModalStore(); // Usamos el store para abrir el modal

  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);


  useEffect(() => {
    if (errorMessage === 'Success') {
     window.location.replace('/');
    }
  }, [errorMessage]);


  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <Laptop className={styles.logo} />
        <h2 className={styles.title}>ElectroTienda</h2>
        <p className={styles.subtitle}>Inicia sesión en tu cuenta</p>
      </div>

      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Iniciar Sesión</h3>
          <form action={formAction} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.rememberForgot}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="remember" className={styles.checkbox} />
                Recordarme
              </label>
              <button
                type="button"
                onClick={openModal} // Abre el modal cuando el usuario hace clic
                className={styles.forgotLink}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <button type="submit" className={styles.submitButton} disabled={isPending}>
              {isPending ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
            {errorMessage && (
            <>
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
          </form>
          <div className={styles.separator}></div>
          <div className={styles.socialLogin}>
            <button type="button" className={styles.socialButton}>
              <Facebook className={styles.socialIcon} />
            </button>
            <button type="button" className={styles.socialButton}>
              <Twitter className={styles.socialIcon} />
            </button>
          </div>
          <p className={styles.registerText}>
            ¿No tienes una cuenta?{' '}
            <Link href="/auth/registro" className={styles.registerLink}>
              Regístrate
            </Link>
          </p>
        </div>
      </div>


      <PasswordResetModal />

    </div>
  );
}