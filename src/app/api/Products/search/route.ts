import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name'); 

  if (!name) {
    return NextResponse.json({ error: 'El parámetro "name" es requerido' }, { status: 400 });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: name, 
              mode: 'insensitive', 
            },
          },
          {
            description: {
              contains: name, 
              mode: 'insensitive',
            },
          },
          {
            brand: {
              name: {
                contains: name, 
                mode: 'insensitive',
              },
            },
          },
          {
            tags: {
              some: {
                tag: {
                  name: {
                    contains: name, 
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
        images: true, 
        brand: {
          select: {
            name: true,
          },
        },
      },
    });

    if (products.length === 0) {
      return NextResponse.json({ message: 'No se encontraron productos que coincidan con la búsqueda' }, { status: 200 });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error en la búsqueda de productos:', error);
    return NextResponse.json({ error: 'Hubo un error al obtener los productos' }, { status: 500 });
  }
}
