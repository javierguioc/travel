# 🇪🇺 Itinerario Europa - Barcelona, París, Ámsterdam, Suiza, Milán - Septiembre 2026

Una aplicación web interactiva para planificar y gestionar un viaje de 15 días por Europa, visitando Barcelona, París, Ámsterdam, Suiza (con Rhine Falls, Monte Titlis, Lauterbrunnen) y Milán. Optimizada para móviles y lista para desplegar en GitHub Pages.

## 📁 Estructura del Proyecto

```
travel/
├── index.html          # Página principal (HTML limpio y modular)
├── styles.css          # Todos los estilos CSS
├── script.js           # Toda la lógica JavaScript
├── data-v2.json        # Datos enriquecidos del itinerario (versión con imágenes y campos adicionales)
└── README.md           # Documentación del proyecto
```

## 🚀 Características Principales

### 🏠 **Página de Resumen**
- **Vista general** del viaje con estadísticas
- **Línea de tiempo** de ciudades visitadas
- **Costos totales** (Base vs Realista 2025)
- **Acceso rápido** a todas las funcionalidades

### 🎨 **Versión Enriquecida (data-v2.json)**
- **Imágenes hero** para cada ciudad con queries específicos
- **Banderas de países** y códigos de ciudad
- **Información de moneda local** con símbolos
- **Tips y perks** específicos para cada día
- **Queries de imagen** personalizados para actividades
- **Totales precalculados** para mejor rendimiento

### 📅 **Vista de Todos los Días**
- **Grid responsivo** con tarjetas compactas
- **Imágenes de actividades** desde Unsplash
- **Información esencial** de cada día
- **Click para ver detalles** completos

### 📝 **Vista Detallada por Día**
- **Edición en tiempo real** de horarios y notas
- **Gestión de costos** por categoría
- **Información de transporte** entre ciudades
- **Links a Google Maps** para rutas

### 💡 **Sistema de Recomendaciones**
- **8 categorías** de consejos útiles
- **Links externos** para más información
- **Toggle para mostrar/ocultar**

### 🎨 **Características Técnicas**
- **Responsive design** para móviles y desktop
- **Persistencia local** con localStorage
- **Exportación/Importación** JSON y CSV
- **Imágenes optimizadas** con fallback a iconos
- **Búsqueda en tiempo real**

## 🛠️ Cómo Usar

### **Desarrollo Local**
1. Descarga todos los archivos en una carpeta
2. Inicia un servidor HTTP local:
   ```bash
   python3 -m http.server 3000
   ```
3. Abre `http://localhost:3000` en tu navegador

### **Despliegue en GitHub Pages**
1. Crea un repositorio en GitHub
2. Sube todos los archivos al repositorio
3. Ve a Settings → Pages
4. Selecciona la rama `main` (o `master`)
5. Guarda los cambios
6. Tu aplicación estará disponible en `https://tu-usuario.github.io/tu-repositorio`

**Nota:** El archivo `.nojekyll` está incluido para asegurar que GitHub Pages sirva los archivos correctamente.

### **Navegación**
- **🏠 Resumen General**: Vista inicial con estadísticas
- **📅 Ver todos los días**: Grid con todos los días
- **Días individuales**: Vista detallada de cada día

### **Edición**
- **Horarios**: Click en los campos de tiempo para editar
- **Notas**: Agrega comentarios personalizados
- **Costos**: Modifica presupuestos en tiempo real
- **Transporte**: Actualiza información de traslados

### **Funciones Avanzadas**
- **Búsqueda**: Encuentra días por ciudad o actividad
- **Filtros**: Solo días con traslado
- **Costos**: Alterna entre Base y Realista 2025
- **Exportar**: Guarda como JSON o CSV
- **Imprimir**: Genera PDF del itinerario

## 📊 Estructura de Datos

### **Archivo `data.json`**
```json
{
  "meta": {
    "currency": "USD",
    "intl_flight_estimate": 900,
    "group_sizes": [6, 8]
  },
  "recommendations": [...],
  "days": [
    {
      "day": 1,
      "date": "2025-09-05",
      "city": "Barcelona",
      "stayArea": "Eixample (L2/L4) o Born/Gòtic",
      "mainActivities": [...],
      "transportToNext": {...},
      "costs": {...},
      "mapPoints": [...],
      "notes": "..."
    }
  ]
}
```

## ✏️ Personalización Fácil

### **Para Actualizar Datos:**
1. **Edita `data.json`** - Cambia actividades, horarios, costos
2. **Modifica `styles.css`** - Personaliza colores y diseño
3. **Actualiza `script.js`** - Agrega nuevas funcionalidades

### **Agregar Nuevas Actividades:**
```json
{
  "name": "Nueva Actividad",
  "start": "10:00",
  "durationMin": 120,
  "link": "https://ejemplo.com",
  "notes": "Descripción de la actividad"
}
```

### **Agregar Nuevas Imágenes:**
En `script.js`, actualiza el objeto `imageMap`:
```javascript
const imageMap = {
  'Nueva Actividad': 'https://images.unsplash.com/photo-xxx?w=160&h=160&fit=crop',
  // ... más imágenes
};
```

## 💰 Gestión de Presupuesto

### **Dos Modos de Costos:**
- **Base**: Costos originales conservadores
- **Realista 2025**: Costos actualizados para 2025

### **Categorías:**
- 🏨 **Alojamiento**: Por noche por persona
- 🍽️ **Comida**: Desayuno, almuerzo, cena
- 🚇 **Transporte**: Metro, bus, taxis locales
- 🎫 **Actividades**: Entradas, tours, experiencias

### **Cálculos Automáticos:**
- Total por día
- Acumulado del viaje
- Totales para grupos de 6 y 8 personas

## 🌐 Funcionalidades Web

### **Persistencia:**
- **localStorage**: Guarda cambios automáticamente
- **Exportar JSON**: Backup completo del itinerario
- **Importar JSON**: Restaura desde backup

### **Exportación:**
- **CSV**: Presupuesto detallado para Excel
- **PDF**: Impresión del itinerario completo

### **Integración:**
- **Google Maps**: Links automáticos para rutas
- **Unsplash**: Imágenes de alta calidad
- **Enlaces oficiales**: Sitios de reservas y tickets

## 📱 Responsive Design (Mobile-First)

### **Mobile (320px+):**
- Diseño optimizado para móviles
- Menú hamburguesa para controles
- Botón flotante "Volver arriba"
- Botones con tamaño mínimo táctil (44x44px)
- Tipografía optimizada (16px para evitar zoom en iOS)
- Grid de 1 columna
- Imágenes adaptativas

### **Tablet (768px+):**
- Grid de 2 columnas
- Controles en fila
- Mejor aprovechamiento del espacio

### **Desktop (1024px+):**
- Grid de 3-4 columnas
- Vista completa de controles
- Imágenes grandes (400x250px)
- Experiencia completa

## 🔧 Mantenimiento

### **Para Actualizar el Itinerario:**
1. **Solo edita `data.json`** - No toques otros archivos
2. **Recarga la página** - Los cambios aparecen inmediatamente
3. **Exporta JSON** - Guarda backup de tus cambios

### **Para Cambiar el Diseño:**
1. **Edita `styles.css`** - Cambia colores, fuentes, espaciado
2. **Variables CSS** están al inicio del archivo
3. **Responsive** ya está configurado

### **Para Nuevas Funciones:**
1. **Edita `script.js`** - Agrega nueva lógica
2. **Mantén la estructura** de funciones existente
3. **Usa las variables globales** ya definidas

## 🎯 Casos de Uso

### **Planificación:**
- Visualizar todo el viaje de un vistazo
- Ajustar horarios y actividades
- Calcular presupuestos realistas

### **Durante el Viaje:**
- Consultar horarios y direcciones
- Ver rutas en Google Maps
- Tomar notas de experiencias

### **Después del Viaje:**
- Exportar recuerdos y datos
- Compartir itinerario con amigos
- Usar como plantilla para futuros viajes

## ✨ Características Móviles

### **Navegación Móvil:**
- **Menú hamburguesa**: Acceso rápido a controles en móvil
- **Botón "Volver arriba"**: Navegación rápida al inicio
- **Gestos táctiles**: Optimizado para interacción con dedos
- **Scroll suave**: Transiciones fluidas

### **Optimizaciones:**
- **Carga rápida**: Imágenes lazy loading
- **Rendimiento**: 60fps en dispositivos móviles
- **Accesibilidad**: Tamaños mínimos táctiles (44x44px)
- **Responsive**: Funciona perfectamente desde 320px

## 🚀 Próximas Mejoras Sugeridas

- [x] Optimización móvil completa
- [x] Preparación para GitHub Pages
- [ ] Modo offline con Service Worker
- [ ] Sincronización en la nube
- [ ] Compartir itinerario por link
- [ ] Integración con calendarios
- [ ] Alertas de horarios
- [ ] Comparador de precios
- [ ] Reseñas y ratings de actividades

---

**¡Disfruta tu viaje por Europa! 🌍✈️**
