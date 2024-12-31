import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

// Corregir la ruta del archivo
export const POST: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();
    
    if (!id) {
      throw new Error('ID es requerido');
    }

    // Cambiar la ruta del archivo a citas.json
    const filePath = path.join(process.cwd(), 'src', 'data', 'citas.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const citas = JSON.parse(fileContent);
    
    const updatedCitas = citas.filter(cita => cita.id !== parseInt(id));
    
    if (citas.length === updatedCitas.length) {
      throw new Error('Cita no encontrada');
    }
    
    await fs.writeFile(filePath, JSON.stringify(updatedCitas, null, 2));
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Cita eliminada correctamente'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
