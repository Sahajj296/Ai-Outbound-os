// Placeholder interfaces for leads
export interface Lead {
  id: string;
  name: string;
  email: string;
  status?: string;
  [key: string]: any;
}
