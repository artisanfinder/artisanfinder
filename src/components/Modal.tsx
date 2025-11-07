import React, { FC } from 'react';

export const Modal: FC<{ children: React.ReactNode; onClose: () => void; }> = ({ children, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Modal;