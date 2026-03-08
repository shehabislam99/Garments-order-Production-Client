const Modal = ({ open, title, onClose, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg app-surface app-radius-lg p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-sm font-medium app-muted">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
