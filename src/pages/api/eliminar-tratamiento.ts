// src/pages/api/eliminar-tratamiento.ts
import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();
    
    if (!id) {
      throw new Error('ID es requerido');
    }

    const filePath = path.join(process.cwd(), 'src', 'data', 'tratamientos.json');
    
    // Leer el archivo JSON actual
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
    
    // Buscar el tratamiento a eliminar
    const tratamientoExiste = tratamientos.some(t => t.id === parseInt(id));
    if (!tratamientoExiste) {
      throw new Error('Tratamiento no encontrado');
    }
    
    // Filtrar el tratamiento a eliminar
    const tratamientosActualizados = tratamientos.filter(t => t.id !== parseInt(id));
    
    // Guardar el archivo actualizado
    await fs.writeFile(filePath, JSON.stringify(tratamientosActualizados, null, 2));
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Tratamiento eliminado correctamente'
      }), 
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error al eliminar tratamiento:', error);
    
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
