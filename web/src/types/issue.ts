export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum CreatorRole {
  ADMIN = 'admin',
  STORE = 'store',
  DRIVER = 'driver'
}

export enum SenderRole {
  ADMIN = 'admin',
  STORE = 'store',
  DRIVER = 'driver'
}

export interface Issue {
  id: number;
  userId: number;
  orderId: number;
  storeId: number;
  driverId?: number;
  issueName: string;
  description: string;
  status: IssueStatus;
  creatorRole: CreatorRole;
  resolvedAt?: string;
  issueImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
  lastMessageId?: number;
  messageCount: number;
  store?: {
    id: number;
    name: string;
  };
  driver?: {
    id: number;
    name: string;
  };
}

export interface IssueMessage {
  id: number;
  issueId: number;
  senderId: number;
  message: string;
  fileIds?: string[];
} 