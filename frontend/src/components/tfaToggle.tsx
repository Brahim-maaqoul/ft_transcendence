import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import Settings from "./settings";
import Modal from "./modal";

const API = axios.create({
  baseURL: "http://localhost:8000/v1/api/",
  withCredentials: true,
});

function TfaToggle() {
  const [isTfaEnabled, setIsTfaEnabled] = useState(false);

  useEffect(() => {
    fetchTfaStatus();
  }, []);

  const fetchTfaStatus = async () => {
    try {
      const response: AxiosResponse = await API.get("/user/tfaStatus");
      setIsTfaEnabled(response.data);
    } catch (error) {
      console.error("Error fetching TFA status:", error);
    }
  };

  const handleToggleTfa = async () => {
    try {
      if (isTfaEnabled) {
        await API.post("/user/disableTFA");
      } else {
        await API.post("/user/enableTFA");
      }
      setIsTfaEnabled(!isTfaEnabled);
    } catch (error) {
      console.error("Error toggling TFA:", error);
    }
  };

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
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h1 className="text-center">enable/disable 2FA</h1>
        <div className="toggle flex flex-col items-center justify-center">
          <label
            className={`relative inline-flex items-center cursor-pointer ${
              isTfaEnabled
                ? "text-blue-600"
                : "text-gray-900 dark:text-gray-300"
            }`}
            onClick={handleToggleTfa}
          >
            <input
              type="checkbox"
              defaultChecked={isTfaEnabled}
              value=""
              className="sr-only peer"
            />
            <div
              className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600`}
            ></div>
          </label>
        </div>
        {isTfaEnabled ? (
          <>
            <p className="text-center">
              Scan The QrCode below to login with the password in the
              authenticator app
            </p>
            <div className="w-[100px] h-[100px] bg-black"></div>
          </>
        ) : null}
      </Modal>
    </>
  );
}

export default TfaToggle;
