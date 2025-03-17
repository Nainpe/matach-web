'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import VerifyBox from './ui/VerfiyBox';
import { resendVerificationEmail } from '../../../actions/auth/resendVerificationEmail';
import MobileNavbar from '../../components/ui/MobileNavbar/MobileNavbar';
import { verifyTokenWithoutIdentifier } from '../../../actions/auth/verifyTokenWithoutIdentifier';
import Footer from '../../components/ui/Footer';
import { Navbar } from '../../components/ui/Navbar';

export default function VerifyPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const [status, setStatus] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  const handleResend = async () => {
    if (!userEmail) return;
    
    const result = await resendVerificationEmail(userEmail);
    setStatus(result.message);
    
    if (result.success) {
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    }
  };

  useEffect(() => {
    const verify = async () => {
      try {
        const result = await verifyTokenWithoutIdentifier(resolvedParams.token);

        if (result.success) {
          setStatus('Email verificado exitosamente. Redirigiendo...');
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
        }
      } catch (error) {
        let errorMessage = 'Error en la verificación';
        
        if (error instanceof Error) {
          errorMessage = error.message;
          if (error.message.includes('expirado')) {
            setUserEmail(error.message.split(': ')[1]);
            setStatus('Token expirado');
            return;
          }
        }
        
        setStatus(errorMessage);
      }
    };

    verify();
  }, [resolvedParams.token, router]);

  return (
    <div>
      <header className="header">
        <div className="show-on-mobile">
          <MobileNavbar />
        </div>
        <div className="show-on-desktop">
          <Navbar />
        </div>
      </header>
      <main className="verify-container">
        <VerifyBox 
          status={status}
          onResend={handleResend}
          userEmail={userEmail}
        />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}