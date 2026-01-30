// Componente Badge reutilizable

export function Badge({
  children,
  variant = 'primary',
  icon,
  className = '',
  ...props
}) {
  const baseClasses = 'badge';

  const variantClasses = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-white',
    danger: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <span className={classes} {...props}>
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </span>
  );
}

export default Badge;
