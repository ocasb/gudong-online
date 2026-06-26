import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

import { calculateScore } from "./calculateScore";

export async function finishGame(
  roomId: string,
  roomData: any
) {
  const scoreResult =
    calculateScore(roomData);

  await updateDoc(
    doc(db, "rooms", roomId),
    {
      "gameState.scoreResult":
        scoreResult,

      "gameState.phase":
        "gameover",
    }
  );
}