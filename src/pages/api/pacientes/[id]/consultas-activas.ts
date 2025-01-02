import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const GET: APIRoute = async ({ params }) => {
  try {
    // Obtener el ID del paciente de los parámetros
    const pacienteId = params.id;

    // Leer el archivo de pacientes
    const pacientesPath = path.join(process.cwd(), 'src', 'data', 'pacientes.json');
    const pacientesContent = await fs.readFile(pacientesPath, 'utf-8');
    const pacientes = JSON.parse(pacientesContent);

    // Buscar el paciente por DNI
    const paciente = pacientes.find(p => p.dni === pacienteId);
    
    if (!paciente) {
      return new Response(JSON.stringify({ 
        message: 'Paciente no encontrado' 
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Leer el archivo de consultas
    const consultasPath = path.join(process.cwd(), 'src', 'data', 'consultas.json');
    const consultasContent = await fs.readFile(consultasPath, 'utf-8');
    const consultas = JSON.parse(consultasContent);

    // Filtrar consultas activas del paciente
    const consultasActivas = consultas.filter(consulta => 
      consulta.nombrePaciente === paciente.name && 
      ['activa', 'en_proceso'].includes(consulta.estado)
    );

    // Devolver si hay consultas activas
    const hasActiveConsultas = consultasActivas.length > 0;

    return new Response(JSON.stringify(hasActiveConsultas), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error al verificar consultas activas:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al verificar consultas activas',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
