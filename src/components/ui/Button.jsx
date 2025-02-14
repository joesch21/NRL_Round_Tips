export function Button({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
    >
      {children}
    </button>
  );
}
