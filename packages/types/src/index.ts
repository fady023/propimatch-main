export type UUID = string;

export type UserRole = 'seeker' | 'lister' | 'admin';

export interface UserProfile {
  id: UUID;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  credits: number;
  createdAt: string;
}

export type TransactionType = 'purchase' | 'spend' | 'refund';
export interface CreditTransaction {
  id: UUID;
  userId: UUID;
  type: TransactionType;
  amount: number;
  description?: string;
  createdAt: string;
}

export type RequestType = 'buy' | 'rent';
export interface PropertyRequest {
  id: UUID;
  userId: UUID;
  type: RequestType;
  location: string;
  budget: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  createdAt: string;
  status: 'open' | 'matched' | 'closed';
}

export type ListingType = 'sale' | 'rent';
export interface PropertyListing {
  id: UUID;
  userId: UUID;
  type: ListingType;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  images: string[];
  amenities: string[];
  coords: { lat: number; lng: number };
  createdAt: string;
  approved: boolean;
}

export interface MatchResult {
  id: UUID;
  requestId?: UUID;
  listingId: UUID;
  score: number;
  shortlisted?: boolean;
  discarded?: boolean;
}

export interface ChatMessage {
  id: UUID;
  conversationId: UUID;
  senderId: UUID;
  content: string;
  createdAt: string;
  readAt?: string;
  meta?: {
    type?: 'text' | 'system' | 'ai';
    action?: 'regenerate' | 'copy' | 'feedback';
  };
}

export interface Conversation {
  id: UUID;
  participantIds: UUID[];
  lastMessageAt: string;
  unreadCount?: number;
}

export interface NotificationItem {
  id: UUID;
  userId: UUID;
  type: 'match' | 'message' | 'appointment' | 'credit' | 'system';
  title: string;
  body: string;
  createdAt: string;
  readAt?: string;
}

export interface ViewingRequest {
  id: UUID;
  listingId: UUID;
  requesterId: UUID;
  scheduledAt: string;
  note?: string;
  status: 'pending' | 'confirmed' | 'declined' | 'completed';
}

export interface AdminActionLog {
  id: UUID;
  actorId: UUID;
  action: 'ban' | 'unban' | 'deactivate' | 'approveListing' | 'rejectListing' | 'refundCredits';
  targetId?: UUID;
  listingId?: UUID;
  meta?: Record<string, unknown>;
  createdAt: string;
}

