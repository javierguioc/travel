// Componente TransportCard - Tarjeta de transporte al siguiente día
import { useState } from 'react';
import { getTransportIcon, formatTransportDuration } from '../../utils/transport';

export function TransportCard({ transport, transportOptions }) {
  const [showOptions, setShowOptions] = useState(false);

  if (!transport || !transport.mode) return null;

  const icon = getTransportIcon(transport.mode);
  const duration = formatTransportDuration(transport.durationMin);

  // Colores según tipo de transporte
  const transportColors = {
    flight: { gradient: 'from-sky-500 to-blue-600', bg: 'from-sky-50 to-blue-50', border: 'border-sky-400', icon: '✈️' },
    train: { gradient: 'from-emerald-500 to-teal-600', bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-400', icon: '🚄' },
    tren: { gradient: 'from-emerald-500 to-teal-600', bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-400', icon: '🚄' },
    bus: { gradient: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-50', border: 'border-amber-400', icon: '🚌' },
    ferry: { gradient: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 to-blue-50', border: 'border-cyan-400', icon: '⛴️' },
    car: { gradient: 'from-violet-500 to-purple-600', bg: 'from-violet-50 to-purple-50', border: 'border-violet-400', icon: '🚗' },
    vuelo: { gradient: 'from-sky-500 to-blue-600', bg: 'from-sky-50 to-blue-50', border: 'border-sky-400', icon: '✈️' },
  };

  const colors = transportColors[transport.mode] || transportColors.train;

  return (
    <div className={`bg-gradient-to-br ${colors.bg} border-l-4 ${colors.border} rounded-xl p-5 shadow-soft hover:shadow-card transition-all duration-300`}>
      {/* Header con icono grande */}
      <div className="flex items-center gap-4 mb-5">
        <div className={`bg-gradient-to-br ${colors.gradient} w-14 h-14 rounded-2xl flex items-center justify-center shadow-md`}>
          <span className="text-3xl filter drop-shadow-sm">{colors.icon || icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-light-text">Traslado al Siguiente Día</h3>
          <p className="text-sm text-light-textMuted">{duration}</p>
        </div>
        {transportOptions && (
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="px-3 py-1.5 bg-white rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
          >
            {showOptions ? '▲ Ocultar opciones' : '▼ Ver opciones'}
          </button>
        )}
      </div>

      {/* Route visualization */}
      <div className="relative mb-5">
        <div className="flex items-center justify-between">
          <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <p className="text-light-textMuted text-xs font-medium uppercase tracking-wide mb-1">Origen</p>
            <p className="text-light-text font-bold text-lg">{transport.from}</p>
            <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              🕐 {transport.depart}
            </span>
          </div>

          {/* Arrow connector */}
          <div className="flex-shrink-0 mx-4 flex flex-col items-center">
            <div className={`w-8 h-0.5 bg-gradient-to-r ${colors.gradient}`}></div>
            <span className="text-xl my-1">{colors.icon || '→'}</span>
            <div className={`w-8 h-0.5 bg-gradient-to-r ${colors.gradient}`}></div>
          </div>

          <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <p className="text-light-textMuted text-xs font-medium uppercase tracking-wide mb-1">Destino</p>
            <p className="text-light-text font-bold text-lg">{transport.to}</p>
            <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              🕐 {transport.arrive}
            </span>
          </div>
        </div>
      </div>

      {/* Footer con código y enlace */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-light-border/50">
        {transport.code && (
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold bg-gradient-to-r ${colors.gradient} text-white shadow-sm`}>
            🎫 {transport.code}
          </span>
        )}

        {transport.bookingLink && (
          <a
            href={transport.bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-light-text font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
          >
            🔗 Ver reserva →
          </a>
        )}

        {transport.ticketUrls && transport.ticketUrls.map((t, i) => (
          <a
            key={i}
            href={t.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-green-300 text-green-700 font-semibold shadow-sm hover:shadow-md hover:bg-green-50 transition-all duration-200 hover:scale-105"
          >
            📄 {t.label} →
          </a>
        ))}
      </div>

      {/* Transport Options Section */}
      {showOptions && transportOptions && transportOptions.options && (
        <div className="mt-5 pt-5 border-t border-light-border/50">
          <h4 className="text-sm font-bold text-light-text mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">COMPARATIVA</span>
            Opciones de transporte
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {transportOptions.options.map((option, index) => {
              const optColors = transportColors[option.type] || transportColors.train;
              return (
                <div
                  key={index}
                  className={`relative bg-white rounded-xl p-4 shadow-sm border-2 ${
                    option.recommended ? 'border-green-400' : 'border-light-border'
                  }`}
                >
                  {option.recommended && (
                    <span className="absolute -top-2 left-4 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                      ⭐ RECOMENDADO
                    </span>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${optColors.gradient} flex items-center justify-center`}>
                      <span className="text-xl">{optColors.icon}</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-light-text">{option.name}</h5>
                      <p className="text-xs text-light-textMuted">{option.type === 'train' ? 'Tren' : 'Vuelo'}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-light-textMuted">⏱️ Duración:</span>
                      <span className="font-semibold">{option.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light-textMuted">💰 Costo:</span>
                      <span className="font-semibold text-green-600">{option.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light-textMuted">📅 Frecuencia:</span>
                      <span className="font-semibold">{option.frequency}</span>
                    </div>
                  </div>

                  {option.pros && option.pros.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-light-border">
                      <p className="text-xs font-semibold text-green-600 mb-1">✅ Ventajas:</p>
                      <ul className="text-xs text-light-textSecondary space-y-0.5">
                        {option.pros.slice(0, 3).map((pro, i) => (
                          <li key={i}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {option.cons && option.cons.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-red-500 mb-1">❌ Desventajas:</p>
                      <ul className="text-xs text-light-textSecondary space-y-0.5">
                        {option.cons.slice(0, 2).map((con, i) => (
                          <li key={i}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {option.bookingLink && (
                    <a
                      href={option.bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-3 block w-full text-center py-2 rounded-lg text-sm font-semibold transition-colors ${
                        option.recommended
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-light-bgTertiary text-light-text hover:bg-light-border'
                      }`}
                    >
                      🔗 Reservar {option.type === 'train' ? 'tren' : 'vuelo'}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default TransportCard;
