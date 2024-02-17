export class LinkGenDTO {
  institution: string;
  username: string;
  password: string;
}

export class transactionsDTO extends LinkGenDTO {
  date_from?: string;
  date_to?: string;
}
