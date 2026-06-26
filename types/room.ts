import { Player } from "./player";

export interface Room {
  roomId: string;

  status:
    | "waiting"
    | "playing"
    | "finished";

  createdAt: number;

  playerLimit: number;

  players: Player[];
}