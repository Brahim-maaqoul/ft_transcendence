import axios from "axios";
import React, { useState } from "react";
import Settings from "./settings";
import Modal from "./modal";

const API = axios.create({
  baseURL: "http://localhost:8000/v1/api/",
  withCredentials: true,
});

function TfaToggle() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button onClick={openModal}>
        <Settings />
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

export default TfaToggle;