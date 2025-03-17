import Footer from "../../components/ui/Footer";
import MobileNavbar from "../../components/ui/MobileNavbar/MobileNavbar";
import { Navbar } from "../../components/ui/Navbar";
import RegisterForm from "../ui/Register";


export default function registro() {
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

      <main>
      <RegisterForm />
      </main>

      <Footer />
    </div>
  )
}
