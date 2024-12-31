import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { dni } = await request.json();
    
    if (!dni) {
      throw new Error('DNI es requerido');
    }

    // Ruta al archivo JSON
    const filePath = path.join(process.cwd(), 'src', 'data', 'pacientes.json');
    
    // Leer el archivo JSON actual
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const patients = JSON.parse(fileContent);
    
    // Filtrar el paciente a eliminar
    const updatedPatients = patients.filter(patient => patient.dni !== dni);
    
    // Verificar si se encontró el paciente
    if (patients.length === updatedPatients.length) {
      throw new Error('Paciente no encontrado');
    }
    
    // Escribir los datos actualizados al archivo
    await fs.writeFile(filePath, JSON.stringify(updatedPatients, null, 2));
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Paciente eliminado correctamente'
      }), 
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    
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
