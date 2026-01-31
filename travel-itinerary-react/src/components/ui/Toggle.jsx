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
      {label && <span className="text-sm font-medium text-dark-text">{label}</span>}

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
            w-11 h-6 bg-dark-bgTertiary border border-dark-border rounded-full peer
            peer-checked:bg-purple-600 peer-checked:border-purple-600
            transition-colors duration-300
          "
        >
          <div
            className="
              absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
              transition-transform duration-300
              peer-checked:translate-x-5
            "
          />
        </div>
      </div>
    </label>
  );
}

export default Toggle;
