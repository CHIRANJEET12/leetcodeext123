import React, { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { marked } from 'marked';

type Messages = {
    text: string;
    sender: 'user' | 'assistant';
}

// type newMessages = {
//     text: string;
//     sender: 'user' | 'assistant';
// }

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Messages[]>([]);
    const [input, setInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (toggleButtonRef.current) {
            toggleButtonRef.current.style.zIndex = '9999';
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSend = async (e?: React.KeyboardEvent | React.MouseEvent) => {

        if(e && 'key' in e){
            if(e.key!=='Enter') return;
            e.preventDefault();
        }

        if (input.trim() === '') return;
        

        const newMessages = [...messages, { text: input, sender: 'user' }];
        setMessages(newMessages as Messages[]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:8000/ai/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json();

            setMessages(prev => [
                ...prev,
                { text: data.response && data.response.trim() !== '' ? data.response : 'No response', sender: 'assistant' },
            ]);
        } catch (err) {
            console.error('Error sending message:', err);
            setMessages(prev => [...prev, { text: 'Error sending message', sender: 'assistant' }]);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <button
                onClick={toggleChat}
                ref={toggleButtonRef}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    padding: '10px 15px',
                    backgroundColor: '#28C244',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    zIndex: 10000,
                }}
            >
                plumAI
            </button>

            <div
                style={{
                    position: 'fixed',
                    top: '0',
                    right: isOpen ? '0' : '-350px',
                    width: '350px',
                    height: '100%',
                    backgroundColor: '#0F0F0F',
                    boxShadow: '-2px 0 8px rgba(0,0,0,0.2)',
                    transition: 'right 0.3s ease',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '5px',
                        backgroundColor: '#28C244',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '18px',
                    }}
                >
                    <span>plumAI</span>
                    <button
                        onClick={toggleChat}
                        className="bg-black ml-4 text-white font-medium p-1 rounded hover:bg-gray-200 transition"
                    >
                        Close
                    </button>
                </div>


                <div style={{
                    flex: 1,
                    padding: '10px',
                    overflowY: 'auto',
                    borderTop: '1px solid #ddd',
                    borderBottom: '1px solid #ddd',
                }}>
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            style={{
                                textAlign: msg.sender === 'user' ? 'right' : 'left',
                                margin: '5px 0',
                                padding: '8px',
                                backgroundColor: msg.sender === 'user' ? '#DCF8C6' : '#eee',
                                borderRadius: '8px',
                                color: msg.sender === 'user' ? '#000' : '#333',
                                maxWidth: '90%',
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: msg.sender === 'assistant' && msg.text
                                        ? marked.parse(msg.text)
                                        : msg.text || '',
                                }}
                            />
                        </div>
                    ))}

                    {/* Show "Assistant is typing..." only if the last message is from user and loading is true */}
                    {loading && messages.length > 0 && messages[messages.length - 1].sender === 'user' && (
                        <div
                            style={{
                                textAlign: 'left',
                                margin: '5px 0',
                                padding: '8px',
                                backgroundColor: '#eee',
                                borderRadius: '8px',
                                color: '#333',
                                fontStyle: 'italic',
                                maxWidth: '90%',
                            }}
                        >
                            Assistant is typing...
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', padding: '10px' }}>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={handleChange}
                        style={{
                            flex: 1,
                            padding: '8px',
                            fontSize: '16px',
                            borderRadius: '15px 50px 30px'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        onKeyDown={handleSend}
                        style={{
                            marginLeft: '10px',
                            padding: '8px 15px',
                            backgroundColor: '#28C244',
                            color: 'black',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            borderRadius: '15px 50px 30px'
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </>
    );
}

export default ChatWidget;

