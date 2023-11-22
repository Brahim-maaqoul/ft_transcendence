import React, { MouseEvent, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const API = axios.create({
  baseURL: "http://localhost:8000/v1/api/",
  withCredentials: true,
});

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
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

  return isOpen ? (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="z-0 w-1/3 md:w-[500px] h-2/3 relative p-2 md:rounded-3xl bg-slate-500 bg-opacity-30  md:shadow-black md:shadow-2xl overflow-y-scroll no-scrollbar ">
        <div className="w-full overflow-hidden h-full md:bg-opacity-70 md:bg-slate-950 text-white m-auto rounded-2xl p-10 flex flex-col justify-center items-center gap-10">
          <div className="toggle flex flex-row items-center justify-center gap-20">
            <span className="text-center">enable/disable 2FA:</span>
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
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
