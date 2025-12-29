// Variables globales
let itineraryData = null;
let currentDay = 1;
let searchTerm = '';
let showTransportOnly = false;
let useRealisticCosts = true;
let showRecommendations = false;
let showAllDays = false;
let showSummary = true;
let currentDataVersion = 'data-v2.json';

// Variables del calendario
let tripStartDate = new Date('2026-09-05'); // Fecha por defecto: 5 de septiembre de 2026
let calculatedDates = {};

// Variables de conversión de moneda
let exchangeRateUSDToCOP = 4200; // Tasa de cambio USD a COP (configurable)
let showCOPConversion = true; // Mostrar conversión a pesos colombianos

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadDateSettings(); // Cargar configuración de fechas
    loadCurrencySettings(); // Cargar configuración de moneda
    loadItineraryData();
    setupMobileMenu(); // Menú hamburguesa móvil
    setupScrollToTop(); // Botón volver arriba
});

// Cargar datos del itinerario
async function loadItineraryData(version = null) {
    try {
        const dataFile = version || currentDataVersion;
        // Usar ruta relativa para GitHub Pages (sin ./ al inicio si ya está)
        const dataPath = dataFile.startsWith('http') ? dataFile : dataFile;
        console.log(`Intentando cargar ${dataPath}...`);
        const response = await fetch(dataPath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        itineraryData = await response.json();
        console.log('Datos cargados exitosamente:', itineraryData);
        
        // Debug específico para día 1 y día 3
        const day1 = itineraryData.days.find(d => d.day === 1);
        if (day1) {
            console.log('🏛️ DÍA 1 DATOS CARGADOS:', {
                city: day1.city,
                activitiesCount: day1.mainActivities.length,
                activities: day1.mainActivities.map(a => a.name)
            });
        }
        
        const day3 = itineraryData.days.find(d => d.day === 3);
        if (day3) {
            console.log('🏖️ DÍA 3 DATOS CARGADOS:', {
                city: day3.city,
                activitiesCount: day3.mainActivities.length,
                activities: day3.mainActivities.map(a => ({
                    name: a.name,
                    hasImageUrl: !!a.imageUrl,
                    imageUrl: a.imageUrl
                }))
            });
        }
        
        // Cargar desde localStorage si existe
        const saved = localStorage.getItem('europeItinerary');
        if (saved) {
            try {
                const savedData = JSON.parse(saved);
                itineraryData = { ...itineraryData, ...savedData };
                console.log('Datos de localStorage aplicados');
            } catch (e) {
                console.log('Error cargando datos guardados:', e);
            }
        }
        
        calculateAllDates(); // Calcular fechas después de cargar datos
        renderDaySelector();
        renderSummaryPage();
    } catch (error) {
        console.error('Error cargando datos:', error);
        document.getElementById('dayContent').innerHTML = `
            <div class="day-card" style="text-align: center; padding: 50px;">
                <h3>❌ Error cargando datos</h3>
                <p>Error: ${error.message}</p>
                <p>Si estás en desarrollo local, asegúrate de que el servidor esté corriendo.</p>
                <p>Si estás en GitHub Pages, verifica que el archivo <code>data-v2.json</code> esté en el repositorio.</p>
                <button onclick="location.reload()" class="btn btn-primary">🔄 Reintentar</button>
            </div>
        `;
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Selector de días
    const daySelector = document.getElementById('daySelector');
    if (daySelector) {
        daySelector.addEventListener('change', function(e) {
            if (e.target.value === 'summary') {
                showSummary = true;
                showAllDays = false;
                renderSummaryPage();
            } else if (e.target.value === 'all') {
                showSummary = false;
                showAllDays = true;
                renderAllDays();
            } else if (e.target.value && e.target.value !== '') {
                showSummary = false;
                showAllDays = false;
                currentDay = parseInt(e.target.value);
                renderCurrentDay();
            }
        });
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchTerm = e.target.value.toLowerCase();
            if (showSummary) {
                renderSummaryPage();
            } else if (showAllDays) {
                renderAllDays();
            } else {
                filterAndRender();
            }
        });
    }

    const transportOnly = document.getElementById('transportOnly');
    if (transportOnly) {
        transportOnly.addEventListener('change', function(e) {
            showTransportOnly = e.target.checked;
            if (showSummary) {
                renderSummaryPage();
            } else if (showAllDays) {
                renderAllDays();
            } else {
                filterAndRender();
            }
        });
    }

    const costMode = document.getElementById('costMode');
    if (costMode) {
        costMode.addEventListener('change', function(e) {
            useRealisticCosts = e.target.checked;
            if (showSummary) {
                renderSummaryPage();
            } else if (showAllDays) {
                renderAllDays();
            } else {
                renderCurrentDay();
            }
        });
    }

    const showRecommendationsToggle = document.getElementById('showRecommendations');
    if (showRecommendationsToggle) {
        showRecommendationsToggle.addEventListener('change', function(e) {
            showRecommendations = e.target.checked;
            if (showSummary) {
                renderSummaryPage();
            } else {
                renderCurrentDay();
            }
        });
    }
    
    // Navegación con teclado
    document.addEventListener('keydown', function(e) {
        // Solo funciona cuando no estamos en el resumen y no estamos escribiendo en un input
        if (showSummary || showAllDays || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentDay > 1) {
                selectDay(currentDay - 1);
            }
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (itineraryData && currentDay < itineraryData.days.length) {
                selectDay(currentDay + 1);
            }
        }
    });
}

// Renderizar selector de días
function renderDaySelector() {
    const selector = document.getElementById('daySelector');
    if (!selector || !itineraryData) return;
    
    selector.innerHTML = `
        <option value="summary">🏠 Resumen General</option>
        <option value="all">📅 Ver todos los días</option>
        <option value="">--- Días individuales ---</option>
    `;
    
    itineraryData.days.forEach(day => {
        const option = document.createElement('option');
        option.value = day.day;
        const dateInfo = getShortDate(day.day) || formatDate(day.date);
        option.textContent = `Día ${day.day} - ${day.city} (${dateInfo})`;
        selector.appendChild(option);
    });
}

// Renderizar página de resumen
function renderSummaryPage() {
    if (!itineraryData) return;
    
    const content = document.getElementById('dayContent');
    if (!content) return;
    
    let html = '';
    
    // Agregar componente de calendario
    html += renderCalendarComponent();
    
    // Agregar configuración de moneda
    html += renderCurrencySettings();
    
    if (showRecommendations) {
        html += renderRecommendationsPanel();
    }
    
    // Estadísticas generales
    const totalDays = itineraryData.days.length;
    const cities = [...new Set(itineraryData.days.map(d => d.city))];
    const countries = ['España', 'Francia', 'Suiza', 'Italia', 'Países Bajos'];
    const totalCostBase = calculateTotalCost(false);
    const totalCostReal = calculateTotalCost(true);
    
    html += `
        <div class="summary-overview">
            <h2 class="summary-title">🌍 Resumen del Viaje por Europa</h2>
            
            <div class="summary-stats">
                <div class="stat-card">
                    <div class="stat-number">${totalDays}</div>
                    <div class="stat-label">Días de Viaje</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${cities.length}</div>
                    <div class="stat-label">Ciudades</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${countries.length}</div>
                    <div class="stat-label">Países</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${formatCostWithConversion(useRealisticCosts ? totalCostReal : totalCostBase)}</div>
                    <div class="stat-label">Costo Total</div>
                </div>
            </div>
            
            <h3 style="margin-bottom: 15px; color: #2c3e50;">🏙️ Ciudades del Itinerario</h3>
            <div class="cities-timeline">
                ${cities.map((city, index) => `
                    <div class="city-badge">
                        <span>${index + 1}</span>
                        <span>${city}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="quick-actions">
                <button class="btn btn-primary" onclick="document.getElementById('daySelector').value='all'; renderAllDays();">
                    📅 Ver Todos los Días
                </button>
                <button class="btn btn-secondary" onclick="exportJSON()">
                    📤 Exportar Itinerario
                </button>
                <button class="btn btn-success" onclick="exportCSV()">
                    📊 Exportar Presupuesto
                </button>
            </div>
        </div>
    `;
    
    // Vista compacta de todos los días
    let filteredDays = itineraryData.days;
    
    if (showTransportOnly) {
        filteredDays = filteredDays.filter(day => day.transportToNext.mode);
    }
    
    if (searchTerm) {
        filteredDays = filteredDays.filter(day => {
            const searchText = `${day.city} ${day.mainActivities.map(a => a.name).join(' ')}`.toLowerCase();
            return searchText.includes(searchTerm);
        });
    }
    
    html += '<div class="all-days-view">';
    html += filteredDays.map(day => renderDayCardCompact(day)).join('');
    html += '</div>';
    
    content.innerHTML = html;
}

// Filtrar y renderizar
function filterAndRender() {
    if (!itineraryData) return;
    
    const filteredDays = itineraryData.days.filter(day => {
        if (showTransportOnly && !day.transportToNext.mode) {
            return false;
        }
        
        if (searchTerm) {
            const searchText = `${day.city} ${day.mainActivities.map(a => a.name).join(' ')}`.toLowerCase();
            return searchText.includes(searchTerm);
        }
        
        return true;
    });

    if (filteredDays.length === 0) {
        document.getElementById('dayContent').innerHTML = '<div class="day-card"><h3>No se encontraron días que coincidan con la búsqueda</h3></div>';
        return;
    }

    if (filteredDays.length === 1) {
        currentDay = filteredDays[0].day;
        document.getElementById('daySelector').value = currentDay;
        renderCurrentDay();
    } else {
        // Mostrar múltiples días
        renderMultipleDays(filteredDays);
    }
}

// Renderizar múltiples días
function renderMultipleDays(days) {
    const content = document.getElementById('dayContent');
    content.innerHTML = days.map(day => renderDayCard(day)).join('');
}

// Renderizar día actual
function renderCurrentDay() {
    if (!itineraryData) return;
    
    const day = itineraryData.days.find(d => d.day === currentDay);
    if (!day) return;

    const content = document.getElementById('dayContent');
    let html = '';
    
    // Agregar navegación superior
    html += renderDayNavigation(currentDay);
    
    if (showRecommendations) {
        html += renderRecommendationsPanel();
    }
    
    html += renderDayCard(day);
    
    // Agregar navegación inferior
    html += renderDayNavigation(currentDay);
    
    content.innerHTML = html;
    
    // Configurar event listeners del calendario después de renderizar
    setupCalendarEventListeners();
    
    // Configurar event listeners de moneda después de renderizar
    setupCurrencyEventListeners();
}

// Renderizar todos los días
function renderAllDays() {
    if (!itineraryData) return;
    
    let filteredDays = itineraryData.days;
    
    if (showTransportOnly) {
        filteredDays = filteredDays.filter(day => day.transportToNext.mode);
    }
    
    if (searchTerm) {
        filteredDays = filteredDays.filter(day => {
            const searchText = `${day.city} ${day.mainActivities.map(a => a.name).join(' ')}`.toLowerCase();
            return searchText.includes(searchTerm);
        });
    }

    const content = document.getElementById('dayContent');
    let html = '';
    
    // Header mejorado con estadísticas
    const totalCost = filteredDays.reduce((sum, day) => {
        const dayTotal = useRealisticCosts ? (day.totals?.totalReal || calculateDayTotal(day)) : (day.totals?.totalBase || calculateDayTotal(day));
        return sum + dayTotal;
    }, 0);
    
    const cities = [...new Set(filteredDays.map(d => d.city))];
    const totalActivities = filteredDays.reduce((sum, day) => sum + (day.mainActivities?.length || 0), 0);
    
    html += '<div class="all-days-header">';
    html += '<h2 class="all-days-title">📅 Todos los Días del Itinerario</h2>';
    html += '<div class="all-days-stats">';
    html += `<div class="all-days-stat"><span class="stat-value">${filteredDays.length}</span><span class="stat-label">Días</span></div>`;
    html += `<div class="all-days-stat"><span class="stat-value">${cities.length}</span><span class="stat-label">Ciudades</span></div>`;
    html += `<div class="all-days-stat"><span class="stat-value">${totalActivities}</span><span class="stat-label">Actividades</span></div>`;
    html += `<div class="all-days-stat"><span class="stat-value">$${totalCost.toFixed(0)}</span><span class="stat-label">Total ${useRealisticCosts ? 'Real' : 'Base'}</span></div>`;
    html += '</div>';
    
    // Filtros por ciudad
    if (cities.length > 1) {
        html += '<div class="city-filters">';
        html += '<button class="city-filter-btn active" data-city="all">Todas</button>';
        cities.forEach(city => {
            html += `<button class="city-filter-btn" data-city="${city}">${city}</button>`;
        });
        html += '</div>';
    }
    html += '</div>';
    
    if (showRecommendations) {
        html += renderRecommendationsPanel();
    }
    
    html += '<div class="all-days-view">';
    html += filteredDays.map(day => renderDayCardCompact(day)).join('');
    html += '</div>';
    
    content.innerHTML = html;
    
    // Configurar event listeners de filtros
    setupCityFilters();
}

// Configurar filtros por ciudad
function setupCityFilters() {
    const filterButtons = document.querySelectorAll('.city-filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const city = this.getAttribute('data-city');
            
            // Actualizar botones activos
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar días
            const allCards = document.querySelectorAll('.day-card-compact');
            allCards.forEach(card => {
                const cardCity = card.getAttribute('data-city');
                if (city === 'all' || cardCity === city) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Renderizar panel de recomendaciones
function renderRecommendationsPanel() {
    if (!itineraryData?.recommendations) return '';
    
    let html = '<div class="recommendations-panel">';
    html += '<div class="recommendations-title">💡 Recomendaciones para tu viaje</div>';
    
    itineraryData.recommendations.forEach(rec => {
        html += `
            <div class="recommendation-card">
                <div class="recommendation-header">
                    <div class="recommendation-title">${rec.title}</div>
                    <div class="recommendation-type">${rec.type}</div>
                </div>
                <div class="recommendation-description">${rec.description}</div>
                ${rec.link ? `<a href="${rec.link}" target="_blank" class="recommendation-link">🔗 Más información</a>` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Renderizar tarjeta compacta de día
function renderDayCardCompact(day) {
    // Usar totals si está disponible, sino calcular como antes
    const totalDay = day.totals ? 
        (useRealisticCosts ? day.totals.totalReal : day.totals.totalBase) :
        calculateDayTotal(day);

    return `
        <div class="day-card-compact" data-city="${day.city}" onclick="selectDay(${day.day})">
            <div class="day-header-compact">
                <div class="day-title-compact">
                    Día ${day.day} - ${highlightSearch(day.city)}
                    ${getFormattedDate(day.day) ? `<span class="day-date-compact">(${getShortDate(day.day)})</span>` : ''}
                </div>
                <div class="stay-area-compact">${day.stayArea}</div>
            </div>
            
            <div class="activities-section">
                ${day.mainActivities.map((activity, index) => {
                    // Detectar si es traslado
                    const isTransport = isTransportActivity(activity.name);
                    
                    if (isTransport) {
                        // Renderizar traslado en vista compacta
                        const transportInfo = getTransportType(activity.name, activity.notes);
                        return `
                        <div class="activity-compact transport-compact">
                            <div class="transport-icon-small">
                                ${transportInfo.emoji}
                            </div>
                            <div class="activity-info">
                                <div class="activity-name-compact">${highlightSearch(activity.name)}</div>
                                <div class="activity-time-compact">${activity.start} • ${transportInfo.label}</div>
                            </div>
                        </div>
                        `;
                    } else {
                        // Renderizar actividad normal
                        const imageUrl = getActivityImageUrl(activity.name, day.city, activity);
                        return `
                        <div class="activity-compact">
                            <div class="activity-image-container">
                                <img src="${imageUrl}" 
                                     alt="${activity.name}" 
                                     class="activity-image"
                                     loading="lazy"
                                     onerror="console.error('❌ Error cargando imagen para ${activity.name}:', this.src); this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                <div class="activity-image-placeholder" style="display: none;">
                                    ${getActivityIcon(activity.name)}
                                </div>
                            </div>
                            <div class="activity-info">
                                <div class="activity-name-compact">${highlightSearch(activity.name)}</div>
                                <div class="activity-time-compact">${activity.start}</div>
                            </div>
                        </div>
                        `;
                    }
                }).join('')}
                ${day.mainActivities.length > 3 ? `<div style="text-align: center; color: #666; font-size: 0.8rem;">+${day.mainActivities.length - 3} actividades más</div>` : ''}
            </div>
            
            <div class="costs-compact">
                <span>Total del día:</span>
                <span class="total-compact">${formatCostWithConversion(totalDay)}</span>
            </div>
        </div>
    `;
}

// Renderizar tarjeta de día completa
function renderDayCard(day) {
    // Usar totals si está disponible, sino calcular como antes
    const totalDay = day.totals ? 
        (useRealisticCosts ? day.totals.totalReal : day.totals.totalBase) :
        calculateDayTotal(day);
    
    // Recrear objeto costs para compatibilidad con el HTML
    const costs = useRealisticCosts ? {
        lodging: day.costs.lodgingReal || day.costs.lodgingBase,
        food: day.costs.foodReal || day.costs.foodBase,
        transport: day.costs.transportReal || day.costs.transportBase,
        activities: day.costs.activitiesReal || day.costs.activitiesBase
    } : {
        lodging: day.costs.lodgingBase,
        food: day.costs.foodBase,
        transport: day.costs.transportBase,
        activities: day.costs.activitiesBase
    };
    
    const accumulatedTotal = calculateAccumulatedTotal(day.day);
    
    // Generar imagen hero de la ciudad
    const heroImageUrl = getHeroImageUrl(day.city, day.heroImageQuery || `${day.city} landmark`, day);
    
    // Mostrar información adicional si está disponible
    const countryFlag = getCountryFlag(day.country);
    const currencySymbol = getCurrencySymbol(day.currencyLocal);

    return `
        <div class="day-card">
            ${heroImageUrl ? `<div class="hero-image-container">
                <img src="${heroImageUrl}" alt="${day.city} landmark" class="hero-image" loading="lazy">
            </div>` : ''}
            
            <div class="day-header">
                <div class="day-title">
                    ${countryFlag} Día ${day.day} - ${highlightSearch(day.city)} 
                    ${day.country ? `(${day.country})` : ''} 
                    <span class="date">${getFormattedDate(day.day) || formatDate(day.date)}</span>
                </div>
                <div class="city-info">
                    ${day.cityCode ? `<span class="city-code">${day.cityCode}</span>` : ''}
                    ${day.currencyLocal ? `<span class="currency">${currencySymbol} ${day.currencyLocal}</span>` : ''}
                </div>
                <div class="stay-area">${day.stayArea}</div>
                ${day.perks && day.perks.length > 0 ? `
                    <div class="perks-section">
                        <div class="perks-title">💡 Tips del día:</div>
                        <div class="perks-list">
                            ${day.perks.map(perk => `<span class="perk-item">${perk}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>

            <div class="activities-section">
                <div class="section-title">🎯 Actividades Principales</div>
                ${day.mainActivities.map((activity, index) => {
                    // Detectar si es traslado
                    const isTransport = isTransportActivity(activity.name);
                    
                    if (isTransport) {
                        // Renderizar como traslado
                        const transportInfo = getTransportType(activity.name, activity.notes);
                        const duration = formatTransportDuration(activity.durationMin);
                        
                        return `
                        <div class="activity-card transport-card">
                            <div class="transport-icon-large">
                                ${transportInfo.emoji}
                            </div>
                            <div class="activity-content">
                                <div class="activity-header">
                                    <div class="activity-name">${highlightSearch(activity.name)}</div>
                                    <div class="transport-badge">${transportInfo.label}</div>
                                </div>
                                <div class="transport-details">
                                    <div class="transport-time">
                                        <span class="transport-label">🕐 Hora:</span> ${activity.start}
                                    </div>
                                    <div class="transport-duration">
                                        <span class="transport-label">⏱️ Duración:</span> ${duration}
                                    </div>
                                    ${activity.notes ? `
                                        <div class="transport-notes">
                                            <span class="transport-label">📝 Detalles:</span> ${activity.notes}
                                        </div>
                                    ` : ''}
                                    ${activity.link ? `
                                        <a href="${activity.link}" target="_blank" class="transport-link">
                                            🔗 Reservar / Info
                                        </a>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                        `;
                    } else {
                        // Renderizar como actividad normal
                        const imageUrl = getActivityImageUrl(activity.name, day.city, activity);
                        return `
                        <div class="activity-card">
                            <div class="activity-image-container">
                                <img src="${imageUrl}" 
                                     alt="${activity.name}" 
                                     class="activity-image-large"
                                     loading="lazy"
                                     onerror="console.error('❌ Error cargando imagen para ${activity.name}:', this.src); this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                <div class="activity-image-placeholder" style="display: none; width: 100%; height: 250px; background: #e9ecef; border-radius: 15px; align-items: center; justify-content: center; font-size: 3em;">
                                    ${getActivityIcon(activity.name)}
                                </div>
                            </div>
                            <div class="activity-content">
                                <div class="activity-header">
                                    <div class="activity-name">${highlightSearch(activity.name)}</div>
                                    <div class="activity-time">${activity.start} (${activity.durationMin}min)</div>
                                </div>
                                ${activity.notes && (activity.notes.toLowerCase().includes('incluido') || activity.notes.toLowerCase().includes('incluye') || activity.notes.toLowerCase().includes('incluidas')) ? `
                                    <div class="activity-included">
                                        <div class="included-title">✨ Incluye:</div>
                                        <div class="included-items">${activity.notes}</div>
                                    </div>
                                ` : ''}
                                <div class="activity-details">
                                    <input type="text" class="activity-input" value="${activity.start}" 
                                           onchange="updateActivity(${day.day}, '${activity.name}', 'start', this.value)">
                                    <input type="text" class="activity-input" value="${activity.notes}" 
                                           onchange="updateActivity(${day.day}, '${activity.name}', 'notes', this.value)"
                                           placeholder="Notas...">
                                    ${activity.link ? `<a href="${activity.link}" target="_blank" class="activity-link">🔗 Link</a>` : ''}
                                </div>
                            </div>
                        </div>
                        `;
                    }
                }).join('')}
            </div>

            ${day.transportToNext.mode ? `
                <div class="transport-section">
                    <div class="transport-header">
                        <div class="transport-icon">${getTransportIcon(day.transportToNext.mode)}</div>
                        <div class="transport-title">Transporte a la siguiente ciudad</div>
                    </div>
                    <div class="transport-details">
                        <input type="text" class="transport-input" value="${day.transportToNext.from || ''}" 
                               onchange="updateTransport(${day.day}, 'from', this.value)" placeholder="Desde">
                        <input type="text" class="transport-input" value="${day.transportToNext.to || ''}" 
                               onchange="updateTransport(${day.day}, 'to', this.value)" placeholder="Hacia">
                        <input type="text" class="transport-input" value="${day.transportToNext.depart || ''}" 
                               onchange="updateTransport(${day.day}, 'depart', this.value)" placeholder="Salida (HH:MM)">
                        <input type="text" class="transport-input" value="${day.transportToNext.arrive || ''}" 
                               onchange="updateTransport(${day.day}, 'arrive', this.value)" placeholder="Llegada (HH:MM)">
                        <input type="text" class="transport-input" value="${day.transportToNext.code || ''}" 
                               onchange="updateTransport(${day.day}, 'code', this.value)" placeholder="Código">
                        ${day.transportToNext.bookingLink ? `<a href="${day.transportToNext.bookingLink}" target="_blank" class="activity-link">🎫 Reservar</a>` : ''}
                    </div>
                </div>
            ` : ''}

            <div class="costs-section">
                <div class="section-title">💰 Costos del Día</div>
                <div class="costs-grid">
                    <div class="cost-item">
                        <div class="cost-label">Alojamiento</div>
                        <input type="number" class="cost-input" value="${costs.lodging}" 
                               onchange="updateCost(${day.day}, 'lodging', this.value, ${useRealisticCosts})">
                    </div>
                    <div class="cost-item">
                        <div class="cost-label">Comida</div>
                        <input type="number" class="cost-input" value="${costs.food}" 
                               onchange="updateCost(${day.day}, 'food', this.value, ${useRealisticCosts})">
                    </div>
                    <div class="cost-item">
                        <div class="cost-label">Transporte</div>
                        <input type="number" class="cost-input" value="${costs.transport}" 
                               onchange="updateCost(${day.day}, 'transport', this.value, ${useRealisticCosts})">
                    </div>
                    <div class="cost-item">
                        <div class="cost-label">Actividades</div>
                        <input type="number" class="cost-input" value="${costs.activities}" 
                               onchange="updateCost(${day.day}, 'activities', this.value, ${useRealisticCosts})">
                    </div>
                </div>
            </div>

            <div class="totals">
                <div class="section-title">📊 Totales</div>
                <div class="totals-grid">
                    <div class="total-item">
                        <div class="total-label">Total Día</div>
                        <div class="total-value">${formatCostWithConversion(totalDay)}</div>
                    </div>
                    <div class="total-item">
                        <div class="total-label">Acumulado</div>
                        <div class="total-value">${formatCostWithConversion(accumulatedTotal)}</div>
                    </div>
                    <div class="total-item">
                        <div class="total-label">Grupo 6 personas</div>
                        <div class="total-value">${formatCostWithConversion(accumulatedTotal * 6)}</div>
                    </div>
                    <div class="total-item">
                        <div class="total-label">Grupo 8 personas</div>
                        <div class="total-value">${formatCostWithConversion(accumulatedTotal * 8)}</div>
                    </div>
                </div>
            </div>

            ${day.mapPoints.length > 0 ? `
                <div style="margin-top: 20px; text-align: center;">
                    <a href="${generateGoogleMapsLink(day.mapPoints)}" target="_blank" class="btn btn-primary">
                        🗺️ Ver ruta en Google Maps
                    </a>
                </div>
            ` : ''}
        </div>
    `;
}

// Funciones de actualización
function updateActivity(dayNum, activityName, field, value) {
    if (!itineraryData) return;
    
    const day = itineraryData.days.find(d => d.day === dayNum);
    const activity = day.mainActivities.find(a => a.name === activityName);
    if (activity) {
        activity[field] = value;
        saveToLocalStorage();
    }
}

function updateTransport(dayNum, field, value) {
    if (!itineraryData) return;
    
    const day = itineraryData.days.find(d => d.day === dayNum);
    if (day.transportToNext) {
        day.transportToNext[field] = value;
        saveToLocalStorage();
    }
}

function updateCost(dayNum, costType, value, isRealistic) {
    if (!itineraryData) return;
    
    const day = itineraryData.days.find(d => d.day === dayNum);
    const costKey = isRealistic ? 
        (costType === 'lodging' ? 'lodgingReal' : 
         costType === 'food' ? 'foodReal' : 
         costType + 'Base') : 
        costType + 'Base';
    
    day.costs[costKey] = parseInt(value) || 0;
    saveToLocalStorage();
    
    if (showSummary) {
        renderSummaryPage();
    } else if (showAllDays) {
        renderAllDays();
    } else {
        renderCurrentDay();
    }
}

// Funciones de utilidad
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
}

function highlightSearch(text) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

function getTransportIcon(mode) {
    const icons = {
        'tren': '🚂',
        'vuelo': '✈️',
        'bus': '🚌',
        'metro': '🚇'
    };
    return icons[mode] || '🚗';
}

function calculateAccumulatedTotal(dayNum) {
    if (!itineraryData) return 0;
    
    let total = 0;
    for (let i = 1; i <= dayNum; i++) {
        const day = itineraryData.days.find(d => d.day === i);
        if (day) {
            const costs = useRealisticCosts ? {
                lodging: day.costs.lodgingReal,
                food: day.costs.foodReal,
                transport: day.costs.transportBase,
                activities: day.costs.activitiesBase
            } : {
                lodging: day.costs.lodgingBase,
                food: day.costs.foodBase,
                transport: day.costs.transportBase,
                activities: day.costs.activitiesBase
            };
            total += costs.lodging + costs.food + costs.transport + costs.activities;
        }
    }
    return total;
}

function calculateTotalCost(isRealistic) {
    if (!itineraryData) return 0;
    
    let total = 0;
    itineraryData.days.forEach(day => {
        const costs = isRealistic ? {
            lodging: day.costs.lodgingReal,
            food: day.costs.foodReal,
            transport: day.costs.transportBase,
            activities: day.costs.activitiesBase
        } : {
            lodging: day.costs.lodgingBase,
            food: day.costs.foodBase,
            transport: day.costs.transportBase,
            activities: day.costs.activitiesBase
        };
        total += costs.lodging + costs.food + costs.transport + costs.activities;
    });
    return total;
}

function generateGoogleMapsLink(points) {
    if (points.length === 0) return '#';
    const waypoints = points.slice(0, -1).join('|');
    const destination = points[points.length - 1];
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&waypoints=${encodeURIComponent(waypoints)}`;
}

// Obtener imagen de actividad
function getActivityImage(activityName, city) {
    const imageMap = {
        'Sagrada Familia': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=100&h=100&fit=crop',
        'Louvre': 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=100&h=100&fit=crop',
        'Torre Eiffel': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=100&h=100&fit=crop',
        'Coliseo': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=100&h=100&fit=crop',
        'Disneyland': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop',
        'Rijksmuseum': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
        'Museo del Prado': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
        'San Marcos': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=100&h=100&fit=crop',
        'Duomo': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=100&h=100&fit=crop',
        'Mt. Pilatus': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop',
        'GoldenPass': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop',
        'Las Ramblas': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=100&h=100&fit=crop',
        'Montmartre': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=100&h=100&fit=crop',
        'Le Marais': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=100&h=100&fit=crop',
        'Trastevere': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=100&h=100&fit=crop',
        'Jordaan': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
        'Gran Vía': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
        'Parque del Retiro': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
        'Valencia': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'
    };

    const imageUrl = imageMap[activityName] || getCityImage(city);
    
    return `
        <img src="${imageUrl}" 
             alt="${activityName}" 
             class="activity-image"
             loading="lazy"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="activity-image-placeholder" style="display: none;">
            ${getActivityIcon(activityName)}
        </div>
    `;
}

// Obtener imagen grande de actividad
function getActivityImageLarge(activityName, city) {
    const imageMap = {
        'Sagrada Familia': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=160&h=160&fit=crop',
        'Louvre': 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=160&h=160&fit=crop',
        'Torre Eiffel': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=160&h=160&fit=crop',
        'Coliseo': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=160&h=160&fit=crop',
        'Disneyland': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=160&h=160&fit=crop',
        'Rijksmuseum': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Museo del Prado': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'San Marcos': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=160&h=160&fit=crop',
        'Duomo': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=160&h=160&fit=crop',
        'Mt. Pilatus': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=160&h=160&fit=crop',
        'GoldenPass': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=160&h=160&fit=crop',
        'Las Ramblas': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=160&h=160&fit=crop',
        'Montmartre': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=160&h=160&fit=crop',
        'Le Marais': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=160&h=160&fit=crop',
        'Trastevere': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=160&h=160&fit=crop',
        'Jordaan': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Gran Vía': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Parque del Retiro': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Valencia': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Musée d\'Orsay': 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=160&h=160&fit=crop',
        'Crucero por el Sena': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=160&h=160&fit=crop',
        'Fuente de Trevi': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=160&h=160&fit=crop',
        'Panteón': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=160&h=160&fit=crop',
        'Plaza Navona': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=160&h=160&fit=crop',
        'Foro Romano': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=160&h=160&fit=crop',
        'Góndola compartida': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=160&h=160&fit=crop',
        'Puente de Rialto': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=160&h=160&fit=crop',
        'Murano': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=160&h=160&fit=crop',
        'Negen Straatjes': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Atardecer en Damrak': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Begijnhof': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Vondelpark': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Barrio Rojo': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'A\'DAM Lookout': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Puerta del Sol': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'La Latina': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Playa Malvarrosa': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'El Saler': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Compras Fuencarral': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Mercado de San Miguel': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop'
    };

    const imageUrl = imageMap[activityName] || getCityImageLarge(city);
    
    return `
        <img src="${imageUrl}" 
             alt="${activityName}" 
             class="activity-image-large"
             loading="lazy"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="activity-image-placeholder" style="display: none; width: 80px; height: 80px;">
            ${getActivityIcon(activityName)}
        </div>
    `;
}

// Obtener imagen grande de ciudad
function getCityImageLarge(city) {
    const cityImages = {
        'Barcelona': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=160&h=160&fit=crop',
        'París': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=160&h=160&fit=crop',
        'Suiza': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=160&h=160&fit=crop',
        'Milán': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=160&h=160&fit=crop',
        'Roma': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=160&h=160&fit=crop',
        'Venecia': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=160&h=160&fit=crop',
        'Ámsterdam': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Madrid': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Valencia': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop'
    };
    return cityImages[city] || 'https://images.unsplash.com/photo-1488646957014-85ba4a8f1f89?w=160&h=160&fit=crop';
}

// Obtener imagen de ciudad
function getCityImage(city) {
    const cityImages = {
        'Barcelona': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=100&h=100&fit=crop',
        'París': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=100&h=100&fit=crop',
        'Suiza': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop',
        'Milán': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=100&h=100&fit=crop',
        'Roma': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=100&h=100&fit=crop',
        'Venecia': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=100&h=100&fit=crop',
        'Ámsterdam': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
        'Madrid': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
        'Valencia': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'
    };
    return cityImages[city] || 'https://images.unsplash.com/photo-1488646957014-85ba4a8f1f89?w=100&h=100&fit=crop';
}

// ============================================
// DETECCIÓN Y RENDERIZADO DE TRASLADOS
// ============================================

// Detectar si una actividad es un traslado
function isTransportActivity(activityName) {
    const transportKeywords = [
        'traslado', 'tránsito', 'transporte', 'viaje',
        'vuelo', 'flight', 'avión', 'aeropuerto',
        'tren', 'train', 'ferrocarril',
        'bus', 'autobús', 'coach',
        'carro', 'auto', 'coche',
        'taxi', 'uber',
        'barco', 'ferry', 'crucero'
    ];
    
    const nameLower = activityName.toLowerCase();
    return transportKeywords.some(keyword => nameLower.includes(keyword));
}

// Determinar tipo de transporte y emoji
function getTransportType(activityName, notes = '') {
    const nameLower = activityName.toLowerCase();
    const notesLower = (notes || '').toLowerCase();
    const combined = nameLower + ' ' + notesLower;
    
    // Avión
    if (combined.includes('vuelo') || combined.includes('flight') || 
        combined.includes('avión') || combined.includes('aeropuerto') ||
        combined.includes('ams→') || combined.includes('zrh') ||
        combined.includes('→zrh') || combined.includes('→ams')) {
        return { type: 'flight', emoji: '✈️', label: 'Vuelo' };
    }
    
    // Tren
    if (combined.includes('tren') || combined.includes('train') ||
        combined.includes('tgv') || combined.includes('eurostar') ||
        combined.includes('thalys') || combined.includes('express') ||
        combined.includes('ferrocarril') || combined.includes('rer') ||
        combined.includes('sbb') || combined.includes('goldenpass')) {
        return { type: 'train', emoji: '🚂', label: 'Tren' };
    }
    
    // Barco/Ferry
    if (combined.includes('barco') || combined.includes('ferry') ||
        combined.includes('crucero') || combined.includes('boat')) {
        return { type: 'boat', emoji: '⛴️', label: 'Barco' };
    }
    
    // Bus/Autobús
    if (combined.includes('bus') || combined.includes('autobús') ||
        combined.includes('coach')) {
        return { type: 'bus', emoji: '🚌', label: 'Autobús' };
    }
    
    // Carro/Auto
    if (combined.includes('carro') || combined.includes('auto') ||
        combined.includes('coche') || combined.includes('taxi') ||
        combined.includes('uber')) {
        return { type: 'car', emoji: '🚗', label: 'Carro' };
    }
    
    // Por defecto, si es traslado pero no se identifica el tipo
    return { type: 'transport', emoji: '🚆', label: 'Traslado' };
}

// Formatear duración de traslado
function formatTransportDuration(durationMin) {
    if (!durationMin) return '';
    
    const hours = Math.floor(durationMin / 60);
    const minutes = durationMin % 60;
    
    if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}min`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${minutes}min`;
    }
}

// Obtener icono de actividad
function getActivityIcon(activityName) {
    if (activityName.includes('Museo') || activityName.includes('Museum')) return '🏛️';
    if (activityName.includes('Iglesia') || activityName.includes('Catedral') || activityName.includes('Basílica')) return '⛪';
    if (activityName.includes('Parque') || activityName.includes('Park')) return '🌳';
    if (activityName.includes('Playa') || activityName.includes('Beach')) return '🏖️';
    if (activityName.includes('Montaña') || activityName.includes('Mt.')) return '🏔️';
    if (activityName.includes('Tren') || activityName.includes('Train')) return '🚂';
    if (activityName.includes('Vuelo') || activityName.includes('Flight')) return '✈️';
    if (activityName.includes('Crucero') || activityName.includes('Cruise')) return '🚢';
    if (activityName.includes('Góndola')) return '🚣';
    if (activityName.includes('Disney')) return '🏰';
    return '📍';
}

// Seleccionar día desde vista compacta
function selectDay(dayNum) {
    showSummary = false;
    showAllDays = false;
    currentDay = dayNum;
    const selector = document.getElementById('daySelector');
    if (selector) {
        selector.value = dayNum;
    }
    renderCurrentDay();
}

// Funciones de persistencia
function saveToLocalStorage() {
    if (itineraryData) {
        localStorage.setItem('europeItinerary', JSON.stringify(itineraryData));
    }
}

function exportJSON() {
    if (!itineraryData) return;
    
    const dataStr = JSON.stringify(itineraryData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'itinerario_europa_25_dias.json';
    link.click();
    URL.revokeObjectURL(url);
}

function importJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const imported = JSON.parse(e.target.result);
                    itineraryData = { ...itineraryData, ...imported };
                    saveToLocalStorage();
                    renderDaySelector();
                    if (showSummary) {
                        renderSummaryPage();
                    } else if (showAllDays) {
                        renderAllDays();
                    } else {
                        renderCurrentDay();
                    }
                    alert('Datos importados correctamente');
                } catch (error) {
                    alert('Error al importar el archivo JSON');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function exportCSV() {
    if (!itineraryData) return;
    
    const headers = ['Día', 'Fecha', 'Ciudad', 'Total Base USD', 'Total Base COP', 'Total Realista USD', 'Total Realista COP', 'Acumulado Base USD', 'Acumulado Base COP', 'Acumulado Realista USD', 'Acumulado Realista COP'];
    const rows = itineraryData.days.map(day => {
        const baseTotal = day.costs.lodgingBase + day.costs.foodBase + day.costs.transportBase + day.costs.activitiesBase;
        const realTotal = day.costs.lodgingReal + day.costs.foodReal + day.costs.transportBase + day.costs.activitiesBase;
        const baseAccumulated = calculateAccumulatedTotal(day.day, false);
        const realAccumulated = calculateAccumulatedTotal(day.day, true);
        
        return [
            day.day,
            getFormattedDate(day.day) || day.date,
            day.city,
            baseTotal,
            convertUSDToCOP(baseTotal),
            realTotal,
            convertUSDToCOP(realTotal),
            baseAccumulated,
            convertUSDToCOP(baseAccumulated),
            realAccumulated,
            convertUSDToCOP(realAccumulated)
        ];
    });

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'presupuesto_europa_25_dias.csv';
    link.click();
    URL.revokeObjectURL(url);
}

function printPDF() {
    window.print();
}

// Función auxiliar para calcular total acumulado con modo específico
function calculateAccumulatedTotal(dayNum, useRealistic = null) {
    if (!itineraryData) return 0;
    
    const realistic = useRealistic !== null ? useRealistic : useRealisticCosts;
    let total = 0;
    for (let i = 1; i <= dayNum; i++) {
        const day = itineraryData.days.find(d => d.day === i);
        if (day) {
            const costs = realistic ? {
                lodging: day.costs.lodgingReal,
                food: day.costs.foodReal,
                transport: day.costs.transportBase,
                activities: day.costs.activitiesBase
            } : {
                lodging: day.costs.lodgingBase,
                food: day.costs.foodBase,
                transport: day.costs.transportBase,
                activities: day.costs.activitiesBase
            };
            total += costs.lodging + costs.food + costs.transport + costs.activities;
        }
    }
    return total;
}
// Funciones auxiliares para los nuevos campos enriquecidos

function getCountryFlag(country) {
    const flags = {
        'España': '🇪🇸',
        'Francia': '🇫🇷', 
        'Suiza': '🇨🇭',
        'Italia': '🇮🇹',
        'Países Bajos': '🇳🇱',
        'Holanda': '🇳🇱'
    };
    return flags[country] || '🏳️';
}

function getCurrencySymbol(currency) {
    const symbols = {
        'EUR': '€',
        'CHF': 'CHF',
        'USD': '$'
    };
    return symbols[currency] || currency;
}

function getActivityImageFromQuery(imageQuery, city) {
    if (!imageQuery) return getActivityImage('', city);
    
    // Usar Unsplash con el query específico
    const query = encodeURIComponent(imageQuery.replace(/\s+/g, '+'));
    return `<img src="https://source.unsplash.com/400x200/?${query}" 
                 alt="${imageQuery}" 
                 onerror="this.src='https://source.unsplash.com/400x200/?${encodeURIComponent(city)}'; this.onerror=null;"
                 loading="lazy">`;
}

function getCityImageLarge(city, heroQuery) {
    const query = heroQuery || `${city} landmark`;
    const encodedQuery = encodeURIComponent(query.replace(/\s+/g, '+'));
    return `<img src="https://source.unsplash.com/800x300/?${encodedQuery}" 
                 alt="${query}" 
                 class="hero-image"
                 onerror="this.src='https://source.unsplash.com/800x300/?${encodeURIComponent(city)}'; this.onerror=null;"
                 loading="lazy">`;
}

function getHeroImageUrl(city, heroQuery, day = null) {
    // Primero verificar si el día tiene una heroImageUrl específica
    if (day && day.heroImageUrl) {
        console.log(`🖼️ Usando heroImageUrl específica para ${city}:`, day.heroImageUrl);
        return day.heroImageUrl;
    }
    console.log(`🔍 No heroImageUrl encontrada para ${city}, usando mapa por defecto`);
    
    const cityImages = {
        'Barcelona': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=300&fit=crop',
        'París': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&h=300&fit=crop',
        'Suiza': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop',
        'Milán': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&h=300&fit=crop',
        'Roma': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=300&fit=crop',
        'Venecia': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&h=300&fit=crop',
        'Ámsterdam': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=300&fit=crop',
        'Madrid': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=300&fit=crop',
        'Costa Brava (Tossa de Mar)': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=300&fit=crop',
        'Valencia (playa)': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=300&fit=crop',
        'Disneyland París': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=300&fit=crop'
    };
    
    return cityImages[city] || `https://source.unsplash.com/800x300/?${encodeURIComponent(heroQuery || city + ' landmark')}`;
}

function getActivityImageUrl(activityName, city, activity = null) {
    // Debug específico para día 3
    if (city === "Costa Brava (Tossa de Mar)") {
        console.log(`🏖️ DÍA 3 DEBUG - Actividad: ${activityName}`, {
            activity: activity,
            hasImageUrl: !!(activity && activity.imageUrl),
            imageUrl: activity ? activity.imageUrl : 'No activity object',
            activityType: typeof activity,
            activityKeys: activity ? Object.keys(activity) : 'No activity'
        });
    }
    
    // Primero verificar si la actividad tiene una imageUrl específica
    // Verificar de múltiples formas para asegurar que detectamos el imageUrl
    if (activity) {
        // Verificar si imageUrl existe directamente
        if (activity.imageUrl && activity.imageUrl.trim() !== '') {
            console.log(`🖼️ Usando imageUrl específica para ${activityName}:`, activity.imageUrl);
            return activity.imageUrl;
        }
        // También verificar si está en el objeto pero como undefined/null
        if ('imageUrl' in activity && activity.imageUrl) {
            console.log(`🖼️ Usando imageUrl (verificación alternativa) para ${activityName}:`, activity.imageUrl);
            return activity.imageUrl;
        }
    }
    console.log(`🔍 No imageUrl encontrada para ${activityName}, usando mapa por defecto`);
    
    const imageMap = {
        'Sagrada Familia': 'https://images.adsttc.com/media/images/5cff/5ec5/284d/d16d/6a00/1111/slideshow/1.jpg?1560239805',
        'Arco de Triunfo': 'https://www.barcelo.com/guia-turismo/wp-content/uploads/ok-arc-de-triomf.jpg',
        'Las Ramblas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/15-10-27-Vista_des_de_l%27est%C3%A0tua_de_Colom_a_Barcelona-WMA_2791.jpg/960px-15-10-27-Vista_des_de_l%27est%C3%A0tua_de_Colom_a_Barcelona-WMA_2791.jpg',
        'Mercado de la Boquería': 'https://www.shutterstock.com/shutterstock/photos/2292736191/display_1500/stock-photo-barcelona-september-tourists-in-famous-la-boqueria-market-in-the-las-ramblas-area-of-2292736191.jpg',
        'Casa Batlló': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Casa_Batll%C3%B3%2C_Antoni_Gaud%C3%AD.jpg/960px-Casa_Batll%C3%B3%2C_Antoni_Gaud%C3%AD.jpg',
        'Passeig de Gràcia': 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Via_Barcelona_Casa_Mil%C3%A0.JPG',
        'Hotel W Barcelona (Playa)': 'https://estatics-nasia.dtibcn.cat/nasia-pro/media/2015%2C09%2CHotel-W-1.jpg',
        'Recinte Modernista de Sant Pau': 'https://s3.eu-west-1.amazonaws.com/pro.static.portalstdo.tmb.cat/styles/galeria_slider/s3/2025-05/REF_HOSPITAL_SANTPAU_CT6A8983.jpg.webp?itok=dSE4upJp',
        'Jardines de La Tamarita': 'https://guiavi.com/wp-content/uploads/2023/10/jardines-de-La-tamarita.jpg.webp',
        'Louvre': 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=160&h=160&fit=crop',
        'Torre Eiffel': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=160&h=160&fit=crop',
        'Coliseo': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=160&h=160&fit=crop',
        'Disneyland': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=160&h=160&fit=crop',
        'Rijksmuseum': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Museo del Prado': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'San Marcos': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=160&h=160&fit=crop',
        'Duomo': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=160&h=160&fit=crop',
        'Mt. Pilatus': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=160&h=160&fit=crop',
        'GoldenPass': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=160&h=160&fit=crop',
        'Montmartre': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=160&h=160&fit=crop',
        'Le Marais': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=160&h=160&fit=crop',
        'Trastevere': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=160&h=160&fit=crop',
        'Jordaan': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Gran Vía': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Parque del Retiro': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Barrio Gótico': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=160&h=160&fit=crop',
        'Fuente de Trevi': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=160&h=160&fit=crop',
        'Panteón': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=160&h=160&fit=crop',
        'Plaza Navona': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=160&h=160&fit=crop',
        'Foro Romano': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=160&h=160&fit=crop'
    };
    
    return imageMap[activityName] || getCityImageUrl(city);
}

function getCityImageUrl(city) {
    const cityImages = {
        'Barcelona': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=160&h=160&fit=crop',
        'París': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=160&h=160&fit=crop',
        'Suiza': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=160&h=160&fit=crop',
        'Milán': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=160&h=160&fit=crop',
        'Roma': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=160&h=160&fit=crop',
        'Venecia': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=160&h=160&fit=crop',
        'Ámsterdam': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop',
        'Madrid': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=160&h=160&fit=crop'
    };
    
    return cityImages[city] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=160&h=160&fit=crop';
}

// ==================== FUNCIONES DE CONVERSIÓN DE MONEDA ====================

// Convertir USD a COP
function convertUSDToCOP(usdAmount) {
    return usdAmount * exchangeRateUSDToCOP;
}

// Formatear cantidad en USD
function formatUSD(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Formatear cantidad en COP
function formatCOP(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Formatear costo con conversión USD/COP
function formatCostWithConversion(usdAmount) {
    const usdFormatted = formatUSD(usdAmount);
    if (showCOPConversion) {
        const copAmount = convertUSDToCOP(usdAmount);
        const copFormatted = formatCOP(copAmount);
        return `${usdFormatted} <span class="cop-conversion">(${copFormatted})</span>`;
    }
    return usdFormatted;
}

// Cargar configuración de moneda desde localStorage
function loadCurrencySettings() {
    const savedRate = localStorage.getItem('exchangeRateUSDToCOP');
    const savedShowConversion = localStorage.getItem('showCOPConversion');
    
    if (savedRate) {
        exchangeRateUSDToCOP = parseFloat(savedRate);
    }
    if (savedShowConversion !== null) {
        showCOPConversion = savedShowConversion === 'true';
    }
}

// Guardar configuración de moneda en localStorage
function saveCurrencySettings() {
    localStorage.setItem('exchangeRateUSDToCOP', exchangeRateUSDToCOP.toString());
    localStorage.setItem('showCOPConversion', showCOPConversion.toString());
}

// ==================== FUNCIONES DEL CALENDARIO ====================

// Cargar configuración de fechas desde localStorage
function loadDateSettings() {
    try {
        const savedStartDate = localStorage.getItem('tripStartDate');
        if (savedStartDate) {
            const parsedDate = new Date(savedStartDate);
            if (isNaN(parsedDate.getTime())) {
                console.error('Fecha guardada inválida:', savedStartDate);
                tripStartDate = new Date('2026-09-05');
            } else {
                tripStartDate = parsedDate;
            }
        } else {
            // Fecha por defecto: 5 de septiembre de 2026
            tripStartDate = new Date('2026-09-05');
        }
        
        // Validar fecha final
        if (!(tripStartDate instanceof Date) || isNaN(tripStartDate.getTime())) {
            console.error('Error en tripStartDate, usando fecha por defecto');
            tripStartDate = new Date('2026-09-05');
        }
        
        calculateAllDates();
    } catch (error) {
        console.error('Error cargando configuración de fechas:', error);
        tripStartDate = new Date('2026-09-05');
        calculateAllDates();
    }
}

// Guardar configuración de fechas en localStorage
function saveDateSettings() {
    if (tripStartDate) {
        localStorage.setItem('tripStartDate', tripStartDate.toISOString());
    }
}

// Calcular todas las fechas del viaje basado en la fecha inicial
function calculateAllDates() {
    if (!tripStartDate || !itineraryData) return;
    
    calculatedDates = {};
    
    // Validar que tripStartDate sea una fecha válida
    if (!(tripStartDate instanceof Date) || isNaN(tripStartDate.getTime())) {
        console.error('tripStartDate no es una fecha válida:', tripStartDate);
        tripStartDate = new Date('2026-09-05'); // Fecha por defecto
    }
    
    itineraryData.days.forEach(day => {
        try {
            const dayDate = new Date(tripStartDate);
            dayDate.setDate(tripStartDate.getDate() + (day.day - 1));
            calculatedDates[day.day] = dayDate;
        } catch (error) {
            console.error('Error calculando fecha para día', day.day, ':', error);
        }
    });
}

// Obtener fecha formateada para un día específico
function getFormattedDate(dayNumber) {
    if (!calculatedDates[dayNumber]) return '';
    
    const date = calculatedDates[dayNumber];
    
    // Validar que la fecha sea válida
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error('Fecha inválida para día', dayNumber, ':', date);
        return '';
    }
    
    try {
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        
        return date.toLocaleDateString('es-ES', options);
    } catch (error) {
        console.error('Error formateando fecha para día', dayNumber, ':', error);
        return '';
    }
}

// Obtener fecha corta para un día específico
function getShortDate(dayNumber) {
    if (!calculatedDates[dayNumber]) return '';
    
    const date = calculatedDates[dayNumber];
    
    // Validar que la fecha sea válida
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error('Fecha inválida para día', dayNumber, ':', date);
        return '';
    }
    
    try {
        return date.toLocaleDateString('es-ES', { 
            month: 'short', 
            day: 'numeric' 
        });
    } catch (error) {
        console.error('Error formateando fecha corta para día', dayNumber, ':', error);
        return '';
    }
}

// Obtener nombre del mes para un día específico
function getMonthName(dayNumber) {
    if (!calculatedDates[dayNumber]) return '';
    
    const date = calculatedDates[dayNumber];
    
    // Validar que la fecha sea válida
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error('Fecha inválida para día', dayNumber, ':', date);
        return '';
    }
    
    try {
        return date.toLocaleDateString('es-ES', { 
            month: 'long' 
        });
    } catch (error) {
        console.error('Error obteniendo nombre del mes para día', dayNumber, ':', error);
        return '';
    }
}

// Renderizar navegación entre días
function renderDayNavigation(currentDayNumber) {
    if (!itineraryData) return '';
    
    const totalDays = itineraryData.days.length;
    const hasPrevious = currentDayNumber > 1;
    const hasNext = currentDayNumber < totalDays;
    
    const previousDay = hasPrevious ? currentDayNumber - 1 : null;
    const nextDay = hasNext ? currentDayNumber + 1 : null;
    
    // Obtener información de los días anterior y siguiente
    const prevDayInfo = previousDay ? itineraryData.days.find(d => d.day === previousDay) : null;
    const nextDayInfo = nextDay ? itineraryData.days.find(d => d.day === nextDay) : null;
    
    return `
        <div class="day-navigation">
            <button class="nav-button" 
                    ${!hasPrevious ? 'disabled' : ''} 
                    onclick="selectDay(${previousDay})"
                    title="${prevDayInfo ? `Día ${prevDayInfo.day} - ${prevDayInfo.city}` : ''}">
                <span class="nav-arrow">←</span>
                ${hasPrevious ? `Día ${previousDay}` : 'Primer día'}
            </button>
            
            <div class="day-indicator">
                Día ${currentDayNumber} de ${totalDays}
                ${getFormattedDate(currentDayNumber) ? `<br><small>${getFormattedDate(currentDayNumber)}</small>` : ''}
            </div>
            
            <button class="nav-button" 
                    ${!hasNext ? 'disabled' : ''} 
                    onclick="selectDay(${nextDay})"
                    title="${nextDayInfo ? `Día ${nextDayInfo.day} - ${nextDayInfo.city}` : ''}">
                ${hasNext ? `Día ${nextDay}` : 'Último día'}
                <span class="nav-arrow">→</span>
            </button>
        </div>
    `;
}

// Renderizar componente de configuración de moneda
function renderCurrencySettings() {
    return `
        <div class="currency-settings">
            <div class="currency-title">
                💰 Configuración de Moneda
            </div>
            <div class="currency-controls">
                <label>
                    Tasa USD → COP:
                    <input type="number" 
                           id="exchangeRateInput" 
                           class="exchange-rate-input"
                           value="${exchangeRateUSDToCOP}" 
                           min="1000" 
                           max="10000" 
                           step="50">
                </label>
                <label class="currency-toggle">
                    <input type="checkbox" 
                           id="showCOPToggle" 
                           ${showCOPConversion ? 'checked' : ''}>
                    Mostrar en COP
                </label>
            </div>
        </div>
    `;
}

// Renderizar el componente de calendario
function renderCalendarComponent() {
    try {
        let startDate = tripStartDate;
        
        // Validar fecha de inicio
        if (!startDate || !(startDate instanceof Date) || isNaN(startDate.getTime())) {
            console.error('tripStartDate inválida, usando fecha por defecto');
            startDate = new Date('2026-09-05');
            tripStartDate = startDate;
        }
        
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 14); // 15 días de viaje
        
        const today = new Date();
        const currentMonth = startDate.getMonth();
        const currentYear = startDate.getFullYear();
        
        console.log('Renderizando calendario para:', startDate, 'Mes:', currentMonth, 'Año:', currentYear);
    
    return `
        <div class="calendar-section">
            <div class="calendar-header">
                <div class="calendar-title">
                    📅 Calendario del Viaje 2026
                </div>
                <div class="date-selector-container">
                    <label class="date-selector-label">Fecha de inicio:</label>
                    <input type="date" 
                           id="startDateSelector" 
                           class="date-selector"
                           value="${startDate.toISOString().split('T')[0]}"
                           min="2026-01-01" 
                           max="2026-12-31">
                </div>
            </div>
            
            <div class="calendar-info">
                <div class="trip-duration">
                    ⏱️ Duración: 15 días
                </div>
                <div class="date-range">
                    🗓️ ${startDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} - 
                    ${endDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </div>
            
            ${renderMiniCalendar(currentYear, currentMonth)}
        </div>
    `;
    
    } catch (error) {
        console.error('Error en renderCalendarComponent:', error);
        return `
            <div class="calendar-section">
                <div class="calendar-header">
                    <div class="calendar-title">📅 Error en Calendario</div>
                </div>
                <div class="calendar-info">
                    <div>Error cargando el calendario. Revisa la consola para más detalles.</div>
                </div>
            </div>
        `;
    }
}

// Renderizar mini calendario
function renderMiniCalendar(year, month) {
    try {
        // Validar parámetros
        if (!year || !month === undefined || isNaN(year) || isNaN(month)) {
            console.error('Parámetros inválidos en renderMiniCalendar:', year, month);
            return '<div class="calendar-mini">Error: Parámetros inválidos</div>';
        }
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startOfWeek = new Date(firstDay);
        startOfWeek.setDate(firstDay.getDate() - firstDay.getDay());
    
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    let calendarHTML = '<div class="calendar-mini">';
    
    // Headers de días
    days.forEach(day => {
        calendarHTML += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Días del calendario
    const current = new Date(startOfWeek);
    const today = new Date();
    let startDate = tripStartDate;
    
    // Validar tripStartDate
    if (!startDate || !(startDate instanceof Date) || isNaN(startDate.getTime())) {
        startDate = new Date('2026-09-05');
    }
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 14);
    
    for (let i = 0; i < 42; i++) { // 6 semanas máximo
        try {
            const isCurrentMonth = current.getMonth() === month;
            const isToday = current.toDateString() === today.toDateString();
            const isTripDay = current >= startDate && current <= endDate;
            const isStartDay = current.toDateString() === startDate.toDateString();
            const isEndDay = current.toDateString() === endDate.toDateString();
            
            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (isTripDay) classes += ' trip-day';
            if (isStartDay) classes += ' start-day';
            if (isEndDay) classes += ' end-day';
            
            const dayNumber = isCurrentMonth ? current.getDate() : '';
            const dateString = current.toISOString().split('T')[0];
            calendarHTML += `<div class="${classes}" data-date="${dateString}">${dayNumber}</div>`;
            
            current.setDate(current.getDate() + 1);
            
            // Si hemos pasado el último día del mes y completado la semana, parar
            if (current > lastDay && current.getDay() === 0) break;
        } catch (error) {
            console.error('Error en bucle del calendario:', error);
            break;
        }
    }
    
    calendarHTML += '</div>';
    return calendarHTML;
    
    } catch (error) {
        console.error('Error en renderMiniCalendar:', error);
        return '<div class="calendar-mini">Error renderizando calendario</div>';
    }
}

// Configurar event listeners para el calendario
function setupCalendarEventListeners() {
    const startDateSelector = document.getElementById('startDateSelector');
    if (startDateSelector) {
        startDateSelector.addEventListener('change', function(e) {
            tripStartDate = new Date(e.target.value);
            calculateAllDates();
            saveDateSettings();
            
            // Re-renderizar la vista actual
            if (showAllDays) {
                renderAllDays();
            } else if (showSummary) {
                renderSummaryPage();
            } else {
                renderCurrentDay();
            }
        });
    }
}

// Configurar event listeners para la configuración de moneda
function setupCurrencyEventListeners() {
    const exchangeRateInput = document.getElementById('exchangeRateInput');
    const showCOPToggle = document.getElementById('showCOPToggle');
    
    if (exchangeRateInput) {
        exchangeRateInput.addEventListener('change', function(e) {
            exchangeRateUSDToCOP = parseFloat(e.target.value) || 4200;
            saveCurrencySettings();
            
            // Re-renderizar la vista actual
            if (showAllDays) {
                renderAllDays();
            } else if (showSummary) {
                renderSummaryPage();
            } else {
                renderCurrentDay();
            }
        });
    }
    
    if (showCOPToggle) {
        showCOPToggle.addEventListener('change', function(e) {
            showCOPConversion = e.target.checked;
            saveCurrencySettings();
            
            // Re-renderizar la vista actual
            if (showAllDays) {
                renderAllDays();
            } else if (showSummary) {
                renderSummaryPage();
            } else {
                renderCurrentDay();
            }
        });
    }
}

function calculateDayTotal(day) {
    if (!day || !day.costs) return 0;
    
    const costs = useRealisticCosts ? {
        lodging: day.costs.lodgingReal || day.costs.lodgingBase,
        food: day.costs.foodReal || day.costs.foodBase,
        transport: day.costs.transportReal || day.costs.transportBase,
        activities: day.costs.activitiesReal || day.costs.activitiesBase
    } : {
        lodging: day.costs.lodgingBase,
        food: day.costs.foodBase,
        transport: day.costs.transportBase,
        activities: day.costs.activitiesBase
    };
    
    return costs.lodging + costs.food + costs.transport + costs.activities;
}

// ============================================
// FUNCIONALIDADES MÓVILES
// ============================================

// Menú hamburguesa móvil
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const controls = document.querySelector('.controls');
    
    if (!mobileMenuToggle || !controls) return;
    
    let isMenuOpen = false;
    
    // Función para verificar si estamos en móvil
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Función para actualizar visibilidad según tamaño de pantalla
    function updateVisibility() {
        if (isMobile()) {
            mobileMenuToggle.style.display = 'flex';
            if (!isMenuOpen) {
                controls.style.display = 'none';
            }
        } else {
            mobileMenuToggle.style.display = 'none';
            controls.style.display = 'flex';
            isMenuOpen = false;
            mobileMenuToggle.textContent = '☰';
        }
    }
    
    // Inicializar visibilidad
    updateVisibility();
    
    // Escuchar cambios de tamaño
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateVisibility, 100);
    });
    
    // Toggle del menú
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isMobile()) return;
        
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            controls.style.display = 'flex';
            mobileMenuToggle.textContent = '✕';
            mobileMenuToggle.classList.add('active');
            // Scroll suave a los controles
            setTimeout(() => {
                controls.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
        } else {
            controls.style.display = 'none';
            mobileMenuToggle.textContent = '☰';
            mobileMenuToggle.classList.remove('active');
        }
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (isMenuOpen && isMobile()) {
            if (!controls.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                isMenuOpen = false;
                controls.style.display = 'none';
                mobileMenuToggle.textContent = '☰';
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
}

// Botón "Volver arriba"
function setupScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Mostrar/ocultar botón según scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll suave al hacer clic
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Inicializar funcionalidades móviles
document.addEventListener('DOMContentLoaded', function() {
    setupMobileMenu();
    setupScrollToTop();
});
