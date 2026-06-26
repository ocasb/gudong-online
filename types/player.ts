export interface Player {
  id: string;
  name: string;

  color: string;

  role?: string;

  partnerColor?: string;

  isHost: boolean;

  joinedAt: number;
}