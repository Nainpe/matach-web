import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast'; 
import { useShippingStore } from '@/store/shippingStore';
import styles from './ShippingForm.module.css';

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dni: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  additionalInfo: string;
  pickupName: string;
  pickupDni: string;
};

const provinces = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones',
  'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
  'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
];

const ShippingForm: React.FC = () => {
  const { shippingOption, shippingData, pickupData, setShippingData, setPickupData } = useShippingStore();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    defaultValues: { ...shippingData, ...pickupData },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Object.entries(shippingData).forEach(([key, value]) => {
      setValue(key as keyof FormData, value);
    });
    Object.entries(pickupData).forEach(([key, value]) => {
      setValue(key as keyof FormData, value);
    });
  }, [shippingData, pickupData, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);

    try {
      if (shippingOption === 'delivery') {
        setShippingData(data);
      } else {
        setPickupData({
          pickupName: data.pickupName,
          pickupDni: data.pickupDni,
        });
      }
      // Simulación de guardado exitoso
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success('Datos guardados exitosamente');
    } catch (error) {
      toast.error('Hubo un error al guardar los datos');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.shippingForm}>
      <form className={styles.personalDataForm} onSubmit={handleSubmit(onSubmit)}>
        <h3 className={styles.title}>Tus Datos</h3>
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Nombres:
            <input className={styles.input} {...register('firstName', { required: 'Este campo es obligatorio' })} />
            {errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}
          </label>
          <label className={styles.label}>
            Apellido:
            <input className={styles.input} {...register('lastName', { required: 'Este campo es obligatorio' })} />
            {errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
          </label>
          <label className={styles.label}>
            Teléfono:
            <input className={styles.input} {...register('phone', { required: 'Este campo es obligatorio' })} />
            {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
          </label>
          <label className={styles.label}>
            Email:
            <input className={styles.input} type="email" {...register('email', { required: 'Este campo es obligatorio' })} />
            {errors.email && <span className={styles.error}>{errors.email.message}</span>}
          </label>
          <label className={styles.label}>
            DNI:
            <input className={styles.input} {...register('dni', { required: 'Este campo es obligatorio' })} />
            {errors.dni && <span className={styles.error}>{errors.dni.message}</span>}
          </label>
        </div>

        <hr className={styles.divider} />

        {shippingOption === 'delivery' || shippingOption === 'uber' ? (
          <div className={styles.optionForm}>
            <h3 className={styles.title}>Información de Envío</h3>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Provincia:
                <select className={styles.input} {...register('province', { required: 'Selecciona una provincia' })}>
                  <option value="">Selecciona tu provincia</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
                {errors.province && <span className={styles.error}>{errors.province.message}</span>}
              </label>
              <label className={styles.label}>
                Ciudad:
                <input className={styles.input} {...register('city', { required: 'Este campo es obligatorio' })} />
                {errors.city && <span className={styles.error}>{errors.city.message}</span>}
              </label>
              <label className={styles.label}>
                Dirección completa:
                <input className={styles.input} {...register('address', { required: 'Este campo es obligatorio' })} />
                {errors.address && <span className={styles.error}>{errors.address.message}</span>}
              </label>
              <label className={styles.label}>
                Código Postal:
                <input className={styles.input} {...register('postalCode', { required: 'Este campo es obligatorio' })} />
                {errors.postalCode && <span className={styles.error}>{errors.postalCode.message}</span>}
              </label>
              <label className={styles.label}>
                Información adicional:
                <textarea className={styles.textarea} {...register('additionalInfo')}></textarea>
              </label>
            </div>
          </div>
        ) : (
          <div className={styles.optionForm}>
            <h3 className={styles.title}>Información de Retiro</h3>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Nombre de quien retira:
                <input className={styles.input} {...register('pickupName', { required: 'Este campo es obligatorio' })} />
                {errors.pickupName && <span className={styles.error}>{errors.pickupName.message}</span>}
              </label>
              <label className={styles.label}>
                DNI de quien retira:
                <input className={styles.input} {...register('pickupDni', { required: 'Este campo es obligatorio' })} />
                {errors.pickupDni && <span className={styles.error}>{errors.pickupDni.message}</span>}
              </label>
            </div>
          </div>
        )}
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar datos'}
        </button>
      </form>
    </div>
  );
};

export default ShippingForm;
