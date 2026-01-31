# 📋 Instrucciones de Instalación y Uso

## 🚀 Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# El servidor se abrirá automáticamente en http://localhost:3000
```

## 📦 Dependencias Necesarias

El proyecto requiere las siguientes dependencias (ya listadas en package.json):

### Producción:
- react ^19.1.1
- react-dom ^19.1.1
- zustand ^4.4.7 (estado global)
- date-fns ^2.30.0 (manejo de fechas)
- clsx ^2.0.0 (utilidades CSS)

### Desarrollo:
- vite ^7.1.0 (build tool)
- tailwindcss ^3.4.0 (estilos)
- autoprefixer ^10.4.16
- postcss ^8.4.32

## 🌙 Características Visuales

### Dark Mode
- Tema oscuro por defecto (#0f172a)
- Acentos púrpura (#9333ea)
- Alto contraste para mejor legibilidad
- Gradientes personalizados

### Responsive Design
- **Móvil**: < 768px - Diseño optimizado touch-friendly
- **Tablet**: 768px - 1024px - Layout adaptativo
- **Desktop**: > 1024px - Vista completa expandida

### Componentes Optimizados
- ✅ Imágenes con lazy loading
- ✅ Transiciones suaves (300ms)
- ✅ Hover effects en cards
- ✅ Touch targets mínimo 44px (móvil)
- ✅ Scroll suave y personalizado
- ✅ Animaciones fade-in

## 📱 Navegación

### Desktop:
- Selector de días en barra de controles
- Flechas izquierda/derecha del teclado (en vista de día)
- Click en tarjetas compactas para ver detalle

### Móvil:
- Menú hamburguesa (esquina superior derecha)
- Botones de navegación en cada día
- Touch/swipe friendly

## 🎨 Estilos Personalizados

### Clases Responsive Agregadas:
- `.text-responsive-*` - Tamaños de texto adaptativos
- `.grid-responsive-*` - Grids que se adaptan al viewport
- `.p-responsive` - Padding adaptativo (4/6/8)
- `.gap-responsive` - Espaciado adaptativo (3/4/6)
- `.glass` - Efecto vidrio con blur

### Gradientes:
- `bg-gradient-purple` - Gradiente principal (#667eea → #764ba2)
- `bg-gradient-dark` - Gradiente oscuro
- `bg-gradient-light` - Gradiente claro

## 🔧 Estructura de Datos

Los datos se cargan desde `public/data/itinerary-data.json`

Formato esperado:
```json
{
  "days": [
    {
      "day": 1,
      "city": "Barcelona",
      "country": "España",
      "heroImageUrl": "url",
      "mainActivities": [...],
      "costs": {...},
      ...
    }
  ]
}
```

## 📊 Funcionalidades

1. **Vista Resumen**: Estadísticas generales y calendario
2. **Todos los Días**: Grid con todas las tarjetas
3. **Vista Día**: Detalle completo con actividades
4. **Búsqueda**: Filtrar por ciudad o actividad
5. **Filtros**: Solo transportes, costos realistas
6. **Conversión**: USD ↔ COP configurable
7. **Export**: JSON, CSV con conversión de moneda
8. **Modo Edición**: Modificar actividades (próximamente)

## 🐛 Solución de Problemas

### No se cargan los datos:
- Verificar que existe `public/data/itinerary-data.json`
- Revisar consola del navegador para errores

### Estilos no se aplican:
- Ejecutar `npm install` nuevamente
- Verificar que Tailwind esté configurado

### Imágenes no cargan:
- Las URLs de imágenes deben ser válidas
- Se mostrará emoji fallback si falla

## 📝 Notas

- Los cambios se guardan automáticamente en localStorage
- La aplicación funciona offline una vez cargada
- Compatible con Chrome, Firefox, Safari, Edge modernos
- Optimizada para performance en móviles

---

¡Disfruta organizando tu viaje! 🌍✈️
