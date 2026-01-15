export interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export const currentUser: User = {
  id: 'current',
  name: 'You',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
  online: true,
};

// All users in the system (for global search)
export const allUsers: User[] = [
  {
    id: 'u1',
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    online: true,
  },
  {
    id: 'u2',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    online: false,
    lastSeen: '1h ago',
  },
  {
    id: 'u3',
    name: 'Sarah Miller',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    online: true,
  },
  {
    id: 'u4',
    name: 'Design Team',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop&crop=face',
    online: false,
  },
  {
    id: 'u5',
    name: 'James Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    online: false,
    lastSeen: '2d ago',
  },
  {
    id: 'u6',
    name: 'Olivia Brown',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    online: true,
  },
  // Additional users for discovery
  {
    id: 'u7',
    name: 'Michael Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    online: true,
  },
  {
    id: 'u8',
    name: 'Jessica Taylor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    online: false,
    lastSeen: '30m ago',
  },
  {
    id: 'u9',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    online: true,
  },
  {
    id: 'u10',
    name: 'Sophie Anderson',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    online: false,
    lastSeen: '5h ago',
  },
  {
    id: 'u11',
    name: 'Ryan Martinez',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    online: true,
  },
  {
    id: 'u12',
    name: 'Emily Davis',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    online: false,
    lastSeen: '1d ago',
  },
];

export const conversations: Conversation[] = [
  {
    id: '1',
    user: allUsers[0],
    lastMessage: 'That sounds great! Let me know when you\'re free 😊',
    lastMessageTime: '2 min',
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'u1', content: 'Hey! How are you doing?', timestamp: '10:30 AM', status: 'read' },
      { id: 'm2', senderId: 'current', content: 'Hi Emma! I\'m doing great, thanks for asking!', timestamp: '10:32 AM', status: 'read' },
      { id: 'm3', senderId: 'u1', content: 'Would you like to grab coffee sometime this week?', timestamp: '10:33 AM', status: 'read' },
      { id: 'm4', senderId: 'current', content: 'That would be wonderful! I\'m free on Thursday or Friday.', timestamp: '10:35 AM', status: 'read' },
      { id: 'm5', senderId: 'u1', content: 'That sounds great! Let me know when you\'re free 😊', timestamp: '10:36 AM', status: 'delivered' },
    ],
  },
  {
    id: '2',
    user: allUsers[1],
    lastMessage: 'The project files are ready for review',
    lastMessageTime: '1h',
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'current', content: 'Hey Alex, how\'s the project coming along?', timestamp: '9:00 AM', status: 'read' },
      { id: 'm2', senderId: 'u2', content: 'Going well! Almost done with the designs.', timestamp: '9:15 AM', status: 'read' },
      { id: 'm3', senderId: 'u2', content: 'The project files are ready for review', timestamp: '9:45 AM', status: 'read' },
    ],
  },
  {
    id: '3',
    user: allUsers[2],
    lastMessage: 'See you at the meeting!',
    lastMessageTime: '3h',
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'u3', content: 'Don\'t forget about the team meeting today!', timestamp: '7:00 AM', status: 'read' },
      { id: 'm2', senderId: 'current', content: 'Thanks for the reminder! What time is it?', timestamp: '7:05 AM', status: 'read' },
      { id: 'm3', senderId: 'u3', content: '3 PM in the main conference room', timestamp: '7:06 AM', status: 'read' },
      { id: 'm4', senderId: 'current', content: 'Perfect, I\'ll be there!', timestamp: '7:08 AM', status: 'read' },
      { id: 'm5', senderId: 'u3', content: 'See you at the meeting!', timestamp: '7:10 AM', status: 'read' },
    ],
  },
  {
    id: '4',
    user: allUsers[3],
    lastMessage: 'New mockups uploaded to Figma ✨',
    lastMessageTime: 'Yesterday',
    unreadCount: 5,
    messages: [
      { id: 'm1', senderId: 'u4', content: 'New mockups uploaded to Figma ✨', timestamp: 'Yesterday', status: 'delivered' },
    ],
  },
  {
    id: '5',
    user: allUsers[4],
    lastMessage: 'Thanks for your help!',
    lastMessageTime: '2d',
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'u5', content: 'Can you help me with the API integration?', timestamp: '2 days ago', status: 'read' },
      { id: 'm2', senderId: 'current', content: 'Of course! What do you need?', timestamp: '2 days ago', status: 'read' },
      { id: 'm3', senderId: 'u5', content: 'Thanks for your help!', timestamp: '2 days ago', status: 'read' },
    ],
  },
  {
    id: '6',
    user: allUsers[5],
    lastMessage: 'The presentation looks amazing! 🎉',
    lastMessageTime: '3d',
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'current', content: 'Check out the final presentation!', timestamp: '3 days ago', status: 'read' },
      { id: 'm2', senderId: 'u6', content: 'The presentation looks amazing! 🎉', timestamp: '3 days ago', status: 'read' },
    ],
  },
];
