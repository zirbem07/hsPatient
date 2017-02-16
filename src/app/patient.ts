import { User } from '../models/user';

export class Patient {
  access_key: string;
  access_token: string;
  account_id: string;
  id: string;
  status: string;
  user_id: string;
  username: string;
  attributes: User;
  patientLog: any;
  TherapistID: string; 
  AccountType: string;
  
  constructor(data) {
    this.access_key = data.access_key;
    this.access_token = data.access_token;
    this.account_id = data.account_id;
    this.id = data.id;
    this.status = data.status;
    this.user_id = data.user_id;
    this.username = data.username;
  }

  get(attr) {
    return this[attr]
  }

  set(attr, value) {
    this[attr] = value;
  }
}