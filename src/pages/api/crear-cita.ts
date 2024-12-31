// src/pages/api/crear-cita.ts
import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const consultaData = await request.json();
    console.log('Datos recibidos en el servidor:', consultaData);

    // Validar datos requeridos
    const requiredFields = ['id', 'diaConsulta', 'horaConsulta', 'nombrePaciente', 'nombreMedico', 'problema', 'tratamientos'];
    const missingFields = requiredFields.filter(field => !consultaData[field]);
    
    if (missingFields.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        message: `Faltan campos requeridos: ${missingFields.join(', ')}`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar que tratamientos sea un array
    if (!Array.isArray(consultaData.tratamientos)) {
      return new Response(JSON.stringify({
        success: false,
        message: 'El campo tratamientos debe ser un array'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const consultasPath = path.join(process.cwd(), 'src', 'data', 'citas.json');
    console.log('Ruta del archivo:', consultasPath);

    // Verificar si el archivo existe
    try {
      await fs.access(consultasPath);
    } catch (error) {
      // Si el archivo no existe, crearlo con un array vacío
      await fs.writeFile(consultasPath, '[]', 'utf-8');
    }

    // Leer consultas existentes
    let consultas = [];
    const consultasContent = await fs.readFile(consultasPath, 'utf-8');
    try {
      consultas = JSON.parse(consultasContent);
    } catch (error) {
      console.error('Error al parsear JSON existente:', error);
      consultas = [];
    }

    if (!Array.isArray(consultas)) {
      consultas = [];
    }

    // Agregar nueva consulta
    consultas.push(consultaData);
    console.log('Consultas actualizadas:', consultas);

    // Guardar consultas actualizadas
    await fs.writeFile(consultasPath, JSON.stringify(consultas, null, 2), 'utf-8');

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Consulta creada exitosamente',
      data: consultaData
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error al crear consulta:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Error al crear la consulta',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
