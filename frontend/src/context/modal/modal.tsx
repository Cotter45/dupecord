import React, {
  useContext,
  useRef,
  useState,
  useEffect,
  MouseEventHandler,
  ReactNode,
} from "react";
import ReactDOM from "react-dom";

const ModalContext = React.createContext(null);

interface ModalType {
  children: ReactNode;
  onClose?: MouseEventHandler;
}

export function ModalProvider({ children }: ModalType) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<any>(null);

  useEffect(() => {
    if (modalRef.current) {
      setValue(modalRef.current);
    }
  }, []);

  return (
    <>
      <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

export function Modal({ onClose, children }: ModalType) {
  const modalNode = useContext(ModalContext);
  if (!modalNode) return null;

  return ReactDOM.createPortal(
    <div className="fade_in fixed min-h-screen min-w-full top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <div
        className="fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-black opacity-80 cursor-pointer"
        onClick={onClose}
      />
      <div
        style={{ height: "80vh", width: "80vw" }}
        className="absolute flex flex-col items-center justify-center"
      >
        {onClose && (
          <button
            className="w-10 h-10 absolute -right-10 -top-10  text-white hover:border p-2 rounded"
            onClick={onClose}
          >
            X
          </button>
        )}
        {children}
      </div>
    </div>,
    modalNode
  );
}
