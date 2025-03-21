"use client";

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import styles from './Register.module.css';
import { registerUser } from '../../../actions/auth/register';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dni: string;
  phoneNumber: string;
  address: string;
  locality: string;
  province: string;
  postalCode: string;
};

const provinces = [
  "Buenos Aires", "Ciudad Autónoma de Buenos Aires", "Catamarca", "Chaco",
  "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy",
  "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro",
  "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe",
  "Santiago del Estero", "Tierra del Fuego", "Tucumán"
];

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const {
      email, password, confirmPassword,
      firstName, lastName, dni,
      phoneNumber, address, locality, province, postalCode
    } = data;

    // Validación cliente de contraseñas
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      const resp = await registerUser(
        email, password, firstName, lastName, dni, 
        phoneNumber, address, locality, province, postalCode
      );

      if (!resp.ok) {
        toast.error(resp.message || "Error en el registro");
        return;
      }

      toast.success("Registro exitoso. Por favor verifica tu correo electrónico.");
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión con el servidor");
    }
  };

  const password = watch("password");

  return (
    <div className="main-container">
      <div className={styles.container}>
        <h2 className={styles.title}>Crear cuenta</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.grid}>
            {/* Email */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                {...register("email", { 
                  required: "Este campo es obligatorio",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Correo electrónico inválido"
                  }
                })}
                className={styles.input}
              />
              {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            </div>

            {/* Contraseña */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Contraseña</label>
              <input
                type="password"
                {...register("password", { 
                  required: "Este campo es obligatorio",
                  minLength: { value: 8, message: "Mínimo 8 caracteres" }
                })}
                className={styles.input}
              />
              {errors.password && <p className={styles.error}>{errors.password.message}</p>}
            </div>

            {/* Confirmar Contraseña */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Confirmar Contraseña</label>
              <input
                type="password"
                {...register("confirmPassword", { 
                  required: "Este campo es obligatorio",
                  validate: (value) => value === password || "Las contraseñas no coinciden"
                })}
                className={styles.input}
              />
              {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword.message}</p>}
            </div>

            {/* Nombre */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre</label>
              <input
                type="text"
                {...register("firstName", { 
                  required: "Este campo es obligatorio",
                  maxLength: { value: 50, message: "Máximo 50 caracteres" }
                })}
                className={styles.input}
              />
              {errors.firstName && <p className={styles.error}>{errors.firstName.message}</p>}
            </div>

            {/* Apellido */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Apellido</label>
              <input
                type="text"
                {...register("lastName", { 
                  required: "Este campo es obligatorio",
                  maxLength: { value: 50, message: "Máximo 50 caracteres" }
                })}
                className={styles.input}
              />
              {errors.lastName && <p className={styles.error}>{errors.lastName.message}</p>}
            </div>

            {/* DNI */}
            <div className={styles.formGroup}>
              <label className={styles.label}>DNI</label>
              <input
                type="text"
                inputMode='numeric'
                {...register("dni", { 
                  required: "Este campo es obligatorio",
                  pattern: { 
                    value: /^\d{8}[A-Za-z]$/, 
                    message: "Formato inválido (Ej: 12345678X)" 
                  }
                })}
                className={styles.input}
              />
              {errors.dni && <p className={styles.error}>{errors.dni.message}</p>}
            </div>

            {/* Teléfono */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Teléfono</label>
              <input
                type="tel"
                inputMode='tel'
                {...register("phoneNumber", { 
                  required: "Este campo es obligatorio",
                  pattern: { 
                    value: /^\d{9,15}$/, 
                    message: "Teléfono inválido (9-15 dígitos)" 
                  }
                })}
                className={styles.input}
              />
              {errors.phoneNumber && <p className={styles.error}>{errors.phoneNumber.message}</p>}
            </div>

            {/* Provincia */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Provincia</label>
              <div className={styles.selectWrapper}>
                <select
                  {...register("province", { required: "Este campo es obligatorio" })}
                  className={styles.select}
                >
                  <option value="">Seleccionar provincia</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                <ChevronDown className={styles.selectIcon} />
                {errors.province && <p className={styles.error}>{errors.province.message}</p>}
              </div>
            </div>

            {/* Localidad */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Localidad</label>
              <input
                type="text"
                {...register("locality", { 
                  required: "Este campo es obligatorio",
                  maxLength: { value: 100, message: "Máximo 100 caracteres" }
                })}
                className={styles.input}
              />
              {errors.locality && <p className={styles.error}>{errors.locality.message}</p>}
            </div>

            {/* Código Postal */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Código Postal</label>
              <input
                type="text"
                {...register("postalCode", { 
                  required: "Este campo es obligatorio",
                  pattern: { 
                    value: /^\d{4,5}$/, 
                    message: "Debe tener 4 o 5 dígitos" 
                  }
                })}
                className={styles.input}
              />
              {errors.postalCode && <p className={styles.error}>{errors.postalCode.message}</p>}
            </div>

            {/* Dirección */}
            <div className={styles.fullWidth}>
              <label className={styles.label}>Dirección</label>
              <input
                type="text"
                {...register("address", { 
                  required: "Este campo es obligatorio",
                  maxLength: { value: 150, message: "Máximo 150 caracteres" }
                })}
                className={styles.input}
              />
              {errors.address && <p className={styles.error}>{errors.address.message}</p>}
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.button}>
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}