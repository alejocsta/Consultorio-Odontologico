import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const GET: APIRoute = async () => {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'tratamientos.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const tratamientos = JSON.parse(fileContent);

    return new Response(JSON.stringify(tratamientos), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error al obtener tratamientos:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
