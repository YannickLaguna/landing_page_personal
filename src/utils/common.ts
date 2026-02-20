// Activo en modo desarrollo local O cuando Netlify activa el preview del editor visual
// (STACKBIT_PREVIEW se inyecta como variable de entorno por el editor de Netlify Create)
export const isDev = process.env.NODE_ENV === 'development' || process.env.STACKBIT_PREVIEW === 'true';
