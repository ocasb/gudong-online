import {
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type HistoryType =
  | "identify_animal"
  | "identify_player"
  | "block_animal"
  | "skip_player"
  | "reverse_result"
  | "vote_result";

export async function addPlayerHistory(
  roomId: string,
  playerColor: string,
  data: {
    round: number;
    actorColor: string;
    actorRole?: string;
    type: HistoryType;
    target?: string;
    result?: string;
    note: string;
  }
) {
  const roomRef = doc(db, "rooms", roomId);

  await updateDoc(roomRef, {
    [`gameState.playerHistory.${playerColor}`]:
      arrayUnion({
        ...data,
        createdAt: Date.now(),
      }),
    updatedAt: serverTimestamp(),
  });
}