// app/api/products/search/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Asegúrate de que la ruta de tu instancia de Prisma sea correcta

// Definimos el tipo de request para GET
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name'); // Capturamos el parámetro de búsqueda 'name'

  if (!name) {
    return NextResponse.json({ error: 'El parámetro "name" es requerido' }, { status: 400 });
  }

  try {
    // Búsqueda más flexible usando 'contains' en varios campos
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: name, // Búsqueda parcial en el nombre
              mode: 'insensitive', // Ignora mayúsculas/minúsculas
            },
          },
          {
            description: {
              contains: name, // Búsqueda parcial en la descripción
              mode: 'insensitive',
            },
          },
          {
            brand: {
              name: {
                contains: name, // Búsqueda parcial en la marca
                mode: 'insensitive',
              },
            },
          },
          {
            tags: {
              some: {
                tag: {
                  name: {
                    contains: name, // Búsqueda parcial en las etiquetas
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        images: true, // Asegúrate de que este campo esté bien configurado en tu modelo
        brand: {
          select: {
            name: true,
          },
        },
      },
    });

    // Si no se encuentran productos, retornamos un mensaje amigable
    if (products.length === 0) {
      return NextResponse.json({ message: 'No se encontraron productos que coincidan con la búsqueda' }, { status: 200 });
    }

    // Retornamos los productos encontrados
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error en la búsqueda de productos:', error);
    return NextResponse.json({ error: 'Hubo un error al obtener los productos' }, { status: 500 });
  }
}
