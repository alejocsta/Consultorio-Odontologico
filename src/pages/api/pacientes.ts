import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const GET: APIRoute = async () => {
  try {
    const pacientesPath = path.join(process.cwd(), 'src', 'data', 'pacientes.json');
    const pacientesContent = await fs.readFile(pacientesPath, 'utf-8');
    const pacientes = JSON.parse(pacientesContent);

    return new Response(JSON.stringify(pacientes), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al obtener pacientes',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
