// src/pages/api/guardar-consulta.ts
import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

interface ConsultaData {
  id: string;
  paso1: {
    enfermedades?: string;
    tratamientoMedico?: string;
    medicamentos?: string;
    enfermedadInfectoInfecciosa?: string;
    fuma?: boolean;
    cantidadCigarrillos?: string;
    embarazada?: boolean;
    mesesEmbarazo?: string;
    otrasEnfermedades?: string;
    alergias?: string;
    diabetes?: boolean;
    enfermedadTransmisionSexual?: string;
    motivoConsulta?: string;
  };
  paso2: {
    consultaPrevia?: string;
    tratamientoOdontologico?: string;
    rangoDolor?: string;
    tipoDolor?: string;
    caracteristicasDolor?: string;
    sensibilidad?: string[];
    localizacionDolor?: string;
    fracturas?: string;
    dificultadMasticar?: boolean;
    dificultadAbrirBoca?: boolean;
  };
  paso3: {
    anormalidadBucal?: string;
    sangradoEncias?: boolean;
    hinchazanCara?: boolean;
    higieneBucal?: string;
    anotacionesMedico?: string;
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const consultaData: ConsultaData = await request.json();
    
    // Validar que el ID de la consulta existe
    if (!consultaData.id) {
      return new Response(JSON.stringify({ error: 'ID de consulta no proporcionado' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Ruta al archivo JSON de consultas
    const dataPath = path.join(process.cwd(), 'src', 'data', 'historias-clinicas.json');
    
    // Leer el archivo existente o crear uno nuevo si no existe
    let historias: ConsultaData[] = [];
    try {
      const fileContent = await fs.readFile(dataPath, 'utf-8');
      historias = JSON.parse(fileContent);
    } catch (error) {
      // Si el archivo no existe, continuamos con el array vacío
      console.log('Creando nuevo archivo de historias clínicas');
    }

    // Verificar si ya existe una historia clínica con este ID
    const existingIndex = historias.findIndex(historia => historia.id === consultaData.id);
    
    if (existingIndex !== -1) {
      // Actualizar historia existente
      historias[existingIndex] = {
        ...historias[existingIndex],
        ...consultaData
      };
    } else {
      // Agregar nueva historia
      historias.push({
        ...consultaData,
        fechaCreacion: new Date().toISOString()
      });
    }

    // Guardar el archivo actualizado
    await fs.writeFile(dataPath, JSON.stringify(historias, null, 2), 'utf-8');

    // También actualizar el estado de la consulta en consultas.json
    const consultasPath = path.join(process.cwd(), 'src', 'data', 'citas.json');
    const consultasContent = await fs.readFile(consultasPath, 'utf-8');
    const consultas = JSON.parse(consultasContent);
    
    // Actualizar el estado de la consulta a "completada"
    const consultaIndex = consultas.findIndex((consulta: any) => consulta.id === consultaData.id);
    if (consultaIndex !== -1) {
      consultas[consultaIndex].estado = 'completada';
      await fs.writeFile(consultasPath, JSON.stringify(consultas, null, 2), 'utf-8');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Historia clínica guardada correctamente' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error al guardar la historia clínica:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Error al procesar la solicitud',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
