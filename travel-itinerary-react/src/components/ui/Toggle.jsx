// Componente Toggle (Switch) reutilizable

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <label
      className={`flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      {...props}
    >
      {label && <span className="text-sm font-medium text-light-text">{label}</span>}

      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className="
            w-11 h-6 bg-light-border rounded-full peer
            peer-checked:bg-blue-500
            transition-colors duration-300
          "
        >
          <div
            className={`
              absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm
              transition-transform duration-300
              ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}
            `}
          />
        </div>
      </div>
    </label>
  );
}

export default Toggle;
