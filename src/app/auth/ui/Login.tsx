'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { Laptop, Facebook, Twitter } from 'lucide-react';
import styles from './Login.module.css';
import { authenticate } from '@/actions/auth/login';
import { useRouter } from 'next/dist/client/components/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
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
              <Link href="/forgot-password" className={styles.forgotLink}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <button type="submit" className={styles.submitButton} disabled={isPending}>
              {isPending ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
    </div>
  );
}
