'use client'


import { useSession } from "next-auth/react"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './Navbar.module.css'
import { ShoppingCart, User, Search, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUserMenuStore } from '@/store/UseMenuStore'
import { GoSignOut } from 'react-icons/go'
import { FaUserAlt } from 'react-icons/fa'
import { FiLogIn } from 'react-icons/fi'
import { RiUserAddLine } from 'react-icons/ri'
import { logout } from '@/actions/auth/logout'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const { data: session } = useSession();
  const isAuntheticated = !!session?.user;
  const isAdmin = (session?.user.role === 'Admin');

  

  const cartItems = useCartStore((state) => state.cartItems)
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)

  const { isUserMenuOpen, toggleUserMenu } = useUserMenuStore()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const debounceTimeout = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500)
    return () => clearTimeout(debounceTimeout)
  }, [searchTerm])

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      const formattedSearch = debouncedSearchTerm.trim().replace(/\s+/g, '-').toLowerCase()
      router.push(`/search/${formattedSearch}`)
    }
  }, [debouncedSearchTerm, router])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const toggleSubmenu = (submenuId: string) =>
    setActiveSubmenu(activeSubmenu === submenuId ? null : submenuId)

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  return (
    <header>
      <div className="navbar">
        <div className="main-container">
          <div className="Navbar-container">
            <div className="logo">Mi Marca</div>
            <form className="search-container" onSubmit={(e) => e.preventDefault()}>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  aria-label="Buscar productos"
                />
                <button type="submit" aria-label="Buscar">
                  <Search className="icon" />
                </button>
              </div>
            </form>
            <div className={styles.userIcon} onClick={toggleUserMenu}>
              <User className="icon" size={30} color="#fff" strokeWidth={2} />
              {isUserMenuOpen && (
                <div className={styles.userMenu}>
                  <ul>
                    {

                      !isAuntheticated && (
                        <div>
                          <li><Link href="/auth/registro"><RiUserAddLine /> Registro</Link></li>
                          <li><Link href="/auth/login"><FiLogIn /> Iniciar sesión</Link></li>
                        </div>
                      )


                    }
                  

                    {
                      isAuntheticated && (
                      <div>
                        <li><Link href="/perfil"><FaUserAlt /> Mi Cuenta</Link></li>
                        <li><button onClick={ () => logout() }><GoSignOut /> Cerrar sesión</button></li>
                      </div>
                    
                  )}

                    {
                      isAdmin && (
                        <>
                        <li><Link href="/admin/dashboard">Dashboard</Link></li>
                        
                        </>

                      )
                    
                    
                    
                    }

                  
                  </ul>
                </div>
              )}
            </div>
            <div className={styles.cartIcon}>
              <Link href="/carrito">
                {isClient && totalQuantity > 0 && (
                  <div className={styles.cartCounter}>
                    {totalQuantity}
                  </div>
                )}
                <ShoppingCart className="icon" size={30} color="#fff" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <nav className="categories-navbar">
        <div className="categories-container main-container">
          <div className={`menu-wrapper ${isMenuOpen ? 'active' : ''}`}>
            <button
              className={`menu-button ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-haspopup="true"
              aria-expanded={isMenuOpen ? 'true' : 'false'}
            >
              <span className="menu-text">Categoría de productos</span>
              <ChevronDown className={`chevron-icon ${isMenuOpen ? 'active' : ''}`} />
            </button>
            <div className={`menu-content ${isMenuOpen ? 'active' : ''}`}>
              <ul>
                {[{
                    id: 'submenu1',
                    title: '🖱️ Periféricos',
                    items: ['Teclados', 'Mouses', 'Auriculares', 'Monitores'],
                  },
                  {
                    id: 'submenu2',
                    title: '🖥️ Hardware PC',
                    items: ['Procesadores', 'Motherboard', 'Gabinetes'],
                  },
                  {
                    id: 'submenu3',
                    title: '🕹️ Consolas y juegos',
                    items: ['Consolas', 'Juegos de PS4', 'Juegos de PS5'],
                  },
                ].map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => toggleSubmenu(category.id)}
                      className={activeSubmenu === category.id ? 'active' : ''}
                      aria-expanded={activeSubmenu === category.id ? 'true' : 'false'}
                    >
                      {category.title}
                    </button>
                    <ul className={`submenu ${activeSubmenu === category.id ? 'active' : ''}`}>
                      {category.items.map((item, index) => (
                        <li key={index}>
                          <Link href={`/${category.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}/${encodeURIComponent(item.toLowerCase())}`}>
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
                <li><Link href="/cables-repuestos">🔌 Cables o repuestos</Link></li>
                <li><Link href="/sillas-gamers">Sillas gamers</Link></li>
                <li><Link href="/notebooks">💻 Notebooks</Link></li>
              </ul>
            </div>
          </div>
          <Link href="/sobre-nosotros" className="category-link">Sobre Nosotros</Link>
          <Link href="/ubicacion" className="category-link">Ubicación</Link>
        </div>
      </nav>
    </header>
  )
}

export default Navbar