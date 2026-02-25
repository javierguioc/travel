// Componente Card reutilizable

export function Card({
  children,
  className = '',
  compact = false,
  onClick,
  ...props
}) {
  const classes = `
    ${compact ? 'card-compact' : 'card'}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
}

export default Card;
