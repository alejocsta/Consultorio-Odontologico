import fs from 'fs/promises';
import path from 'path';

export async function POST({ request }) {
  try {
    const updatedPatient = await request.json();
    
		if (!updatedPatient.name || !updatedPatient.dni || !updatedPatient.telefono || !updatedPatient.mail) {
      throw new Error('Todos los campos son requeridos');
    }
    // Leer el archivo JSON actual
    const filePath = path.join(process.cwd(), 'src', 'data', 'pacientes.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const patients = JSON.parse(fileContent);
    
    // Actualizar el paciente correcto usando el DNI como identificador
    const updatedPatients = patients.map(patient => 
      patient.dni === updatedPatient.dni ? updatedPatient : patient
    );
    
    // Escribir los datos actualizados al archivo
    await fs.writeFile(filePath, JSON.stringify(updatedPatients, null, 2));
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
