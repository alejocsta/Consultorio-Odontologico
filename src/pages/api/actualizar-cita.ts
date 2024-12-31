import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const citaData = await request.json();
    
    if (!citaData.id) {
      throw new Error('ID es requerido');
    }

    const filePath = path.join(process.cwd(), 'src', 'data', 'citas.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const citas = JSON.parse(fileContent);
    
    // Actualizar la cita
    const updatedCitas = citas.map(cita => 
      cita.id === citaData.id ? { ...cita, ...citaData } : cita
    );
    
    // Verificar si se encontró la cita
    if (!updatedCitas.some(cita => cita.id === citaData.id)) {
      throw new Error('Cita no encontrada');
    }
    
    await fs.writeFile(filePath, JSON.stringify(updatedCitas, null, 2));
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Cita actualizada correctamente',
      data: citaData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
