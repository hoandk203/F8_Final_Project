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
  user_id: number;
  order_id: number;
  store_id: number;
  driver_id?: number;
  driver_fullname?: string;
  issue_name: string;
  description: string;
  status: IssueStatus;
  creator_role: CreatorRole;
  resolved_at?: string;
  issue_image_url?: string;
  created_at: string;
  updated_at: string;
  last_message_at?: string;
  last_message_id?: number;
  message_count: number;
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