// Componente Input reutilizable

export function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-dark-text">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        {...props}
      />

      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
  label,
  error,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-dark-text">
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        className={`select ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
}

export default Input;
