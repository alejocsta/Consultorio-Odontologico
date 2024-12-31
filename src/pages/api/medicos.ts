import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const GET: APIRoute = async () => {
  try {
    const usuariosPath = path.join(process.cwd(), 'src', 'data', 'usuarios.json');
    const usuariosContent = await fs.readFile(usuariosPath, 'utf-8');
    const { usuarios } = JSON.parse(usuariosContent);
    
    // Filtrar solo los usuarios con rol de médico
    const medicos = usuarios.filter((usuario: any) => usuario.rol === 'medico');

    return new Response(JSON.stringify(medicos), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error al obtener médicos:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al obtener médicos',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
