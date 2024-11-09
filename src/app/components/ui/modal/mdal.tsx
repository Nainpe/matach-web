import styles from '../modal/modal.module.css'; // Importando el CSS Module

interface ProductInstallmentsModalProps {
  product: {
    price: number;
    name: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const ProductInstallmentsModal: React.FC<ProductInstallmentsModalProps> = ({ product, isOpen, onClose }) => {
  if (!isOpen) return null;

  const calculateInstallments = (months: number) => {
    return (product.price / months).toFixed(2);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Cuotas para {product.name}</h2>
        <ul>
          <li>3 cuotas de: ${calculateInstallments(3)}</li>
          <li>6 cuotas de: ${calculateInstallments(6)}</li>
          <li>10 cuotas de: ${calculateInstallments(10)}</li>
          <li>12 cuotas de: ${calculateInstallments(12)}</li>
        </ul>
        <button className={styles.closeButton} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ProductInstallmentsModal;
