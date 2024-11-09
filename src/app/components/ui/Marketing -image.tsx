import Image from 'next/image';
import Link from 'next/link';

export default function Marketingimage() {
  return (
    <div className='marketing-img main-container'>
      <Link href="#" passHref>
          <Image
            src="/images/Marking.png" // Asegúrate de colocar la imagen en la carpeta public/images
            alt="Marketing Image"
            width={1200} // Ajusta el tamaño según sea necesario
            height={127} // Ajusta el tamaño según sea necesario
          />
      </Link>
    </div>
  );
}