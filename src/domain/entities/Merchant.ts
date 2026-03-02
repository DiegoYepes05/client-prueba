export interface AcceptanceToken {
  acceptance_token: string;
  permalink: string;
  type: string;
}

export interface Merchant {
  id: number;
  name: string;
  public_key: string;
  presigned_acceptance: AcceptanceToken;
  presigned_personal_data_auth: AcceptanceToken;
}
