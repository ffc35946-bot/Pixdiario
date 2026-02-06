
export enum PixKeyType {
  EMAIL = 'email',
  PHONE = 'telefone',
  CPF = 'cpf',
  RANDOM = 'chave_aleatoria'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  pixKeyType?: PixKeyType;
  pixKey?: string;
  cpf?: string;
  notification?: string;
  isBanned?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  value: string;
  createdAt: string;
}

export type RequestStatus = 'pending' | 'paid' | 'waiting_receipt' | 'completed';

export interface ParticipationRequest {
  id: string;
  userId: string;
  eventId: string;
  userName: string;
  userPhone: string;
  userPixKey: string;
  userCpf: string;
  eventTitle: string;
  eventValue: string;
  status: RequestStatus;
  createdAt: string;
}
