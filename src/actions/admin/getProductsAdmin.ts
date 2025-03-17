"use server"

import prisma from "../../lib/prisma"

export type ProductoOrden = {
  id: string
  name: string
  price: number
  stock: number
  imageUrl?: string
  status: string
}

export async function obtenerProductosParaOrden(busqueda?: string, pagina: number = 1, porPagina: number = 5) {
  try {
    const [productos, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          AND: [
            {
              OR: [
                { name: { contains: busqueda, mode: "insensitive" } },
                { description: { contains: busqueda, mode: "insensitive" } },
                { id: { contains: busqueda, mode: "insensitive" } } // Búsqueda por ID
              ]
            },
            { status: "IN_STOCK" },
            { stock: { gt: 0 } },
          ],
        },
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          imageUrl: true,
          status: true,
          images: {
            take: 1,
            select: { url: true },
          },
        },
        orderBy: { name: "asc" },
        skip: (pagina - 1) * porPagina,
        take: porPagina,
      }),
      prisma.product.count({
        where: {
          AND: [
            {
              OR: [
                { name: { contains: busqueda, mode: "insensitive" } },
                { description: { contains: busqueda, mode: "insensitive" } },
                { id: { contains: busqueda, mode: "insensitive" } }
              ]
            },
            { status: "IN_STOCK" },
            { stock: { gt: 0 } },
          ]
        }
      })
    ])

    return {
      productos: productos.map((producto) => ({
        ...producto,
        imageUrl: producto.images[0]?.url || producto.imageUrl || "/placeholder-product.png",
      })) as ProductoOrden[],
      totalPaginas: Math.ceil(total / porPagina),
      paginaActual: pagina
    }
  } catch (error) {
    console.error("Error obteniendo productos:", error)
    return { productos: [], totalPaginas: 0, paginaActual: 1 }
  }
}