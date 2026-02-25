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
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'bg-red-100 text-red-700',
    info: 'badge-info',
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
