export interface IWebhook {
  webhook_id: string;
  webhook_type: string;
  webhook_code: string;
  link_id: string;
  request_id: string;
  external_id: string;
  data: any;
}
