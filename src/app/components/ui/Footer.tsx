"use client";

import React from 'react';

export default function Footer(): JSX.Element {
  return (
    <footer>
      <div className='footer'>
        <div className='footer-content main-container'>
          <div className='box-truck'>


            <div className='box-truck-text'>
              <h3>Hacemos envios</h3>
              <h4>Hacemos envios en todo Santiago del Estero</h4>
            </div>
          </div>

          <div className='box-card'>
            <svg 
              className="icon-card"
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              style={{ fill: 'rgba(0, 0, 0, 1)' }}
            >
              <path d="M20 4H4c-1.103 0-2 .897-2 2v2h20V6c0-1.103-.897-2-2-2zM2 18c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-6H2v6zm3-3h6v2H5v-2z"></path>
            </svg>
            <div className='box-card-text'>
              <h3>Paga como tu quieras</h3>
              <h4>Puedes pagar con la forma que mas te guste</h4>
            </div>
          </div>

          <div className='box-support'>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="50" 
              height="50" 
              viewBox="0 0 24 24" 
              style={{ fill: 'rgba(0, 0, 0, 1)' }}
            >
              <path d="M12 2C6.486 2 2 6.486 2 12v4.143C2 17.167 2.897 18 4 18h1a1 1 0 0 0 1-1v-5.143a1 1 0 0 0-1-1h-.908C4.648 6.987 7.978 4 12 4s7.352 2.987 7.908 6.857H19a1 1 0 0 0-1 1V18c0 1.103-.897 2-2 2h-2v-1h-4v3h6c2.206 0 4-1.794 4-4 1.103 0 2-.833 2-1.857V12c0-5.514-4.486-10-10-10z"></path>
            </svg>
            <div className='box-support-text'>
              <h3>Comunicate con nosotros</h3>
              <h4>Nos podes comunicar en nuestro Whatsapp</h4>
            </div>
          </div>
        </div>


 
        <div className='information-container main-container'>
          <div className='information-column'>
            <h3 className='information-title'>Matach Tech</h3>
            <p className='information-description'>
              ¡Tu leyenda gamer comienza aquí! ⚔️
            </p>
            <p className='information-description'>
              Personaliza tu experiencia de juego con lo último en tecnología. En Matach Tech, encontrarás una amplia variedad de productos para armar tu PC a medida o equipar tu consola.
            </p>
          </div>

          <div className='information-column'>
            <h4 className='information-subtitle'>¿Qué ofrecemos?</h4>
            <ul className='information-list'>
              <li>PC Gamer: Arma tu PC de ensueño con componentes de las mejores marcas.</li>
              <li>Consolas: PlayStation, Xbox, Nintendo y todo lo que necesitas para jugar.</li>
              <li>Accesorios: Teclados, mouse, auriculares y más para optimizar tu rendimiento.</li>
            </ul>
          </div>

          <div className='information-column'>
            <p className='information-footer'>
              ¡Ven a conocer nuestra tienda y descubre el gamer que llevas dentro!
            </p>
            <div className='contact-info'>
              <div className='contact-item'>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="icon icon-tabler icon-tabler-map-pin"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                  <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                </svg>
                <span>[Dirección de tu tienda en Santiago del Estero]</span>
              </div>
              <div className='contact-item'>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="icon icon-tabler icon-tabler-phone"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                </svg>
                <span>[Teléfono]</span>
              </div>
              <div className='contact-item'>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="icon icon-tabler icon-tabler-info-circle"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                  <path d="M12 9h.01" />
                  <path d="M11 12h1v4h1" />
                </svg>
                <span>[Horario de atención]</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
