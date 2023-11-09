import React, { ReactNode, MouseEvent } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return isOpen ? (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="z-0 w-1/3 md:w-[500px] h-1/2 relative p-2 md:rounded-3xl bg-slate-500 bg-opacity-30  md:shadow-black md:shadow-2xl overflow-y-scroll no-scrollbar ">
        <div className="w-full overflow-auto h-full md:bg-opacity-70 md:bg-slate-950 text-white m-auto rounded-2xl p-10 flex flex-col justify-center items-center gap-10">
          {children}
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
