//src/pages/api/crear-tratamiento.ts
import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const tratamientoData = await request.json();
    
    // Validar datos requeridos
    if (!tratamientoData.nombreTratamiento || !tratamientoData.descripcion) {
      throw new Error('Nombre y descripción son requeridos');
    }

    if (tratamientoData.nombreTratamiento.length < 3) {
      throw new Error('El nombre debe tener al menos 3 caracteres');
    }

    if (tratamientoData.descripcion.length < 10) {
      throw new Error('La descripción debe tener al menos 10 caracteres');
    }

    const filePath = path.join(process.cwd(), 'src', 'data', 'tratamientos.json');
    
    // Leer archivo existente o crear uno nuevo
    let tratamientos = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      tratamientos = JSON.parse(fileContent);
    } catch (error) {
      console.log('Archivo no encontrado, se creará uno nuevo');
      tratamientos = [];
    }

    // Asegurarse que tratamientos sea un array
    if (!Array.isArray(tratamientos)) {
      tratamientos = [];
    }

    // Generar nuevo ID
    const maxId = tratamientos.length > 0 
      ? Math.max(...tratamientos.map(t => t.id))
      : 0;

    const nuevoTratamiento = {
      id: maxId + 1,
      nombreTratamiento: tratamientoData.nombreTratamiento.trim(),
      descripcion: tratamientoData.descripcion.trim()
    };

    // Agregar nuevo tratamiento
    tratamientos.push(nuevoTratamiento);

    // Guardar archivo actualizado
    await fs.writeFile(filePath, JSON.stringify(tratamientos, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Tratamiento creado exitosamente',
        data: nuevoTratamiento
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error al crear tratamiento:', error);
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
};
