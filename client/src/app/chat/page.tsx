"use client";
import axios from "axios";
import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputField = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setInput(value);
  };

  const handleAsk = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    callServer();
    setInput("");
  };

  const callServer = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3001/chat", {
        message: input,
      });

      setData(response.data.message);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main className="min-h-screen bg-neutral-900 mb-34">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <>
          {/* messages goes here  */}

          {/* user message  */}
          {messages.map((item, index) => (
            <div
              key={index}
              className="my-6 bg-neutral-800 text-white p-3 rounded-xl ml-auto max-w-fit"
            >
              {item.content}
            </div>
          ))}
        </>

        {/* assistant message */}
        <div className={`my-6 bg-neutral-800 text-white p-3 rounded-xl mr-auto max-w-fit ${loading && "animate-pulse "}`}>
          {loading ? "Thinking.." : data}
        </div>

        {/* bottom textarea goes here  */}
        <div className="fixed w-full inset-x-0 bottom-0 flex items-center justify-center bg-neutral-900">
          <div className="bg-neutral-800 p-4 rounded-3xl w-full max-w-3xl mb-4">
            <textarea
              className="w-full resize-none outline-0 p-2"
              rows={2}
              onChange={handleInputField}
              name="userMessage"
              value={input}
            ></textarea>
            <div className="flex justify-end">
              <button
                className="bg-white text-black px-4 py-2 rounded-full cursor-pointer bg-gray-300"
                onClick={handleAsk}
              >
                Ask
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
