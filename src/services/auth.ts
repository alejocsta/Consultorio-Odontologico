
import jwt from 'jsonwebtoken';

const users = [
  { id: 1, email: 'medico@example.com', password: 'medico123', role: 'Médico' },
  { id: 2, email: 'secretaria@example.com', password: 'secretaria123', role: 'Secretaria' },
  { id: 3, email: 'admin@example.com', password: 'admin123', role: 'Admin' },
];

export const validateUser = async (email: string, password: string): Promise<string> => {
  const user = users.find((user) => user.email === email && user.password === password);

	console.log('User found:', user);

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, 'your-secret-key', { expiresIn: '1h' });
 
	console.log('Generated token:', token);
	
	return token;
};

export const getUserRole = (token: string): string | null => {
  try {
    const decodedToken = jwt.verify(token, 'your-secret-key') as { role: string };
    return decodedToken.role;
  } catch (error) {
    return null;
  }
};
