export interface ILink {
  id: string;
  institution: string;
  access_mode: string | null;
  status: string;
  refresh_rate: string | null;
  created_by: string;
  last_accessed_at: Date | null;
  external_id: string | null;
  created_at: Date;
  institution_user_id: string;
  credentials_storage: string;
  stale_in: string | null;
  fetch_resources: [string];
}
