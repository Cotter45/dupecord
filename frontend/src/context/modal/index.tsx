import { useState, ReactElement, ReactNode } from "react";

import { Modal } from "./modal";

interface ModalButtonType {
  children: ReactNode;
  text: string | ReactElement;
}

function ModalButton({ children, text }: ModalButtonType) {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <button id="modal_open" onClick={() => setShowModal(true)}>
        {text}
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>{children}</Modal>
      )}
    </>
  );
}

export default ModalButton;
