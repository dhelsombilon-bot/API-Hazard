export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center gap-1.5 font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none'
  const variants = {
    primary:   'text-white hover:opacity-90 active:scale-[0.97] focus:ring-[#1976A5]',
    secondary: 'text-white hover:opacity-90 active:scale-[0.97] focus:ring-[#1976A5]',
    danger:    'bg-red-600 text-white hover:bg-red-700 active:scale-[0.97] focus:ring-red-500',
    ghost:     'text-gray-600 hover:bg-gray-100 active:scale-[0.97] focus:ring-gray-400',
  }
  const variantStyles = {
    primary:   { background: 'linear-gradient(135deg,#123B5D,#1976A5)', boxShadow: '0 2px 8px rgba(18,59,93,0.35)' },
    secondary: { background: 'linear-gradient(135deg,#1976A5,#145C82)', boxShadow: '0 2px 8px rgba(25,118,165,0.30)' },
    danger:    {},
    ghost:     {},
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-sm',
  }
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </button>
  )
}
