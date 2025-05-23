// chrome.storage.local.get(null,res => console.log(res));
import { useState } from 'react';

function App() {

  const [key, setKey] = useState<string>('');


 const saveKey = () => {
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ openaiKey: key }, () => {
      console.log("Key saved:", key);
      alert("Key saved successfully!");
    });
  } else {
    console.error("chrome.storage.local is not available.");
  }
};





  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">LeetCode Assistant</h1>
        <p className="text-gray-600 mb-4">Enter your OpenAI API Key</p>
        <input
          type="text"
          placeholder="sk-..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button
          onClick={saveKey}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Save Key
        </button>
      </div>
    </div>
  );
}

export default App;
