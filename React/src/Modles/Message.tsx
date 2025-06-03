export interface MessageDTO {
  id: number;
  content: string;
  subject?: string | null;
  userId?: number | null;
  guestName?: string | null;
  guestEmail?: string | null;
  ticketNumber?: string | null;  // שדה חדש
  createdAt: string;
  isRead: boolean;
  isDeleted: boolean;
}

export interface MessagePostModel {
  content: string;
  subject?: string | null;
  userId?: number | null;
  guestName?: string | null;
  guestEmail?: string | null;
  ticketNumber?: string | null;  // שדה חדש
}