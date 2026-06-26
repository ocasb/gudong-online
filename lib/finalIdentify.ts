import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export async function submitFinalIdentify(
  roomId: string,
  playerColor: string,
  targetColor: string
) {
  const roomRef = doc(
    db,
    "rooms",
    roomId
  );

  await updateDoc(roomRef, {
    [`gameState.identifyVotes.${playerColor}`]:
      targetColor,
  });
}
import {
  getDoc,
} from "firebase/firestore";

export async function allPlayersIdentified(
  roomId: string
) {
  const roomRef = doc(
    db,
    "rooms",
    roomId
  );

  const snap =
    await getDoc(roomRef);

  const data = snap.data();

  if (!data) return false;

  const players =
    data.players || [];

  const votes =
    data.gameState
      ?.identifyVotes || {};

  return (
    Object.keys(votes).length ===
    players.length
  );
}

export async function enterFinal(
  roomId: string
) {
  const roomRef = doc(
    db,
    "rooms",
    roomId
  );

  await updateDoc(roomRef, {
    "gameState.phase":
      "final",
  });
}