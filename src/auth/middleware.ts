// auth/middleware.ts

// Verificar autenticación
export function isAuthenticated(): boolean {
  const userRole = localStorage.getItem('userRole');
  console.log('Current user role:', userRole); // Debug
  return userRole !== null && userRole !== undefined && userRole !== '';
}

// Proteger rutas
export function requireAuth() {
  const currentPath = window.location.pathname;
  const publicPaths = ['/login', '/logup'];
  
  if (publicPaths.includes(currentPath)) {
    return true;
  }

  if (!isAuthenticated()) {
    window.location.href = '/login';
    return false;
  }
  return true;
}

// Obtener rol del usuario
export function getUserRole(): string | null {
  return localStorage.getItem('userRole');
}

// Establecer rol del usuario
export function setUserRole(role: string): void {
  localStorage.setItem('userRole', role);
}

// Limpiar rol (logout)
export function clearUserRole(): void {
  localStorage.removeItem('userRole');
}
