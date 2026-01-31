// Componente TransportCard - Tarjeta de transporte al siguiente día
import { Badge } from '../ui';
import { getTransportIcon, formatTransportDuration } from '../../utils/transport';

export function TransportCard({ transport }) {
  if (!transport || !transport.mode) return null;

  const icon = getTransportIcon(transport.mode);
  const duration = formatTransportDuration(transport.durationMin);

  return (
    <div className="bg-gradient-to-r from-green-900/20 to-green-800/20 border-2 border-green-600 rounded-xl p-4 sm:p-6">
      <h3 className="text-responsive-lg text-dark-text mb-4 flex items-center gap-2">
        <span className="text-2xl sm:text-3xl">{icon}</span>
        <span className="flex-1">Traslado al Siguiente Día</span>
      </h3>

      <div className="grid-responsive-2 gap-3 sm:gap-4">
        <div>
          <p className="text-dark-textMuted text-xs sm:text-sm mb-1">Desde</p>
          <p className="text-dark-text font-semibold text-sm sm:text-base">{transport.from}</p>
        </div>
        <div>
          <p className="text-dark-textMuted text-xs sm:text-sm mb-1">Hasta</p>
          <p className="text-dark-text font-semibold text-sm sm:text-base">{transport.to}</p>
        </div>
        <div>
          <p className="text-dark-textMuted text-xs sm:text-sm mb-1">Salida</p>
          <Badge variant="info" icon="🕐">{transport.depart}</Badge>
        </div>
        <div>
          <p className="text-dark-textMuted text-xs sm:text-sm mb-1">Llegada</p>
          <Badge variant="info" icon="🕐">{transport.arrive}</Badge>
        </div>
      </div>

      {transport.code && (
        <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{transport.code}</Badge>
          <span className="text-dark-textMuted text-sm">• {duration}</span>
        </div>
      )}

      {transport.bookingLink && (
        <div className="mt-3 sm:mt-4">
          <a
            href={transport.bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 underline text-sm sm:text-base"
          >
            🔗 Ver reserva
          </a>
        </div>
      )}
    </div>
  );
}

export default TransportCard;
