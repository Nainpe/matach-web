import { Navbar } from "@/app/components/ui/Navbar";
import RegisterForm from "../ui/Register";
import Footer from "@/app/components/ui/Footer";
import MobileNavbar from "@/app/components/ui/MobileNavbar/MobileNavbar";

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
