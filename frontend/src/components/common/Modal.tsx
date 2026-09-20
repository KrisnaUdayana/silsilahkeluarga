import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div className="card w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl bg-white" role="dialog" aria-modal="true" aria-label={title}>
        <div className="card-header flex justify-between items-center bg-white">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm p-1" aria-label="Tutup modal">
            <X size={20} />
          </button>
        </div>
        
        <div className="card-body overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
