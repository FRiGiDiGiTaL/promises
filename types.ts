
export enum PromiseStatus {
  PENDING = 'Pending',
  FULFILLED = 'Fulfilled',
  BROKEN = 'Broken',
  UNCLEAR = 'Unclear'
}

export interface PromiseEntry {
  id: string;
  personName: string;
  description: string;
  dateMade: string; // ISO string
  followUpDate: string; // ISO string
  notes?: string;
  status: PromiseStatus;
  remindMe: boolean;
  createdAt: string;
}

export interface FilterState {
  search: string;
  status: PromiseStatus | 'All';
  person: string | 'All';
}
