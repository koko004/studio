export interface Bot {
  id: string;
  name: string;
  token: string;
  composeContent: string;
  status: 'active' | 'inactive' | 'unknown';
}
