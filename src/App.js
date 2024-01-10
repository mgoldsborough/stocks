import { useState, useEffect } from "react";
import Modal from "react-modal";

import { initializeWebSocket, subscribePolygon } from "./websocket";

import "./App.css";
import StockTable from "./StockTable";

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "");

  const [tickers, setTickers] = useState("");

  const [stockData, setStockData] = useState([]);

  // store the API key in local storage
  useEffect(() => {
    localStorage.setItem("apiKey", apiKey);

    if (apiKey) {
      const ws = initializeWebSocket(apiKey);
      subscribePolygon(ws, (newData) => {
        setStockData((prevData) => {
          const updatedData = { ...prevData };
          updatedData[newData.sym] = newData;
          return updatedData;
        });
      });

      return () => {
        // Make sure to close the WebSocket when the component unmounts
        if (ws) ws.close();
      };
    }
  }, [apiKey]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleApiKeyChange = (e) => setApiKey(e.target.value);

  const saveApiKey = () => {
    localStorage.setItem("apiKey", apiKey);
    closeModal();
  };

  return (
    <div className="App">
      {/* API Key Warning Banner */}
      {!apiKey && (
        <div className="bg-red-500 text-white text-center p-2">
          Please set your API key
        </div>
      )}

      <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Stock Ticker Dashboard</h1>
        <svg
          onClick={openModal}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      </header>

      <div className="p-4">
        <div className="mb-4">
          <label
            htmlFor="tickers"
            className="block text-sm font-medium text-gray-700"
          >
            Tickers
          </label>
          <input
            type="text"
            id="tickers"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={tickers}
            onChange={(e) => setTickers(e.target.value)}
            placeholder="AAPL, MSFT, AMZN..."
          />
        </div>
      </div>
      <StockTable data={stockData} />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="API Key Modal"
        className="m-auto mt-40 w-1/3 bg-white p-5 border border-gray-300 rounded shadow-lg"
      >
        <h2 className="text-lg mb-4">Enter API Key</h2>
        <input
          type="text"
          value={apiKey}
          onChange={handleApiKeyChange}
          className="border border-gray-300 rounded w-full px-3 py-2 mb-4"
        />
        <button
          onClick={saveApiKey}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </Modal>
    </div>
  );
}

export default App;
