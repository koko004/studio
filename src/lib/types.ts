export interface Bot {
  id: string;
  name: string;
  token?: string; // Token is optional now in the main DB
  composeContent: string;
  status: 'active' | 'inactive' | 'unknown';
}
