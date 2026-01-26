export interface UserDTO {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  isActive: boolean;
}

export interface MessageDTO {
  id: string;
  content?: string;
  attachmentUrl?: string;
  attachmentType?: "IMAGE" | "VIDEO" | "FILE" | "AUDIO";
  senderId: string;
  conversationId: string;
  status: "seen" | "unseen";
  createdAt: string;
}

export interface ConversationItemDTO {
  id: string;
  user: UserDTO;
  lastMessage?: string;
  unreadCount: number;
  lastMessageTime: string;
}
