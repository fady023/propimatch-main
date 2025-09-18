import { type UserProfile, type PropertyListing, type PropertyRequest, type Conversation, type ChatMessage, type NotificationItem, type CreditTransaction } from '@propimatch/types';

export const users: UserProfile[] = [
  { id: 'u1', name: 'Aisha Khan', email: 'aisha@example.com', role: 'seeker', credits: 20, createdAt: new Date().toISOString(), avatarUrl: 'https://i.pravatar.cc/100?img=1' },
  { id: 'u2', name: 'Omar Ali', email: 'omar@example.com', role: 'lister', credits: 100, createdAt: new Date().toISOString(), avatarUrl: 'https://i.pravatar.cc/100?img=2' },
  { id: 'u3', name: 'Admin', email: 'admin@example.com', role: 'admin', credits: 1000, createdAt: new Date().toISOString() }
];

export const listings: PropertyListing[] = [
  {
    id: 'l1', userId: 'u2', type: 'sale', title: 'Marina View 2BR Apartment', description: 'Stunning view of Dubai Marina, high floor', price: 2100000,
    location: 'Dubai Marina, Dubai', bedrooms: 2, bathrooms: 2, areaSqft: 1250, images: ['https://picsum.photos/seed/marina/800/600'], amenities: ['Pool', 'Gym', 'Parking'],
    coords: { lat: 25.080, lng: 55.139 }, createdAt: new Date().toISOString(), approved: true
  },
  {
    id: 'l2', userId: 'u2', type: 'rent', title: 'JVC Cozy 1BR', description: 'Affordable 1BR in JVC', price: 6500,
    location: 'Jumeirah Village Circle, Dubai', bedrooms: 1, bathrooms: 1, areaSqft: 780, images: ['https://picsum.photos/seed/jvc/800/600'], amenities: ['Balcony', 'Security'],
    coords: { lat: 25.056, lng: 55.205 }, createdAt: new Date().toISOString(), approved: true
  },
  {
    id: 'l3', userId: 'u2', type: 'rent', title: 'Abu Dhabi Corniche 3BR', description: 'Sea view family apartment', price: 12000,
    location: 'Corniche, Abu Dhabi', bedrooms: 3, bathrooms: 3, areaSqft: 1600, images: ['https://picsum.photos/seed/ad/800/600'], amenities: ['Sea View', 'Maid Room'],
    coords: { lat: 24.485, lng: 54.353 }, createdAt: new Date().toISOString(), approved: true
  }
];

export const requests: PropertyRequest[] = [
  { id: 'r1', userId: 'u1', type: 'rent', location: 'Dubai Marina', budget: 8000, bedrooms: 2, amenities: ['Pool', 'Parking'], createdAt: new Date().toISOString(), status: 'open' },
  { id: 'r2', userId: 'u1', type: 'buy', location: 'JVC', budget: 2000000, bedrooms: 2, createdAt: new Date().toISOString(), status: 'matched' },
  // Demo matches: buy request to match Dubai Marina sale listing (l1)
  { id: 'r3', userId: 'u1', type: 'buy', location: 'Dubai Marina', budget: 2300000, bedrooms: 2, amenities: ['Parking'], createdAt: new Date().toISOString(), status: 'open' },
  // Demo matches: rent request to match JVC rent listing (l2)
  { id: 'r4', userId: 'u1', type: 'rent', location: 'Jumeirah Village Circle', budget: 7000, bedrooms: 1, createdAt: new Date().toISOString(), status: 'open' },
  // Demo matches: rent request to match Abu Dhabi Corniche rent listing (l3)
  { id: 'r5', userId: 'u1', type: 'rent', location: 'Corniche', budget: 13000, bedrooms: 3, createdAt: new Date().toISOString(), status: 'open' }
];

export const conversations: Conversation[] = [
  { id: 'c1', participantIds: ['u1','u2'], lastMessageAt: new Date().toISOString(), unreadCount: 1 }
];

export const messages: ChatMessage[] = [
  { id: 'm1', conversationId: 'c1', senderId: 'u2', content: 'Hello! I saw your request for a 2BR in Marina.', createdAt: new Date().toISOString() },
  { id: 'm2', conversationId: 'c1', senderId: 'u1', content: 'Hi! Yes, do you have options within 8k?', createdAt: new Date().toISOString() }
];

export const notifications: NotificationItem[] = [
  { id: 'n1', userId: 'u1', type: 'match', title: 'New Match Found', body: 'We found 3 new properties matching your request r1.', createdAt: new Date().toISOString() },
  { id: 'n2', userId: 'u1', type: 'message', title: 'New message from Omar', body: 'Hello! I saw your request...', createdAt: new Date().toISOString() }
];

export const transactions: CreditTransaction[] = [
  { id: 't1', userId: 'u1', type: 'purchase', amount: 20, description: 'Welcome bonus', createdAt: new Date().toISOString() }
];

export const currentUser = users[0];

