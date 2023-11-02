import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";

const API = axios.create({
  baseURL: "http://localhost:8000/v1/api/",
  withCredentials: true,
});

function PostButton() {
  const [response, setResponse] = useState(null);
  const [requestStatus, setRequestStatus] = useState("idle");

  const handleRequest = async () => {
    try {
      setRequestStatus("loading");
      const response: AxiosResponse = await API.post("/user/enableTFA");
      if (response.status === 200) {
        setRequestStatus("success");
        const responseGet: AxiosResponse = await API.get("/user/getqrcode");
        console.log(responseGet.data);
      }
    } catch (error) {
      console.error("Error:", error);
      setRequestStatus("error");
    }
  };

  return (
    <div>
      <button onClick={handleRequest} disabled={requestStatus === "loading"}>
        Send POST Request
      </button>
      {requestStatus === "loading" && <p>Loading...</p>}
      {requestStatus === "success" && <p>Request was successful!</p>}
      {requestStatus === "error" && <p>Request failed.</p>}
    </div>
  );
}

export default PostButton;
