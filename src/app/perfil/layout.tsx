import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import styles from "./ui/ProfileLayout.module.css";
import ProfileSidebar from "./ui/ProfileSidebar";
import { Navbar } from "../components/ui/Navbar";
import MobileNavbar from "../components/ui/MobileNavbar/MobileNavbar";
import Footer from "../components/ui/Footer";
import MobileProfileNavbar from "./ui/MobileProfileNavbar";
import UserStats from "./ui/UserStat";

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Si no hay sesión, redirige a inicio o login
  if (!session?.user) {
    redirect("/");
  }

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
      <main className={styles.maincontainer}>
        <div className="main-container">
          <div className={styles.layoutBox}>
        
            <div className={styles.profileNavbar}>
              <MobileProfileNavbar />
            </div>
 
            
            <div className={styles.profileSidebar}>
              <ProfileSidebar />  

            </div>
    

          {children}
          </div>
          <UserStats/>
        </div>
      </main>
      <Footer />
    </div>
  );
}
