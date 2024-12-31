import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

interface EstadoUpdate {
    id: string;
    estado: 'activa' | 'en_proceso' | 'completada';
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const { id, estado }: EstadoUpdate = await request.json();

        if (!id || !estado) {
            return new Response(JSON.stringify({ 
                error: 'ID y estado son requeridos' 
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Ruta al archivo de consultas
        const consultasPath = path.join(process.cwd(), 'src', 'data', 'citas.json');
        
        // Leer el archivo de consultas
        const consultasContent = await fs.readFile(consultasPath, 'utf-8');
        const consultas = JSON.parse(consultasContent);
        
        // Encontrar y actualizar la consulta
        const consultaIndex = consultas.findIndex((consulta: any) => consulta.id.toString() === id.toString());
        
        if (consultaIndex === -1) {
            return new Response(JSON.stringify({ 
                error: 'Consulta no encontrada' 
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Actualizar el estado
        consultas[consultaIndex].estado = estado;

        // Guardar los cambios
        await fs.writeFile(consultasPath, JSON.stringify(consultas, null, 2), 'utf-8');

        return new Response(JSON.stringify({ 
            success: true,
            message: 'Estado actualizado correctamente'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Error al actualizar estado:', error);
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
