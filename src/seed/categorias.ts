import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

async function main() {
  const categories = [
    {
      title: '🖱️ Perifericos',
      items: ['Teclados', 'Mouses', 'Auriculares', 'Monitores', 'Joystick', 'Impresoras', 'Cámaras', 'Micrófonos', 'Alfombras', 'Kit gamers', 'Otros'],
    },
    {
      title: '🖥️ Hardware PC',
      items: ['Procesadores', 'Motherboard', 'Gabinetes', 'Placas de video', 'Discos Duros HDD', 'Discos Solidos SSD', 'Memorias RAM', 'Fuentes'],
    },
    {
      title: '🕹️ Consolas y juegos',
      items: ['Consolas', 'Juegos de PS4', 'Juegos de PS5', 'Tarjetas de regalos', 'Accesorios', 'Juegos de XBOX'],
    },
    {
      title: '🔌 Cables o repuestos',
      items: [],
    },
    {
      title: 'Sillas gamers',
      items: [],
    },
    {
      title: '💻 Notebooks',
      items: [],
    },
  ]

  for (const category of categories) {
    const mainCategory = await prisma.category.create({
      data: {
        name: category.title,
        slug: generateSlug(category.title),
      },
    })

    console.log(`Created main category: ${mainCategory.name}`)

    for (const item of category.items) {
      const subCategory = await prisma.category.create({
        data: {
          name: item,
          slug: generateSlug(item),
          parentCategoryId: mainCategory.id,
        },
      })

      console.log(`Created subcategory: ${subCategory.name} under ${mainCategory.name}`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })