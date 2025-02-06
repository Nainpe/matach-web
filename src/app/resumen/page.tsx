import Footer from "../components/ui/Footer";
import MobileNavbar from "../components/ui/MobileNavbar/MobileNavbar";
import { Navbar } from "../components/ui/Navbar";
import ResumenPedido from "./ui/ResumenPedido";

export default function Resumen() {
  return (
    <div>

<header className='header'>
      <div className='show-on-mobile'>
          <MobileNavbar />
        </div>
         
         <div className='show-on-desktop'>
          <Navbar/>
        </div> 
        
      </header>


      <main className='page-resumen-main'>
         <ResumenPedido />
      </main>
     


      <Footer />
    </div>
  );
}
