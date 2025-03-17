'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './PasswordResetModal.module.css';
import { FaRegTimesCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useModalStore } from '../../../store/modalStore';
import { sendForgotPasswordEmail } from '../../../actions/auth/sendForgotPasswordEmail';
import { verifyToken } from '../../../actions/auth/verifyToken';
import { resetPassword } from '../../../actions/auth/resetPassword';

export default function PasswordResetModal() {
  const router = useRouter();
  const { isOpen, step, closeModal, nextStep } = useModalStore();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(Array(6).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const codeInputsRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleCloseModal = () => {
    closeModal();
    setEmail('');
    setCode(Array(6).fill(''));
    setPassword('');
    setConfirmPassword('');
    setError('');
    setCooldown(0);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      await sendForgotPasswordEmail(email);
      nextStep();
      setCooldown(60);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al enviar el correo');
      } else {
        setError('Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      await verifyToken(code.join(''), email);
      nextStep();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Código inválido');
      } else {
        setError('Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    setError('');
    try {
      await sendForgotPasswordEmail(email);
      setCooldown(60); // Reinicia el cooldown a 1 minuto
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al reenviar el código');
      } else {
        setError('Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await resetPassword(code.join(''), password, email);
      handleCloseModal();
      router.push('/auth/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al restablecer la contraseña');
      } else {
        setError('Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string): void => {
    if (value.length > 1) return; // Solo un carácter permitido
    const newCode = [...code];
    newCode[index] = value.toUpperCase(); // Convertir a mayúsculas
    setCode(newCode);

    if (value && index < codeInputsRef.current.length - 1) {
      codeInputsRef.current[index + 1]?.focus(); // Mover al siguiente campo
    } else if (!value && index > 0) {
      codeInputsRef.current[index]?.focus(); // Permanecer en el mismo campo si se borra
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Backspace' && index > 0 && !code[index]) {
      event.preventDefault();
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      codeInputsRef.current[index - 1]?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={handleCloseModal} className={styles.modalCloseIcon}>
          <FaRegTimesCircle />
        </button>

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit}>
            <h1 className={styles.modalTitle}>Confirmación de email</h1>
            <small className={styles.modalSubtitle}>Por favor, ingresa tu email</small>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
              className={styles.modalInput}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className={styles.modalButton}
            >
              {loading ? 'Enviando...' : cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Enviar código'}
            </button>
            
            <hr className={styles.lineSpacingEmail} />
            <small className={styles.textInformation}>Si tienes un problema o algún error, comunicalos a nuestro <Link className={styles.informationLink} href="#">Whatsapp</Link></small>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={handleCodeSubmit}>
            <h2 className={styles.modalTitle}>Verificar código</h2>
            <small className={styles.modalSubtitle}>Ingresa tu código de verificación</small>
            <div className={styles.codeInputContainer}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  ref={(el) => {
                    if (el) codeInputsRef.current[index] = el;
                  }}
                  aria-label={`Dígito ${index + 1}`}
                  className={styles.codeInput}
                />
              ))}
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button
              type="submit"
              disabled={loading || code.some((digit) => !digit)}
              className={styles.modalButton}
            >
              {loading ? 'Verificando...' : 'Verificar código'}
            </button>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={cooldown > 0}
              className={styles.modalSecondaryButton}
            >
              {cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Reenviar código'}
            </button>
          </form>
        )}

        {step === 'resetPassword' && (
          <form onSubmit={handlePasswordReset}>
            <h2 className={styles.modalTitle}>Nueva contraseña</h2>
            <small className={styles.modalSubtitle}>Realiza el cambio nuevo de contraseña</small>
            <p className={styles.NewPasswordTextInput}>Contraseña nueva</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu nueva contraseña"
              required
              className={styles.passwordInput}
            />
            <p className={styles.passwordTextInput}>Confirmar contraseña</p>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder=" Ingresa devuelta la contraseña"
              required
              className={styles.passwordInput}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" disabled={loading} className={styles.modalButton}>
              {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
