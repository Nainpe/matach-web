import { Toaster } from 'react-hot-toast';
import { Provider } from './components/ui/provider/Provider';
import './globals.css';
import { Outfit } from 'next/font/google'; // Importamos la fuente

const outfit = Outfit({
  subsets: ['latin'], // Subconjuntos necesarios
  weight: ['400', '500', '600', '700'], // Pesos de la fuente
  variable: '--font-outfit', // Variable CSS para la fuente
});

export const metadata = {
  title: 'Matach',
  description: 'La mejor tienda en línea',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={outfit.variable}>
      <body>
        <Provider>
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#28a745',
                },
              },
              error: {
                style: {
                  background: '#dc3545',
                },
              },
            }}
          />
          {children}
        </Provider>
      </body>
    </html>
  );
}
