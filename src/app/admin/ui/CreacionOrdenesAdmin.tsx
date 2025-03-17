"use client"

import { useEffect, useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { MdChevronRight, MdChevronLeft } from "react-icons/md"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import styles from "./CreacionOrdenesAdmin.module.css"
import useOrderForms, { type ClientData } from "../../../store/useOrderForms"
import { obtenerProductosParaOrden } from "../../../actions/admin/getProductsAdmin"
import { crearOrdenAdmin } from "../../../actions/admin/ordenAdmin"

interface ProductoOrden {
  id: string
  name: string
  price: number
  stock: number
  imageUrl?: string
  status: string
}

export default function CreacionOrdenesAdmin() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productos, setProductos] = useState<ProductoOrden[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [cantidades, setCantidades] = useState<{ [key: string]: number }>({})

  const {
    currentStep,
    steps,
    goNextStep,
    goPrevStep,
    setCurrentStep,
    clientData,
    setClientData,
    agregarProductoOrden,
    productosSeleccionados,
    eliminarProducto,
    resetForm
  } = useOrderForms()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientData>({
    defaultValues: clientData,
  })

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const { productos: datos, totalPaginas } = 
          await obtenerProductosParaOrden(busqueda, paginaActual, 5)
        
        const productosCombinados = datos.map(producto => ({
          ...producto,
          agregado: productosSeleccionados.some(p => p.id === producto.id)
        }))
        
        setProductos(productosCombinados)
        setTotalPaginas(totalPaginas)
      } catch (err) {
        console.error("Error cargando productos:", err)
      }
    }

    const debounce = setTimeout(() => cargarProductos(), 150)
    return () => clearTimeout(debounce)
  }, [busqueda, paginaActual, productosSeleccionados])

  const manejarCambioCantidad = (productoId: string, cantidad: number) => {
    setCantidades(prev => ({
      ...prev,
      [productoId]: Math.max(1, Math.min(cantidad, productos.find(p => p.id === productoId)?.stock || 1))
    }))
  }

  const manejarAgregarProducto = (producto: ProductoOrden) => {
    const cantidad = cantidades[producto.id] || 1
    if (producto.stock >= cantidad) {
      agregarProductoOrden({
        id: producto.id,
        name: producto.name,
        price: producto.price,
        quantity: cantidad,
        imageUrl: producto.imageUrl,
        stock: producto.stock
      })
    }
  }

  const onSubmit: SubmitHandler<ClientData> = (data) => {
    setClientData(data)
    goNextStep()
  }

  const handleFinalizarOrden = async () => {
    setIsSubmitting(true)
    try {
      const response = await crearOrdenAdmin(clientData, productosSeleccionados)
      if (response.ok) {
        toast.success(`Orden creada exitosamente`)
        resetForm()
        router.push("/admin/dashboard/ventas")
      } else {
        toast.error(response.message || "Error al crear la orden")
      }
    } catch (error) {
      toast.error("Error inesperado al procesar la orden")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.CreacionOrdenesAdminContainer}>
      <div className={styles.CreacionOrdenesAdminHeader}>
        <h2 className={styles.Title}>Creación de órdenes</h2>
      </div>

      <div className={styles.OrderSteps}>
        {steps.map((step, index) => (
          <div
            key={step}
            className={`${styles.Step} ${index === currentStep ? styles.Active : ""} ${styles.ClickableStep}`}
            onClick={() => setCurrentStep(index)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === "Enter" && setCurrentStep(index)}
          >
            {step}
            {index < steps.length - 1 && <MdChevronRight className={styles.StepSeparator} />}
          </div>
        ))}
      </div>


      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.FormContainer}>
          {currentStep === 0 && (
            <>
              <div className={styles.InputGroup}>
                <label htmlFor="nombre" className={styles.Label}>
                  Nombre del Cliente
                  {errors.nombre && <span className={styles.ErrorMessage}> * Campo requerido</span>}
                </label>
                <input
                  type="text"
                  id="nombre"
                  className={`${styles.Input} ${errors.nombre ? styles.InputError : ""}`}
                  placeholder="Ingrese el nombre del cliente"
                  {...register("nombre", { required: true })}
                />
              </div>

              <div className={styles.InputGroup}>
                <label htmlFor="telefono" className={styles.Label}>
                  Número de Teléfono
                  {errors.telefono && <span className={styles.ErrorMessage}> * Campo requerido</span>}
                </label>
                <input
                  type="tel"
                  id="telefono"
                  className={`${styles.Input} ${errors.telefono ? styles.InputError : ""}`}
                  placeholder="Ingrese el número de teléfono"
                  {...register("telefono", { required: true })}
                />
              </div>

              <div className={styles.InputGroup}>
                <label htmlFor="dni" className={styles.Label}>
                  DNI
                  {errors.dni && <span className={styles.ErrorMessage}> * Campo requerido</span>}
                </label>
                <input
                  type="text"
                  id="dni"
                  className={`${styles.Input} ${errors.dni ? styles.InputError : ""}`}
                  placeholder="Ingrese el DNI del cliente"
                  {...register("dni", { required: true })}
                />
              </div>

              <div className={styles.InputGroup}>
                <label htmlFor="mesa" className={styles.Label}>
                  Número de Mesa
                </label>
                <input
                  type="number"
                  id="mesa"
                  className={styles.Input}
                  placeholder="Ingrese el número de mesa"
                  {...register("mesa")}
                />
              </div>

              <div className={styles.TakeAwayContainer}>
                <label className={styles.TakeAwayLabel} htmlFor="takeAway">
                  Para llevar
                </label>
                <label className={styles.ToggleSwitch}>
                  <input type="checkbox" id="takeAway" className={styles.TakeAwayCheckbox} {...register("takeAway")} />
                  <span className={`${styles.Slider} ${styles.Round}`}></span>
                </label>
              </div>
            </>
          )}

          {currentStep === 1 && (
            <div className={styles.ProductsStepContainer}>
              <div className={styles.SearchContainer}>
                <input
                  type="text"
                  placeholder="Buscar por nombre o ID..."
                  className={styles.SearchInput}
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value)
                    setPaginaActual(1)
                  }}
                />
              </div>

              <div className={styles.ProductList}>
                <table className={styles.ProductsTable}>
                  <thead>
                    <tr className={styles.TableHeaderRow}>
                      <th className={styles.ImagenHeader}></th>
                      <th className={styles.IDHeader}>ID</th>
                      <th className={styles.NombreHeader}>Producto</th>
                      <th className={styles.PrecioHeader}>Precio</th>
                      <th className={styles.StockHeader}>Stock</th>
                      <th className={styles.AccionHeader}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((producto) => {
                      const productoAgregado = productosSeleccionados.find(p => p.id === producto.id)
                      const cantidadAgregada = productoAgregado?.quantity || 0
                      const stockDisponible = producto.stock - cantidadAgregada

                      return (
                        <tr key={producto.id} className={styles.TableRow}>
                          <td className={styles.ImagenCell}>
                            <div className={styles.ProductImageContainer}>
                              <Image
                                src={producto.imageUrl || "/placeholder-product.png"}
                                alt={producto.name}
                                width={90}
                                height={90}
                                className={styles.ProductImage}
                              />
                            </div>
                          </td>
                          <td className={styles.IDCell}>{producto.id}</td>
                          <td className={styles.NombreCell}>{producto.name}</td>
                          <td className={styles.PrecioCell}>
                            ${producto.price.toLocaleString("es-AR")}
                          </td>
                          <td className={styles.StockCell}>
                            {stockDisponible} / {producto.stock}
                          </td>
                          <td className={styles.AccionCell}>
                            {productoAgregado ? (
                              <div className={styles.AgregadoContainer}>
                                <span className={styles.CantidadAgregada}>
                                  Agregados: {cantidadAgregada}
                                </span>
                                <button
                                  type="button"
                                  className={styles.EliminarButton}
                                  onClick={() => eliminarProducto(producto.id)}
                                >
                                  Quitar
                                </button>
                              </div>
                            ) : (
                              <div className={styles.CantidadContainer}>
                                <input
                                  type="number"
                                  min="1"
                                  max={stockDisponible}
                                  value={cantidades[producto.id] || 1}
                                  onChange={(e) => manejarCambioCantidad(producto.id, parseInt(e.target.value))}
                                  className={styles.CantidadInput}
                                />
                                <button
                                  type="button"
                                  className={styles.AddProductButton}
                                  onClick={() => manejarAgregarProducto(producto)}
                                  disabled={stockDisponible < 1}
                                >
                                  {stockDisponible > 0 ? "Agregar" : "Sin stock"}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className={styles.PaginationControls}>
                <button
                  type="button"
                  onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                  disabled={paginaActual === 1}
                >
                  <MdChevronLeft />
                </button>
                
                <span>Página {paginaActual} de {totalPaginas}</span>
                
                <button
                  type="button"
                  onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                  disabled={paginaActual === totalPaginas}
                >
                  <MdChevronRight />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.ResumenContainer}>
              <h3>Resumen de la Orden</h3>
              
              {/* Sección de Datos del Cliente */}
              <div className={styles.ResumenSeccion}>
                <h4>Datos del Cliente</h4>
                <div className={styles.ResumenDatos}>
                  <div className={styles.ResumenFila}>
                    <span className={styles.ResumenLabel}>Nombre:</span>
                    <span className={styles.ResumenValor}>{clientData.nombre}</span>
                  </div>
                  <div className={styles.ResumenFila}>
                    <span className={styles.ResumenLabel}>Teléfono:</span>
                    <span className={styles.ResumenValor}>{clientData.telefono}</span>
                  </div>
                  <div className={styles.ResumenFila}>
                    <span className={styles.ResumenLabel}>DNI:</span>
                    <span className={styles.ResumenValor}>{clientData.dni}</span>
                  </div>
                  <div className={styles.ResumenFila}>
                    <span className={styles.ResumenLabel}>Mesa:</span>
                    <span className={styles.ResumenValor}>{clientData.mesa || 'No especificada'}</span>
                  </div>
                  <div className={styles.ResumenFila}>
                    <span className={styles.ResumenLabel}>Para llevar:</span>
                    <span className={styles.ResumenValor}>
                      {clientData.takeAway ? '✅ Sí' : '❌ No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sección de Productos */}
              <div className={styles.ResumenSeccion}>
                <h4>Productos Seleccionados</h4>
                <div className={styles.ResumenProductos}>
                  <div className={styles.ResumenProductosHeader}>
                    <span>Producto</span>
                    <span>Cantidad</span>
                    <span>Precio Unitario</span>
                    <span>Subtotal</span>
                  </div>
                  {productosSeleccionados.map((producto) => (
                    <div key={producto.id} className={styles.ResumenProducto}>
                      <div className={styles.ResumenProductoInfo}>
                        <div className={styles.ResumenImagen}>
                          <Image
                            src={producto.imageUrl || "/placeholder-product.png"}
                            alt={producto.name}
                            width={60}
                            height={60}
                          />
                        </div>
                        <span className={styles.ResumenProductoNombre}>{producto.name}</span>
                      </div>
                      <span className={styles.ResumenCantidad}>{producto.quantity}</span>
                      <span className={styles.ResumenPrecio}>
                        ${producto.price.toLocaleString("es-AR")}
                      </span>
                      <span className={styles.ResumenSubtotal}>
                        ${(producto.price * producto.quantity).toLocaleString("es-AR")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className={styles.TotalContainer}>
                <div className={styles.TotalFila}>
                  <span className={styles.TotalLabel}>Total:</span>
                  <span className={styles.TotalMonto}>
                    $
                    {productosSeleccionados
                      .reduce((total, p) => total + (p.price * p.quantity), 0)
                      .toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>


        <div className={styles.NavigationButtons}>
          {currentStep > 0 && (
            <button 
              type="button" 
              className={styles.PreviousButton} 
              onClick={goPrevStep}
              disabled={isSubmitting}
            >
              <MdChevronLeft /> Anterior
            </button>
          )}

          <button
            type={currentStep === 0 ? "submit" : "button"}
            className={styles.NextButton}
            onClick={currentStep !== steps.length - 1 ? goNextStep : handleFinalizarOrden}
            disabled={
              isSubmitting || 
              (currentStep === 1 && productosSeleccionados.length === 0) ||
              (currentStep === 2 && isSubmitting)
            }
          >
            {isSubmitting ? (
              <div className={styles.LoadingSpinner} />
            ) : (
              <>
                {currentStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
                {currentStep < steps.length - 1 && <MdChevronRight />}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}