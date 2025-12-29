# 📋 Especificación Técnica - Itinerario Europa 2026

## 🎯 Objetivo del Proyecto

Aplicación web modular para visualizar y gestionar un itinerario de viaje de 25 días por Europa (Barcelona → París → Suiza → Milán → Roma → Venecia → Ámsterdam → Madrid). La aplicación debe ser responsive, optimizada para móviles, y desplegable en GitHub Pages.

---

## 📊 Análisis del Proyecto Actual

### Estructura de Archivos
```
travel/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS (v21)
├── script.js           # Lógica JavaScript (v31)
├── data-v2.json        # Datos del itinerario (25 días)
├── README.md           # Documentación
└── spec/
    └── spec.md         # Este archivo
```

### Tecnologías Utilizadas
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Datos:** JSON estructurado
- **Almacenamiento:** LocalStorage del navegador
- **Servidor de desarrollo:** Python SimpleHTTP

### Funcionalidades Actuales

#### ✅ Implementadas
1. **Carga de datos JSON** (`data-v2.json`)
2. **Vista resumen general** con estadísticas
3. **Vista detallada por día** con actividades
4. **Selector de días** (dropdown)
5. **Búsqueda** por ciudad o actividad
6. **Filtro de días con traslado**
7. **Modo de costos realistas** (toggle)
8. **Recomendaciones** (toggle)
9. **Calendario interactivo 2026** con fecha de inicio configurable
10. **Conversión de moneda** USD ↔ COP
11. **Navegación entre días** (flechas y teclado)
12. **Imágenes** de actividades y ciudades (Unsplash + URLs directas)
13. **Exportación** a JSON y CSV
14. **Persistencia** en LocalStorage

#### 📱 Responsive Design
- ✅ Viewport meta tag configurado
- ⚠️ CSS con media queries básicas
- ⚠️ **NECESITA OPTIMIZACIÓN MÓVIL COMPLETA**

### Estructura de Datos JSON

```json
{
  "version": "1.2-enriched-with-images-and-totals",
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
      "country": "España",
      "mainActivities": [...],
      "secondaryActivities": [...],
      "transportToNext": {...},
      "costs": {...},
      "totals": {...}
    }
  ]
}
```

### Días Actuales en el Itinerario
- **Días 1-3:** Barcelona y Tossa de Mar ✅
- **Días 4-7:** París (incluye Disneyland) ✅
- **Días 8-11:** Suiza ⚠️ **ELIMINAR TEMPORALMENTE**
- **Días 12+:** Milán, Roma, Venecia, Ámsterdam, Madrid ⚠️ **ELIMINAR TEMPORALMENTE**

---

## 🚀 Nuevas Características a Implementar

### 1. Optimización Móvil Completa 📱

#### Objetivo
Hacer que la aplicación sea completamente funcional y cómoda en dispositivos móviles (smartphones y tablets).

#### Tareas Específicas

**1.1. CSS Responsive Mejorado**
- [ ] Revisar y optimizar todos los breakpoints en `styles.css`
- [ ] Implementar diseño mobile-first
- [ ] Ajustar tamaños de fuente para legibilidad móvil
- [ ] Optimizar espaciado y padding en pantallas pequeñas
- [ ] Asegurar que imágenes se adapten correctamente
- [ ] Mejorar navegación táctil (botones más grandes, áreas de toque)

**1.2. Menú de Navegación Móvil**
- [ ] Crear menú hamburguesa para móviles
- [ ] Ocultar controles secundarios en móvil (mostrar solo esenciales)
- [ ] Implementar drawer/sidebar para opciones avanzadas
- [ ] Añadir botón "Volver arriba" flotante

**1.3. Vista de Tarjetas Optimizada**
- [ ] Rediseñar tarjetas de días para móvil (stack vertical)
- [ ] Optimizar imágenes para carga rápida en móvil
- [ ] Implementar lazy loading mejorado
- [ ] Ajustar grid de actividades para móvil

**1.4. Interacciones Táctiles**
- [ ] Aumentar tamaño de botones (mínimo 44x44px)
- [ ] Mejorar swipe gestures para navegación entre días
- [ ] Añadir feedback visual en toques
- [ ] Optimizar scroll suave

**1.5. Calendario Móvil**
- [ ] Rediseñar calendario para pantallas pequeñas
- [ ] Implementar vista compacta del calendario en móvil
- [ ] Añadir navegación por gestos en calendario

**1.6. Formularios y Controles**
- [ ] Aumentar tamaño de inputs y selects
- [ ] Mejorar accesibilidad de toggles
- [ ] Optimizar selector de fecha para móvil

#### Criterios de Éxito
- ✅ La aplicación es completamente usable en pantallas de 320px+
- ✅ Todos los elementos son accesibles con el dedo
- ✅ La navegación es intuitiva sin mouse
- ✅ Las imágenes cargan rápidamente
- ✅ El rendimiento es fluido (60fps)

---

### 2. Preparación para GitHub Pages 🌐

#### Objetivo
Hacer que la aplicación funcione perfectamente en GitHub Pages sin necesidad de servidor local.

#### Tareas Específicas

**2.1. Configuración de GitHub Pages**
- [ ] Crear archivo `.nojekyll` en la raíz (si es necesario)
- [ ] Configurar `index.html` como página principal
- [ ] Verificar que todas las rutas sean relativas
- [ ] Documentar proceso de despliegue en README

**2.2. Optimización de Carga**
- [ ] Minificar CSS y JavaScript (opcional, para producción)
- [ ] Optimizar imágenes (comprimir si es necesario)
- [ ] Implementar cache busting con versiones en URLs
- [ ] Añadir preload para recursos críticos

**2.3. Manejo de Errores**
- [ ] Mejorar mensajes de error cuando JSON no carga
- [ ] Añadir fallback si GitHub Pages tiene problemas de CORS
- [ ] Implementar retry automático para carga de datos

**2.4. Testing en GitHub Pages**
- [ ] Crear repositorio de prueba
- [ ] Desplegar y verificar funcionamiento
- [ ] Probar en diferentes navegadores
- [ ] Verificar que LocalStorage funcione correctamente

#### Criterios de Éxito
- ✅ La aplicación carga correctamente en `username.github.io/repo-name`
- ✅ Todas las funcionalidades funcionan sin servidor local
- ✅ No hay errores de CORS
- ✅ El rendimiento es aceptable

---

### 3. Vista Resumen de Todos los Días en GitHub Pages 📅

#### Objetivo
Crear una vista optimizada que muestre todos los días del itinerario en una sola página, ideal para compartir y visualizar rápidamente.

#### Tareas Específicas

**3.1. Vista "Todos los Días" Mejorada**
- [ ] Mejorar la vista actual de "Ver todos los días"
- [ ] Implementar diseño de grid responsivo
- [ ] Añadir filtros visuales (por ciudad, por tipo de día)
- [ ] Implementar expansión/colapso de días

**3.2. Vista Compacta Optimizada**
- [ ] Crear tarjetas más compactas pero informativas
- [ ] Mostrar solo información esencial (ciudad, fecha, actividades principales)
- [ ] Añadir indicadores visuales (iconos de transporte, costos)
- [ ] Implementar scroll infinito o paginación (si hay muchos días)

**3.3. Vista de Impresión**
- [ ] Crear estilos específicos para impresión (`@media print`)
- [ ] Optimizar layout para papel A4
- [ ] Añadir encabezados y pies de página
- [ ] Incluir información de resumen en cada página

**3.4. Compartir y Exportar**
- [ ] Añadir botón "Compartir" (copiar URL con parámetros)
- [ ] Mejorar exportación a PDF
- [ ] Añadir exportación a imagen (screenshot de resumen)

#### Criterios de Éxito
- ✅ La vista de todos los días es clara y fácil de navegar
- ✅ Se puede ver el itinerario completo en una sola vista
- ✅ Es fácil compartir el enlace con otros
- ✅ La impresión produce un documento legible

---

### 4. Limpieza de Datos: Eliminar Suiza en Adelante 🗑️

#### Objetivo
Eliminar temporalmente todos los días de Suiza en adelante del JSON para agregarlos iterativamente más tarde.

#### Tareas Específicas

**4.1. Identificación de Días a Eliminar**
- [ ] Identificar el primer día de Suiza (día 8)
- [ ] Documentar qué días se eliminan
- [ ] Crear backup del JSON completo antes de modificar

**4.2. Limpieza del JSON**
- [ ] Eliminar días 8-25 del array `days` en `data-v2.json`
- [ ] Actualizar metadatos si es necesario
- [ ] Verificar que el JSON siga siendo válido
- [ ] Actualizar el título/descripción si menciona "25 días"

**4.3. Actualización del Código**
- [ ] Actualizar referencias a "25 días" en HTML/JS
- [ ] Ajustar cálculos de totales si dependen del número de días
- [ ] Actualizar README con nueva información

**4.4. Documentación**
- [ ] Documentar qué días fueron eliminados
- [ ] Crear plan para agregar días de Suiza iterativamente
- [ ] Añadir comentarios en código sobre estructura futura

#### Días a Eliminar
- **Día 8:** Suiza - Llegada a Lucerna
- **Día 9:** Suiza - Interlaken
- **Día 10:** Suiza - Jungfraujoch
- **Día 11:** Suiza - Traslado a Milán
- **Días 12-25:** Milán, Roma, Venecia, Ámsterdam, Madrid

#### Criterios de Éxito
- ✅ El JSON solo contiene días 1-7 (Barcelona y París)
- ✅ La aplicación funciona correctamente con menos días
- ✅ No hay errores en consola
- ✅ El backup está guardado

---

## 📝 Plan de Trabajo Detallado

### Fase 1: Limpieza y Preparación (Prioridad Alta) 🧹

**Duración estimada:** 1-2 horas

1. **Backup de datos**
   - [ ] Crear copia de `data-v2.json` como `data-v2-backup-full.json`
   - [ ] Documentar estructura completa en comentarios

2. **Eliminación de días**
   - [ ] Eliminar días 8-25 de `data-v2.json`
   - [ ] Validar JSON con linter
   - [ ] Probar carga en aplicación

3. **Actualización de referencias**
   - [ ] Buscar "25 días" en todos los archivos
   - [ ] Actualizar a "7 días" o "Barcelona y París"
   - [ ] Actualizar título en `index.html`

4. **Testing**
   - [ ] Verificar que la aplicación carga correctamente
   - [ ] Probar todas las funcionalidades
   - [ ] Verificar que no hay errores en consola

---

### Fase 2: Optimización Móvil (Prioridad Alta) 📱

**Duración estimada:** 4-6 horas

1. **Análisis de breakpoints actuales**
   - [ ] Revisar media queries existentes
   - [ ] Identificar elementos problemáticos
   - [ ] Crear lista de mejoras necesarias

2. **CSS Mobile-First**
   - [ ] Reestructurar CSS con enfoque mobile-first
   - [ ] Implementar breakpoints estándar (320px, 768px, 1024px)
   - [ ] Optimizar tipografía para móvil

3. **Navegación móvil**
   - [ ] Implementar menú hamburguesa
   - [ ] Crear drawer para opciones
   - [ ] Añadir botón flotante "Volver arriba"

4. **Optimización de componentes**
   - [ ] Rediseñar tarjetas de días
   - [ ] Optimizar calendario para móvil
   - [ ] Mejorar formularios y controles

5. **Testing móvil**
   - [ ] Probar en Chrome DevTools (múltiples dispositivos)
   - [ ] Probar en dispositivo físico (si es posible)
   - [ ] Verificar rendimiento y usabilidad

---

### Fase 3: GitHub Pages (Prioridad Media) 🌐

**Duración estimada:** 2-3 horas

1. **Preparación del repositorio**
   - [ ] Crear `.nojekyll` si es necesario
   - [ ] Verificar estructura de archivos
   - [ ] Actualizar README con instrucciones de despliegue

2. **Optimización para producción**
   - [ ] Revisar y optimizar rutas
   - [ ] Implementar cache busting mejorado
   - [ ] Añadir preload de recursos críticos

3. **Testing en GitHub Pages**
   - [ ] Crear branch de prueba
   - [ ] Desplegar en GitHub Pages
   - [ ] Verificar funcionamiento completo
   - [ ] Probar en diferentes navegadores

4. **Documentación**
   - [ ] Actualizar README con URL de GitHub Pages
   - [ ] Documentar proceso de actualización
   - [ ] Añadir badges si es apropiado

---

### Fase 4: Vista Resumen Mejorada (Prioridad Media) 📅

**Duración estimada:** 3-4 horas

1. **Mejora de vista actual**
   - [ ] Analizar vista "Ver todos los días" actual
   - [ ] Identificar mejoras necesarias
   - [ ] Diseñar nuevo layout

2. **Implementación**
   - [ ] Crear grid responsivo mejorado
   - [ ] Añadir filtros visuales
   - [ ] Implementar expansión/colapso

3. **Vista de impresión**
   - [ ] Crear estilos `@media print`
   - [ ] Optimizar para A4
   - [ ] Añadir encabezados/pies de página

4. **Funcionalidades adicionales**
   - [ ] Implementar compartir URL
   - [ ] Mejorar exportación PDF
   - [ ] Añadir exportación a imagen

---

## 🎨 Mejoras de UX/UI Sugeridas

### Prioridad Alta
- [ ] **Loading states mejorados:** Skeleton screens en lugar de "Cargando..."
- [ ] **Error handling visual:** Mensajes de error más amigables
- [ ] **Feedback de acciones:** Toasts/notificaciones para guardar, exportar, etc.
- [ ] **Accesibilidad:** Mejorar contraste, ARIA labels, navegación por teclado

### Prioridad Media
- [ ] **Modo oscuro:** Toggle para tema oscuro
- [ ] **Animaciones suaves:** Transiciones entre vistas
- [ ] **Búsqueda mejorada:** Autocompletado, búsqueda por múltiples criterios
- [ ] **Filtros avanzados:** Por ciudad, por tipo de actividad, por costo

### Prioridad Baja
- [ ] **Gráficos:** Visualización de costos por día/ciudad
- [ ] **Mapas interactivos:** Integración con Google Maps/Mapbox
- [ ] **Compartir en redes sociales:** Botones para compartir en Twitter/Facebook
- [ ] **PWA:** Convertir en Progressive Web App para instalación móvil

---

## 📋 Checklist de Implementación

### Pre-requisitos
- [ ] Repositorio Git inicializado
- [ ] Backup completo de datos actuales
- [ ] Entorno de desarrollo configurado

### Fase 1: Limpieza
- [ ] Backup de `data-v2.json`
- [ ] Eliminar días 8-25
- [ ] Actualizar referencias en código
- [ ] Testing completo

### Fase 2: Móvil
- [ ] CSS mobile-first implementado
- [ ] Menú hamburguesa funcional
- [ ] Componentes optimizados
- [ ] Testing en dispositivos reales

### Fase 3: GitHub Pages
- [ ] Repositorio configurado
- [ ] Desplegado en GitHub Pages
- [ ] Testing en producción
- [ ] Documentación actualizada

### Fase 4: Vista Resumen
- [ ] Vista mejorada implementada
- [ ] Estilos de impresión
- [ ] Funcionalidades de compartir
- [ ] Testing completo

---

## 🔄 Proceso Iterativo para Agregar Suiza

Una vez completadas las fases anteriores, el proceso para agregar días de Suiza será:

1. **Planificación del día**
   - Definir actividades principales
   - Estimar costos
   - Buscar imágenes

2. **Agregar al JSON**
   - Añadir nuevo día al array `days`
   - Seguir la estructura existente
   - Validar JSON

3. **Testing**
   - Verificar que el día se muestra correctamente
   - Probar navegación
   - Verificar cálculos de costos

4. **Iterar**
   - Repetir para cada día de Suiza
   - Ajustar según feedback
   - Mantener consistencia con días anteriores

---

## 📚 Recursos y Referencias

### Documentación
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [CSS Mobile-First Design](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/Mobile_first)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Herramientas
- Chrome DevTools (testing móvil)
- JSONLint (validación JSON)
- Lighthouse (auditoría de rendimiento)

---

## ✅ Criterios de Aceptación Final

La aplicación se considerará completa cuando:

1. ✅ Funciona perfectamente en móviles (320px+)
2. ✅ Está desplegada y funcionando en GitHub Pages
3. ✅ Muestra solo días 1-7 (Barcelona y París)
4. ✅ Vista resumen de todos los días es clara y funcional
5. ✅ Todas las funcionalidades existentes siguen funcionando
6. ✅ No hay errores en consola
7. ✅ El código está documentado
8. ✅ README está actualizado

---

## 📝 Notas Adicionales

- **Versiones:** Mantener sistema de versionado en URLs (`?v=X`) para cache busting
- **Compatibilidad:** Asegurar compatibilidad con navegadores modernos (Chrome, Firefox, Safari, Edge)
- **Performance:** Objetivo de carga inicial < 2 segundos
- **Mantenimiento:** El código debe ser fácil de entender y modificar

---

**Última actualización:** 2025-12-14  
**Versión del spec:** 1.0  
**Estado:** 📋 Listo para implementación
