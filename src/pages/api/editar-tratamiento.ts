// src/pages/api/editar-tratamiento.ts
import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const tratamientoData = await request.json();
    
    // Validar datos requeridos
    if (!tratamientoData.id) {
      throw new Error('ID es requerido');
    }

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
    
    // Leer archivo existente
    let tratamientos = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      tratamientos = JSON.parse(fileContent);
    } catch (error) {
      throw new Error('Error al leer el archivo de tratamientos');
    }

    // Verificar que tratamientos sea un array
    if (!Array.isArray(tratamientos)) {
      throw new Error('Formato de archivo inválido');
    }

    // Buscar y actualizar el tratamiento
    const index = tratamientos.findIndex(t => t.id === parseInt(tratamientoData.id));
    if (index === -1) {
      throw new Error('Tratamiento no encontrado');
    }

    // Actualizar los datos
    const tratamientoActualizado = {
      ...tratamientos[index],
      nombreTratamiento: tratamientoData.nombreTratamiento.trim(),
      descripcion: tratamientoData.descripcion.trim()
    };

    // Actualizar el array
    tratamientos[index] = tratamientoActualizado;

    // Guardar cambios
    await fs.writeFile(filePath, JSON.stringify(tratamientos, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Tratamiento actualizado correctamente',
        data: tratamientoActualizado
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error al editar tratamiento:', error);
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
