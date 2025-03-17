'use client';

import styles from './OrderTable.module.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState, useCallback, useRef } from 'react';
import { OrderStatus, PaymentStatus, DeliveryStatus, PaymentType } from '@prisma/client';
import { BsThreeDots, BsStar, BsStarFill } from 'react-icons/bs';
import { FaEdit, FaFileDownload, FaInfoCircle, FaTrashAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useMenuAdminStore } from '../../../store/menuAdminStore';
import { getOrdersAdmin } from '../../../actions/admin/getOrdersAdmin';
import { deleteOrder } from '../../../actions/admin/deleteOrder';
import { updateOrderStar } from '../../../actions/admin/updateOrderStar';

interface Order {
    seleccion: string;
    fecha: string;
    codigo: string;
    cliente: string;
    email: string;
    subtotal: string;
    total: string;
    productos: string;
    detalles: string;
    estado: OrderStatus;
    deliveryStatus: DeliveryStatus;
    paymentStatus: PaymentStatus;
    paymentType: PaymentType;
    acciones: string;
    orderId: string;
    isPickup?: boolean;
    shippingAddress: string | null;
    fullAddress: string | null;
    paymentMethod: PaymentType;
    isStarred: boolean;
}

const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
        PENDING: 'Pendiente',
        APPROVED: 'Aprobado',
        CANCELLED: 'Cancelado',
        DELIVERED: 'Entregado',
    };
    return statusMap[status] || status;
};

const formatPaymentType = (paymentType: string) => {
    const paymentMap: Record<string, string> = {
        TRANSFERENCIA: 'Transferencia',
        CUOTAS: 'Cuotas',
    };
    return paymentMap[paymentType] || paymentType;
};

export default function OrderTable() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [tempSearch, setTempSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
    const [paymentFilter, setPaymentFilter] = useState<PaymentType | ''>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);
    
    const { isMenuOpen, selectedOrderId, toggleMenu } = useMenuAdminStore();
    const menuRefs = useRef<(HTMLDivElement | null)[]>([]);

    const fetchOrders = useCallback(async () => {
        try {
            const fetchedOrders = await getOrdersAdmin({
                page: currentPage,
                pageSize,
                searchQuery,
                statusFilter,
                paymentFilter,
                startDate,
                endDate,
            });
    
            // Mapeo corregido
            const mappedOrders = fetchedOrders.orders.map(order => ({
                ...order,
                shippingAddress: order.shippingAddress || null, // Si el campo existe
                fullAddress: order.fullAddress || null,
                paymentMethod: order.paymentMethod || PaymentType.TRANSFERENCIA,
                isPickup: order.isPickup || false
            }));
    
            setOrders(mappedOrders);
            setTotalOrders(fetchedOrders.totalOrders);
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.error("Error fetching orders:", e.message);
            } else {
                console.error("Error desconocido al obtener órdenes");
            }
        }
    }, [currentPage, pageSize, searchQuery, statusFilter, paymentFilter, startDate, endDate]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!menuRefs.current.some(ref => ref && ref.contains(event.target as Node))) {
                toggleMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [toggleMenu]); // Añadida dependencia

    const handleSelectOrder = (orderId: string) => {
        setSelectedOrders(prev => 
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const toggleStar = async (orderId: string) => {
        try {
            const originalOrders = [...orders];
            
            // Actualización optimista
            const updatedOrders = orders.map(order => 
                order.orderId === orderId 
                    ? { ...order, isStarred: !order.isStarred }
                    : order
            );
            setOrders(updatedOrders);

            // Enviar cambio al servidor
            const { success } = await updateOrderStar(orderId, !orders.find(o => o.orderId === orderId)?.isStarred);
            
            if (!success) {
                // Revertir si hay error
                setOrders(originalOrders);
            }
        } catch (error) {
            console.error('Error cambiando estado de favorito:', error);
        }
    };

    const toggleStarSelected = async () => {
        try {
            await Promise.all(selectedOrders.map(id => {
                const order = orders.find(o => o.orderId === id);
                return order ? updateOrderStar(id, !order.isStarred) : Promise.resolve();
            }));
            
            await fetchOrders();
        } catch (error) {
            console.error('Error actualizando favoritos:', error);
        }
    };

    const handleDeleteSelected = async () => {
        const confirmation = confirm('¿Estás seguro de eliminar las órdenes seleccionadas?');
        if (confirmation) {
            try {
                await Promise.all(selectedOrders.map(id => deleteOrder(id)));
                await fetchOrders();
                setSelectedOrders([]);
            } catch (error) {
                alert('Error eliminando órdenes');
            }
        }
    };

    const handleActionClick = (orderId: string, index: number) => {
        if (selectedOrderId === orderId && isMenuOpen) {
            toggleMenu();
        } else {
            toggleMenu(orderId);
            menuRefs.current.forEach((ref, i) => {
                if (i !== index && ref) {
                    ref.classList.remove(styles.menuOpen);
                }
            });
        }
    };

    const handleEdit = (orderId: string) => {
        toggleMenu();
        router.push(`/admin/orders/${orderId}`);
    };

    const handleDelete = async (orderId: string) => {
        toggleMenu();
        const confirmation = confirm('¿Estás seguro de eliminar esta orden?');
        if (confirmation) {
            try {
                const result = await deleteOrder(orderId);
                if (result.success) {
                    fetchOrders();
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error('Error eliminando orden:', error);
                alert('Error eliminando la orden');
            }
        }
    };

    const handleViewDetails = (orderId: string) => {
        toggleMenu();
        router.push(`/admin/orders/detail/${orderId}`);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempSearch(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setSearchQuery(tempSearch.trim());
            setCurrentPage(1);
        }
    };

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value as OrderStatus || '');
        setCurrentPage(1);
    };

    const handlePaymentFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPaymentFilter(e.target.value as PaymentType || '');
        setCurrentPage(1);
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        setCurrentPage(1);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleExportExcel = useCallback(() => {
        const wb = XLSX.utils.book_new();
        const wsData = orders.map((order) => [
            order.seleccion,
            order.fecha,
            order.codigo,
            order.cliente,
            order.email,
            order.subtotal,
            order.total,
            order.productos,
            order.detalles,
            formatStatus(order.estado),
            order.deliveryStatus,
            order.paymentStatus,
            formatPaymentType(order.paymentType),
        ]);
        const ws = XLSX.utils.aoa_to_sheet([
            ["Seleccion", "Fecha", "Codigo", "Cliente", "Email", "Subtotal", "Total", "Productos", "Detalles", "Estado", "Delivery Status", "Payment Status", "Payment Type"],
            ...wsData,
        ]);
        XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
        XLSX.writeFile(wb, 'ventas-orders.xlsx');
    }, [orders]);

    const handleExportPdf = useCallback(() => {
        const doc = new jsPDF();
        doc.text("Lista de Ventas", 10, 10);

        const headRows = [["Seleccion", "Fecha", "Codigo", "Cliente", "Email", "Subtotal", "Total", "Productos", "Detalles", "Estado", "Delivery Status", "Payment Status", "Payment Type"]];
        const bodyRows = orders.map((order) => [
            order.seleccion,
            order.fecha,
            order.codigo,
            order.cliente,
            order.email,
            order.subtotal,
            order.total,
            order.productos,
            order.detalles,
            formatStatus(order.estado),
            order.deliveryStatus,
            order.paymentStatus,
            formatPaymentType(order.paymentType),
        ]);

        // @ts-expect-error - La librería tiene tipos incorrectos
        doc.autoTable({
            head: headRows,
            body: bodyRows,
        });

        doc.save('ventas-orders.pdf');
    }, [orders]);

    return (
        <div className={styles.orderTableContainer}>
            <div className={styles.orderTableHeader}>
                <div className={styles.titleWrapper}>
                    <h1 className={styles.orderTableTitle}>Ventas</h1>
                    {selectedOrders.length > 0 && (
                        <div className={styles.bulkActions}>
                            <button 
                                className={styles.starButton}
                                onClick={toggleStarSelected}
                            >
                                {selectedOrders.some(id => orders.find(o => o.orderId === id)?.isStarred) ? (
                                    <BsStarFill className={styles.starIcon} />
                                ) : (
                                    <BsStar className={styles.starIcon} />
                                )}
                                <span>Marcar selección</span>
                            </button>
                            <button 
                                className={styles.deleteButton}
                                onClick={handleDeleteSelected}
                            >
                                Eliminar selección ({selectedOrders.length})
                            </button>
                        </div>
                    )}
                </div>
                <div className={styles.headerButtons}>
                    <button className={`${styles.exportButton}`} onClick={handleExportExcel}>
                        <FaFileDownload /> Descargar Excel
                    </button>
                    <button className={`${styles.exportButton}`} onClick={handleExportPdf}>
                        <FaFileDownload /> Descargar PDF
                    </button>
                    <button className={styles.createOrderButton}>Crear pedido</button>
                </div>
            </div>



            <div className={styles.filtersAndSearch}>
                <div className={styles.searchContainer}>
                    <label htmlFor="orderSearch" className={styles.searchLabel}>Buscar por ID:</label>
                    <input
                        type="text"
                        id="orderSearch"
                        placeholder="Buscar orden por ID..."
                        className={styles.searchInput}
                        value={tempSearch}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyPress}
                    />
                </div>

                <div className={styles.filterWrapper}>
                    <label htmlFor="startDate" className={styles.filterLabel}>Desde:</label>
                    <input
                        type="date"
                        id="startDate"
                        className={styles.filterSelect}
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                </div>

                <div className={styles.filterWrapper}>
                    <label htmlFor="endDate" className={styles.filterLabel}>Hasta:</label>
                    <input
                        type="date"
                        id="endDate"
                        className={styles.filterSelect}
                        value={endDate}
                        onChange={handleEndDateChange}
                    />
                </div>

                <div className={styles.filterWrapper}>
                    <label htmlFor="statusFilter" className={styles.filterLabel}>Estado:</label>
                    <select
                        id="statusFilter"
                        className={styles.filterSelect}
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                    >
                        <option value="">Todos los estados</option>
                        <option value={OrderStatus.PENDING}>{formatStatus(OrderStatus.PENDING)}</option>
                        <option value={OrderStatus.APPROVED}>{formatStatus(OrderStatus.APPROVED)}</option>
                        <option value={OrderStatus.CANCELLED}>{formatStatus(OrderStatus.CANCELLED)}</option>
                        <option value={OrderStatus.DELIVERED}>{formatStatus(OrderStatus.DELIVERED)}</option>
                    </select>
                </div>

                <div className={styles.filterWrapper}>
                    <label htmlFor="paymentFilter" className={styles.filterLabel}>Pago:</label>
                    <select
                        id="paymentFilter"
                        className={styles.filterSelect}
                        value={paymentFilter}
                        onChange={handlePaymentFilterChange}
                    >
                        <option value="">Todos los pagos</option>
                        <option value={PaymentType.TRANSFERENCIA}>{formatPaymentType(PaymentType.TRANSFERENCIA)}</option>
                        <option value={PaymentType.CUOTAS}>{formatPaymentType(PaymentType.CUOTAS)}</option>
                    </select>
                </div>
            </div>

            <table className={styles.ordersTable}>
                <thead>
                    <tr>
                        <th>Selección</th>
                        <th>Fecha</th>
                        <th>Código</th>
                        <th>Cliente</th>
                        <th>Subtotal</th>
                        <th>Total</th>
                        <th>Envío</th>
                        <th>Productos</th>
                        <th>Detalles</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => {
                        const isLastRow = index === orders.length - 1;
                        const isSecondLastRow = index === orders.length - 2; // Nueva condición
                        const showMenuUp = isLastRow || isSecondLastRow; // Mostrar menú hacia arriba en las últimas dos filas
                        return (
                            <tr key={index}>
                              <td className={styles.selectionCell}>
                                <label className={styles.tableCheckboxContainer}>
                                  <input 
                                    type="checkbox" 
                                    checked={selectedOrders.includes(order.orderId)}
                                    onChange={() => handleSelectOrder(order.orderId)}
                                  />
                                  <span className={styles.customTableCheckbox}></span>
                                </label>
                                <button 
                                  className={styles.starButton}
                                  onClick={() => toggleStar(order.orderId)}
                                >
                                  {order.isStarred ? (
                                    <BsStarFill className={styles.starIcon} />
                                  ) : (
                                    <BsStar className={styles.starIcon} />
                                  )}
                                </button>
                              </td>
                              <td>{order.fecha}</td>
                              <td>{order.codigo}</td>
                              <td>
                                <div>{order.cliente}</div>
                                <div className={styles.customerEmail}>{order.email}</div>
                              </td>
                              <td>${Number(order.subtotal).toLocaleString('es-AR')}</td>
                              <td>${Number(order.total).toLocaleString('es-AR')}</td>
                              <td>
                                {order.isPickup ?
                                  '$0' :
                                  `$${Number(10000).toLocaleString('es-AR')}`
                                }
                              </td>
                              <td>{order.productos}</td>
                              <td>{order.detalles}</td>
                              <td>{formatStatus(order.estado)}</td>
                              <td className={styles.orderActions}>
                                <div 
                                  className={styles.menuContainer} 
                                  ref={el => { if (el) menuRefs.current[index] = el; }}
                                >
                                  <button 
                                    className={`${styles.actionButton} ${styles.moreOptionsButton}`} 
                                    onClick={() => handleActionClick(order.orderId, index)}
                                  >
                                    <BsThreeDots/>
                                  </button>
                                  
                                  {isMenuOpen && selectedOrderId === order.orderId && (
                                    <div className={`${styles.dropdownMenu} ${showMenuUp ? styles.menuUp : ''}`}>
                                      <button 
                                        className={styles.menuItem}
                                        onClick={() => toggleStar(order.orderId)}
                                      >
                                        {order.isStarred ? (
                                          <BsStarFill className={styles.menuIcon} />
                                        ) : (
                                          <BsStar className={styles.menuIcon} />
                                        )}
                                        <span>
                                          {order.isStarred 
                                            ? 'Desmarcar favorito' 
                                            : 'Marcar favorito'}
                                        </span>
                                      </button>
                                      <button 
                                        className={styles.menuItem}
                                        onClick={() => handleEdit(order.orderId)}
                                      >
                                        <FaEdit className={styles.menuIcon} />
                                        <span>Editar orden</span>
                                      </button>
                                      <button 
                                        className={styles.menuItem}
                                        onClick={() => handleDelete(order.orderId)}
                                      >
                                        <FaTrashAlt className={styles.menuIcon} />
                                        <span>Eliminar</span>
                                      </button>
                                      <button 
                                        className={styles.menuItem}
                                        onClick={() => handleViewDetails(order.orderId)}
                                      >
                                        <FaInfoCircle className={styles.menuIcon} />
                                        <span>Detalles</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}                        
                </tbody>
            </table>

            {/* Paginación */}
            <div className={styles.resultsPagination}>
                <div className={styles.resultsInfo}>
                    {totalOrders} ventas en total
                </div>
                <div className={styles.paginationControls}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        {"<"}
                    </button>
                    <span>{currentPage}-{Math.ceil(totalOrders / pageSize)}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage * pageSize >= totalOrders}
                    >
                        {">"}
                    </button>
                </div>
            </div>
        </div>
    );
}
