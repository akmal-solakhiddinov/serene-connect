// ============= User Types =============

export interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastSeen?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  joinedAt?: string;
}

// ============= Message Types =============

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: MessageStatus;
}

// ============= Conversation Types =============

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages?: Message[];
}

// ============= Profile Types =============

export interface ProfileStats {
  messagesCount: number;
  mediaCount: number;
  linksCount: number;
}

export interface SharedMedia {
  id: string;
  type: 'image' | 'video' | 'file';
  url: string;
  thumbnailUrl?: string;
}

export interface RecentLink {
  id: string;
  title: string;
  url: string;
  type: 'document' | 'music' | 'link';
}

export interface UserProfile extends User {
  stats: ProfileStats;
  sharedMedia: SharedMedia[];
  recentLinks: RecentLink[];
}

// ============= Search Types =============

export interface UserSearchResult {
  user: User;
  conversation?: Conversation;
  hasExistingConversation: boolean;
}

// ============= API Response Types =============

export interface ConversationsResponse {
  conversations: Conversation[];
}

export interface MessagesResponse {
  messages: Message[];
}

export interface SendMessageRequest {
  content: string;
}

export interface SendMessageResponse {
  message: Message;
}

export interface UserSearchResponse {
  results: UserSearchResult[];
}

export interface CurrentUserResponse {
  user: User;
}

export interface UserProfileResponse {
  profile: UserProfile;
}
