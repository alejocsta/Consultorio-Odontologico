import type { Patient } from '../types/patient';

export const validatePatient = (patient: Patient): string[] => {
  const errors: string[] = [];
  const dniRegex = /^[0-9]{8}$/;
  const phoneRegex = /^\d{6,14}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!patient.nombre?.trim()) errors.push('El nombre es requerido');
  if (!dniRegex.test(patient.dni || '')) errors.push('DNI inválido (8 números)');
  if (!emailRegex.test(patient.mail || '')) errors.push('Email inválido');
  if (!phoneRegex.test(patient.telefono || '')) errors.push('Teléfono inválido (6 a 14 dígitos)');

  return errors;
};
