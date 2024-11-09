
import { Provider } from './components/ui/provider/Provider';
import './globals.css';

export const metadata = {
  title: 'Matach',
  description: 'La mejor tienda en línea',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {


  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="outfit"> 
        <Provider>
        {children}  
        </Provider>
      </body>
    </html>
  );
}
