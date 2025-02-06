'use client';

import { FiMail, FiCheckCircle } from 'react-icons/fi';
import { BiLoaderAlt, BiErrorCircle } from 'react-icons/bi';
import styles from './VerfiyBox.module.css';

interface VerifyBoxProps {
  status: string | null;
  onResend?: () => void;
  userEmail?: string | null;
}

export default function VerifyBox({ status, onResend, userEmail }: VerifyBoxProps) {
  return (
    <div className={styles.verifyBox}>
      {status === null && (
        <>
          <div className={styles.circleBackground}>
            <FiMail className={styles.icon} /> 
          </div>
          <h1 className={styles.title}>Verificación de Correo Electrónico</h1>
          <p className={styles.message}>
            Estamos verificando tu dirección de correo electrónico. Por favor, espera un momento.
          </p>
          <BiLoaderAlt className={styles.loader} />
        </>
      )}

      {status === 'Email verificado exitosamente. Redirigiendo...' && (
        <>
          <div className={styles.circleBackground}>
            <FiCheckCircle className={styles.iconSuccess} />
          </div>
          <h1 className={styles.title}>¡Verificación Exitosa!</h1>
          <p className={styles.message}>
            Tu correo electrónico ha sido verificado correctamente. Serás redirigido en breve.
          </p>
        </>
      )}

      {status === 'Token expirado' && (
        <>
          <div className={styles.circleBackground}>
            <BiErrorCircle className={styles.iconError} />
          </div>
          <h1 className={styles.title}>Token Expirado</h1>
          <p className={styles.message}>
            El enlace de verificación ha caducado. ¿Quieres recibir un nuevo código?
          </p>
          <button 
            onClick={onResend}
            className={styles.resendButton}
            disabled={!userEmail}
          >
            Reenviar código a {userEmail}
          </button>
        </>
      )}

      {status && !['Email verificado exitosamente. Redirigiendo...', 'Token expirado'].includes(status) && (
        <>
          <div className={styles.circleBackground}>
            <BiErrorCircle className={styles.iconError} />
          </div>
          <h1 className={styles.title}>Error en la Verificación</h1>
          <p className={styles.message}>{status}</p>
        </>
      )}
    </div>
  );
}