import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const newPatient = await request.json();
    
	// Validar datos requeridos
if (!newPatient.name) throw new Error('El nombre es requerido');
if (!newPatient.dni) throw new Error('El DNI es requerido');
if (!newPatient.mail) throw new Error('El email es requerido');
if (!newPatient.telefono) throw new Error('El teléfono es requerido');

    const filePath = path.join(process.cwd(), 'src', 'data', 'pacientes.json');
    
    // Leer archivo actual
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const patients = JSON.parse(fileContent);
    
    // Verificar si el DNI ya existe
    if (patients.some(patient => patient.dni === newPatient.dni)) {
      throw new Error('Ya existe un paciente con ese DNI');
    }
    
    // Agregar el nuevo paciente
    patients.push(newPatient);
    
    // Guardar archivo actualizado
    await fs.writeFile(filePath, JSON.stringify(patients, null, 2));
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Paciente creado correctamente'
      }), 
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
