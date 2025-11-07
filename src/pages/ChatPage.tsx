import React, { FC, useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { Message, NavigationState } from '../types';
import { mockMessages } from '../services';
import { useAuth } from '../contexts';
import { Icon } from '../components';

const ChatPage: FC<{ params: any, setNavigation: Dispatch<SetStateAction<NavigationState>> }> = ({ params, setNavigation }) => {
    const { chatId, recipient } = params;
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chatMessages = mockMessages.filter(m => m.chatId === chatId);
        setMessages(chatMessages);
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !user) return;
        const message: Message = {
            id: `msg${Date.now()}`,
            chatId,
            senderId: user.uid,
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, message]);
        setNewMessage("");
    };

    return (
        <div className="flex flex-col h-screen max-h-screen">
            <header className="bg-white dark:bg-gray-800 p-3 flex items-center space-x-3 shadow-md fixed top-0 w-full z-10 md:relative">
                <button onClick={() => setNavigation({ page: 'messages' })} className="md:hidden"><Icon name="back" className="w-6 h-6 text-primary dark:text-secondary" /></button>
                <img src={recipient.photoURL} alt={recipient.displayName} className="w-10 h-10 rounded-full object-cover" />
                <h2 className="font-bold text-lg">{recipient.displayName}</h2>
            </header>
            <main className="flex-1 overflow-y-auto pt-20 pb-20 bg-gray-100 dark:bg-gray-900 p-4 space-y-4 md:pt-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.senderId === user?.uid ? 'bg-secondary text-white rounded-br-none' : 'bg-white dark:bg-gray-700 rounded-bl-none'}`}>
                            <p>{msg.text}</p>
                            <span className="text-xs float-right mt-1 opacity-70">{msg.timestamp}</span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>
            <footer className="bg-white dark:bg-gray-800 p-2 fixed bottom-0 w-full flex items-center space-x-2 shadow-inner md:relative">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-full focus:outline-none"
                />
                <button onClick={handleSendMessage} className="bg-primary text-white p-3 rounded-full">
                    <Icon name="send" className="w-6 h-6"/>
                </button>
            </footer>
        </div>
    );
};

export default ChatPage;