import React, { FC, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Chat, NavigationState } from '../types';
import { mockChats, mockUsers } from '../services';
import { useAuth } from '../contexts';

const MessagesPage: FC<{ setNavigation: Dispatch<SetStateAction<NavigationState>> }> = ({ setNavigation }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!user) return;
    const userChats = mockChats.filter(chat => chat.participants.includes(user.uid));
    setChats(userChats);
  }, [user]);

  const getOtherParticipant = (chat: Chat) => {
      const otherId = chat.participants.find(p => p !== user?.uid)!;
      return mockUsers.find(u => u.uid === otherId)!;
  };

  if (!user) return <div className="flex items-center justify-center h-full p-8 text-center">Please log in to see your messages.</div>;

  return (
    <div className="pb-24 md:pb-0 h-full flex flex-col">
      <div className="bg-primary text-white p-4 text-center text-xl font-bold shadow-md sticky top-0 md:relative">Messages</div>
      <div className="divide-y dark:divide-gray-700 flex-1 overflow-y-auto">
        {chats.map(chat => {
            const otherUser = getOtherParticipant(chat);
            return (
                <div key={chat.id} className="p-4 flex items-center space-x-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={() => setNavigation({ page: 'chat', params: { chatId: chat.id, recipient: otherUser } })}>
                    <img src={otherUser.photoURL} alt={otherUser.displayName} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1">
                        <p className="font-bold">{otherUser.displayName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{chat.lastMessage}</p>
                    </div>
                     <span className="text-xs text-gray-400 dark:text-gray-500">{chat.timestamp}</span>
                </div>
            )
        })}
      </div>
    </div>
  );
};

export default MessagesPage;