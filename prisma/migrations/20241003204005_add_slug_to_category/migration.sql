-- Añadir la columna slug como nullable inicialmente
ALTER TABLE "Category" ADD COLUMN "slug" TEXT;

-- Actualizar las filas existentes con un valor para slug basado en el nombre
UPDATE "Category" SET "slug" = LOWER(REPLACE(REPLACE(name, ' ', '-'), '''', ''));

-- Hacer la columna slug requerida y única
ALTER TABLE "Category" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- Eliminar la columna subcategoryId de Product
ALTER TABLE "Product" DROP COLUMN IF EXISTS "subcategoryId";

-- Añadir la columna status a Product
ALTER TABLE "Product" ADD COLUMN "status" "ProductStatus" NOT NULL DEFAULT 'IN_STOCK';

-- Añadir la columna status a Sale
ALTER TABLE "Sale" ADD COLUMN "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';

-- Eliminar el enum ProductCategory si ya no se usa
DROP TYPE IF EXISTS "ProductCategory";

-- Asegurarse de que la relación entre Product y Category sigue siendo correcta
-- Si es necesario, puedes añadir un campo parentCategoryId a Category
-- ALTER TABLE "Category" ADD COLUMN "parentCategoryId" TEXT;
-- ALTER TABLE "Category" ADD CONSTRAINT "Category_parentCategoryId_fkey" 
--     FOREIGN KEY ("parentCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL;

-- Si necesitas actualizar la relación entre Product y Category
-- UPDATE "Product" SET "categoryId" = (SELECT id FROM "Category" WHERE name = 'Default Category')
-- WHERE "categoryId" IS NULL;

-- Asegúrate de que todos los productos tengan una categoría válida
-- ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

-- Crear los nuevos enums si no existen
DO $$ BEGIN
    CREATE TYPE "ProductStatus" AS ENUM ('IN_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;