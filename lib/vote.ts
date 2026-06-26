import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export async function setVoteResult(
  roomId: string,
  firstPlace: string,
  secondPlace: string
) {
  const roomRef = doc(
    db,
    "rooms",
    roomId
  );

  await updateDoc(roomRef,{
  "gameState.voteResult": {
    firstPlace,
    secondPlace,
    revealed: true
  },
  "gameState.phase": "result"
});
}

export async function revealVoteResult(
  roomId: string
) {
  const roomRef = doc(
    db,
    "rooms",
    roomId
  );

  await updateDoc(roomRef, {
    "gameState.voteResult.revealed":
      true,
  });
}