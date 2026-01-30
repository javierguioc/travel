// Componente Spinner para loading states

export function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-4 border-dark-border border-t-purple-600 w-full h-full" />
    </div>
  );
}

export default Spinner;
