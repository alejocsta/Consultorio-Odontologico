import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

// Interfaz para definir la estructura de una consulta
interface Consulta {
  id: string;
  diaConsulta: string;
  horaConsulta: string;
  nombrePaciente: string;
  nombreMedico: string;
  problema: string;
  tratamiento: string;
  estado: 'activa' | 'en_proceso' | 'completada';
}

// Función para leer consultas del archivo JSON
async function leerConsultas(): Promise<Consulta[]> {
  const consultasPath = path.join(process.cwd(), 'src', 'data', 'citas.json');
  const consultasContent = await fs.readFile(consultasPath, 'utf-8');
  return JSON.parse(consultasContent);
}

// Función para escribir consultas en el archivo JSON
async function escribirConsultas(consultas: Consulta[]): Promise<void> {
  const consultasPath = path.join(process.cwd(), 'src', 'data', 'citas.json');
  await fs.writeFile(consultasPath, JSON.stringify(consultas, null, 2), 'utf-8');
}

// GET: Obtener todas las consultas
export const GET: APIRoute = async () => {
  try {
		const consultas = await leerConsultas();
    return new Response(JSON.stringify(consultas), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error al obtener consultas:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al obtener consultas',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

