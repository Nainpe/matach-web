'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Importa useParams
import ProductModal from '../ProductModal/ProductModal';
import { FaRegCreditCard } from 'react-icons/fa';

interface Producto {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export default function CardPaymentPage() {
    const { slug } = useParams(); // Obtiene el slug de los parámetros de la URL
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [product, setProduct] = useState<Producto | null>(null);
    const [installmentOptions, setInstallmentOptions] = useState<{ months: number; amount: number; hasInterest: boolean; }[]>([]);

    useEffect(() => {
      const fetchProduct = async () => {
          try {
              const response = await fetch(`/api/Products/${slug}`);
              const data = await response.json();
  
              console.log('Respuesta del producto:', data.product); // Verificar qué se recibe
  
              if (data.product) {
                  const price = data.product.price;
  
                  // Verifica que price sea un número
                  if (typeof price === 'number' && !isNaN(price)) {
                      setProduct(data.product);
  
                      // Calcular cuotas basadas en el precio
                      const newInstallmentOptions = [
                        { months: 3, amount: (price * 1.10) / 3, hasInterest: true }, // 3 cuotas con 10% de interés
                        { months: 6, amount: (price * 1.10) / 6, hasInterest: true }, // 6 cuotas con 10% de interés
                        { months: 9, amount: (price * 1.10) / 9, hasInterest: true }, // 9 cuotas con 10% de interés
                        { months: 12, amount: (price * 1.20) / 12, hasInterest: true }, // 12 cuotas con 20% de interés
                      ];
  
                      setInstallmentOptions(newInstallmentOptions);
                  } else {
                      console.error('El precio no es un número válido:', price);
                  }
              }
          } catch (error) {
              console.error('Error al obtener el producto:', error);
          }
      };
  
      fetchProduct();
  }, [slug]);
  
    if (!product) {
        return <div>Cargando producto...</div>; // Puedes mostrar un spinner o algo similar
    }

    return (
      <div className='card-payments-container'>
        <div className='card-payments'>
          <div className='icon-title-container'>
            <FaRegCreditCard  className='icon-card-payment'/>
            <div className="title-subtitle">
              <h2>Métodos de pagos y cuotas</h2>
              <button 
                className="modal-button"
                onClick={() => setIsModalOpen(true)}
              >
                Ver opciones de cuotas
              </button>
            </div>
          </div>

          <ProductModal 
            product={{ id: product.id, price: product.price }} // Pasar el objeto completo
            installmentOptions={installmentOptions} // Pasar las opciones de cuotas dinámicas
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

          <div className='payments-logo'>
            <img className='payments-logos' src="/logos/visa-logo.svg" alt="Logo de Visa" width={40} height={30} />
            <img className='payments-logos' src="/logos/Mercadopago.svg" alt="Logo de Mercado Pago" width={50} height={30} />
            <img className='payments-logos' src="/logos/american-express-logo.jpg" alt="Logo de Amercian Express" width={40} height={30} />
            <img className='payments-logos' src="/logos/ma_symbol.svg" alt="Logo de Mastercard" width={40} height={30} />
          </div>
        </div>
      </div>
    )
}
