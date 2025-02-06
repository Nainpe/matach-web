"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast"; // Importa react-hot-toast
import styles from "./UserProfileForm.module.css";
import { fetchUserProfile, updateUserProfile } from "@/actions/perfil/userActions";

interface Address {
  id: string;
  userId: string;
  street: string;
  locality: string | null;
  province: string | null;
  postalCode: string | null;
  country: string | null;
  phoneNumber: string | null;
  isPrimary: boolean;
  createdAt: Date;
}

interface UserProfileFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  addresses: Address[];
  dni: string;
  email: string;
  image?: string | null;
}

const PROVINCES = [
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes",
  "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones",
  "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz",
  "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán",
];

const UserProfileForm: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileFormValues | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserProfileFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      addresses: [
        {
          id: "",
          userId: "",
          street: "",
          locality: null,
          province: null,
          postalCode: null,
          country: null,
          phoneNumber: null,
          isPrimary: true,
          createdAt: new Date(),
        },
      ],
      dni: "",
      email: "",
    },
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      if (session?.user?.id) {
        try {
          const profile = await fetchUserProfile(session.user.id);
          setProfileData(profile);
          setValue("firstName", profile.firstName);
          setValue("lastName", profile.lastName);
          setValue("phoneNumber", profile.phoneNumber);
          setValue("addresses", profile.addresses);
          setValue("dni", profile.dni);
          setValue("email", profile.email);
          if (profile.image) {
            setValue("image", profile.image);
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      }
    };
    loadUserProfile();
  }, [session?.user?.id, setValue]);

  const onSubmit: SubmitHandler<UserProfileFormValues> = async (data) => {
    setLoading(true);
    try {
      if (session?.user?.id) {
        await updateUserProfile(session.user.id, data);
        toast.success("Perfil actualizado con éxito."); // Muestra el mensaje de éxito
        window.location.reload(); // Recarga la página para reflejar los cambios
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar el perfil."); // Muestra el mensaje de error
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <p>Inicia sesión para editar tu perfil.</p>;
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Editar Perfil</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inlineGroup}>
          <div className={`${styles.formGroup} ${styles.halfWidth}`}>
            <label htmlFor="firstName" className={styles.label}>Nombre</label>
            <input
              type="text"
              id="firstName"
              {...register("firstName", { 
                required: "El nombre es obligatorio",
                pattern: {
                  value: /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/,
                  message: "El nombre solo puede contener letras y espacios"
                }
              })}
              className={styles.input}
            />
            {errors.firstName && <span>{errors.firstName.message}</span>}
          </div>
          <div className={`${styles.formGroup} ${styles.halfWidth}`}>
            <label htmlFor="lastName" className={styles.label}>Apellido</label>
            <input
              type="text"
              id="lastName"
              {...register("lastName", { 
                required: "El apellido es obligatorio",
                pattern: {
                  value: /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/,
                  message: "El apellido solo puede contener letras y espacios"
                }
              })}
              className={styles.input}
            />
            {errors.lastName && <span>{errors.lastName.message}</span>}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Correo Electrónico</label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "El correo es obligatorio" })}
            className={styles.input}
            disabled
          />
        </div>

        <div className={styles.inlineGroup}>
          <div className={`${styles.formGroup} ${styles.halfWidth}`}>
            <label htmlFor="phoneNumber" className={styles.label}>Teléfono</label>
            <input
              type="tel"
              id="phoneNumber"
              {...register("phoneNumber", { 
                required: "El teléfono es obligatorio",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "El teléfono debe contener solo 10 dígitos numéricos"
                }
              })}
              className={styles.input}
            />
            {errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}
          </div>
          <div className={`${styles.formGroup} ${styles.halfWidth}`}>
            <label htmlFor="dni" className={styles.label}>DNI</label>
            <input
              type="text"
              id="dni"
              {...register("dni", { 
                required: "El DNI es obligatorio",
                pattern: {
                  value: /^[0-9]{7,8}$/,
                  message: "El DNI debe contener solo números (7 o 8 dígitos)"
                }
              })}
              className={styles.input}
            />
            {errors.dni && <span>{errors.dni.message}</span>}
          </div>
        </div>

        <hr className={styles.underline} />
        <div className={styles.formGroup}>
          <label htmlFor="street" className={styles.label}>Dirección</label>
          <input
            type="text"
            id="street"
            {...register("addresses.0.street", { 
              required: "La calle es obligatoria",
              pattern: {
                value: /^[A-Za-z0-9\s,.-]+$/,
                message: "La calle solo puede contener letras, números, espacios y caracteres especiales como coma, punto y guion"
              }
            })}
            className={styles.input}
          />
        </div>

        <div className={styles.inlineGroup}>
          <div className={`${styles.formGroup} ${styles.halfWidth}`}>
            <label htmlFor="city" className={styles.label}>Ciudad</label>
            <input
              type="text"
              id="city"
              {...register("addresses.0.locality", { 
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "La ciudad solo puede contener letras y espacios"
                }
              })}
              className={styles.input}
            />
          </div>
          <div className={`${styles.formGroup} ${styles.halfWidth}`}>
            <label htmlFor="postalCode" className={styles.label}>Código Postal</label>
            <input
              type="text"
              id="postalCode"
              {...register("addresses.0.postalCode", { 
                pattern: {
                  value: /^[0-9]{4,5}$/,
                  message: "El código postal debe contener entre 4 y 5 dígitos"
                }
              })}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.inlineGroup}>
          <div className={`${styles.formGroup} ${styles.halfWidth}`}>
            <label htmlFor="province" className={styles.label}>Provincia</label>
            <select
              id="province"
              {...register("addresses.0.province")}
              className={styles.input}
            >
              <option value="">Selecciona una provincia</option>
              {PROVINCES.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
};

export default UserProfileForm;
 