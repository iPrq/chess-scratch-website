import { useState, useRef, useEffect, JSX } from "react";

type ChatBoxProps = {
  chatMessages: any[];
  sendChatMessage: (msg: string) => void;
  playerColor: string | null;
};

export default function ChatBox({ chatMessages, sendChatMessage, playerColor }: ChatBoxProps): JSX.Element {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendChatMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full bg-[#f3f4ef] rounded-2xl overflow-hidden font-inter relative">
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_24px_50px_-12px_rgba(25,28,25,0.04)]" />
      <div className="p-8 pb-4 relative z-10">
        <h2 className="font-manrope text-[1.75rem] font-bold text-[#191c19] leading-tight tracking-tight">
          Study Chat
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-8 space-y-6 relative z-10">
        {chatMessages?.map((msg, i) => {
          const isMe = playerColor && msg.senderColor?.toUpperCase() === playerColor?.toUpperCase();
          const isSpectator = msg.senderColor?.toUpperCase() === "SPECTATOR";
          return (
            <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              <span className="text-[0.70rem] font-bold text-[#393a29] mb-1.5 uppercase tracking-widest">{msg.senderColor}</span>
              <div className={`px-5 py-3 rounded-[1.25rem] max-w-[90%] text-[0.875rem] shadow-[0_4px_12px_rgba(25,28,25,0.03)] font-medium leading-relaxed ${isMe ? "bg-[#154212] text-[#ffffff] rounded-br-[4px]" : isSpectator ? "bg-[#e7e9e3] text-[#191c19] rounded-bl-[4px]" : "bg-[#ffffff] text-[#191c19] rounded-bl-[4px]"}`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        {(!chatMessages || chatMessages.length === 0) && (
          <div className="text-[#393a29] font-medium italic mt-2 text-sm">Silence in the study...</div>
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSend} className="p-6 relative z-10 flex gap-4 mt-2">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          className="flex-1 bg-[#e1e3de] focus:bg-[#ffffff] rounded-2xl px-5 py-3.5 text-[0.875rem] text-[#191c19] outline-none border border-transparent focus:border-[#154212]/20 transition-all font-medium placeholder:text-[#393a29]/60 shadow-[0_4px_12px_rgba(25,28,25,0.02)]"
          placeholder="Discuss the move..."
        />
        <button type="submit" className="bg-[#154212] text-[#ffffff] px-6 py-3.5 rounded-[1.5rem] font-bold text-[0.875rem] hover:bg-[#2d5a27] transition-colors shadow-[0_8px_16px_rgba(21,66,18,0.15)] flex items-center justify-center">
          Send
        </button>
      </form>
    </div>
  );
}
