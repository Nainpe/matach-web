'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LuUpload, LuTrash2 } from 'react-icons/lu';
import styles from './UploadImage.module.css';

export default function UploadImage() {
  const [image, setImage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  return (
    <div className={styles.UploadImageContainer}>
      <h3 className={styles.InfoTitle}>Comprobante de Pago</h3>
      
      {!image && (
        <div 
          className={styles.UploadImageBox}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <LuUpload />
          <p className={styles.UploadImageText}>Arrastra y suelta tu comprobante aquí o</p>
          <label className={styles.UploadButton}>
            Seleccionar archivo
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </label>
        </div>
      )}

      {image && (
        <div className={styles.ImageWrapper} 
             onMouseEnter={() => setIsHovered(true)} 
             onMouseLeave={() => setIsHovered(false)}
        >
          <Image 
            src={image} 
            alt="Comprobante" 
            layout="responsive"
            width={1000} 
            height={1000} 
            className={styles.PreviewImage} 
          />
          <button 
            className={styles.DeleteButton} 
            onClick={handleRemoveImage} 
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            <LuTrash2 size={20} /> Eliminar
          </button>
        </div>
      )}

      {image && (
        <button className={styles.SubmitButton}>
          Enviar Comprobante
        </button>
      )}
    </div>
  );
}
