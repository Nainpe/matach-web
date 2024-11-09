import Link from 'next/link';
import React from 'react';
import { Navbar } from './components/ui/Navbar';
import './globals.css';
import CustomSlider from './components/ui/CustomSlider';
import CategorySection from './components/ui/CategorySection';
import CarouselCard from './components/ui/CarouselCard';
import Footer from './components/ui/Footer';
import MobileNavbar from './components/ui/MobileNavbar/MobileNavbar';
import Marketingimage from './components/ui/Marketing -image';

const Home = () => {
  return (
    <html lang="es"> {/* Asegúrate de incluir el atributo lang */}
      <body className="outfit"> {/* Aplica la clase 'outfit' al body */}
        <header className='header'>
          {/* Descomentar según sea necesario */}
          {/* <div className='show-on-mobile'>
              <MobileNavbar />
            </div> */}
            
          {/* <div className='show-on-desktop'>
              <Navbar/>
            </div> */}
        </header>
        <main>
          <CustomSlider />
          <CategorySection />
          <h3 className='text-carrousel main-container'>Nuevos ingresos</h3>
          <CarouselCard />
          <Marketingimage />
          <Footer />
        </main>
      </body>
    </html>
  );
};

export default Home;
