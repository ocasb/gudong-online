import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export async function passTurn(
  roomId: string,
  nextColor: string
) {
  const roomRef = doc(
    db,
    "rooms",
    roomId
  );

  const snap =
    await getDoc(roomRef);

  const data = snap.data();

  if (!data) return;

  const gameState =
    data.gameState;

  const currentColor =
    gameState.currentPlayerColor;

  const actedPlayers =
    gameState.actedPlayers || [];

  const newActedPlayers = [
    ...actedPlayers,
    currentColor,
  ];

  const allPlayers =
    data.players.map(
      (p: any) => p.color
    );

const allActed =
  newActedPlayers.length ===
  allPlayers.length;

console.log(
  "allPlayers",
  allPlayers
);

console.log(
  "newActedPlayers",
  newActedPlayers
);

console.log(
  "allActed",
  allActed
);

  // 全員行動完成

  if (allActed) {
    await updateDoc(roomRef, {
      gameState: {
        ...gameState,

        actedPlayers:
          newActedPlayers,

        currentPlayerColor:
          null,

        lastPlayerColor:
          currentColor,

        phase: "vote",
      },
    });

    return;
  }

  // 繼續下一位

  await updateDoc(roomRef, {
    gameState: {
      ...gameState,

      currentPlayerColor:
        nextColor,

      actedPlayers:
        newActedPlayers,

      lastPlayerColor:
        currentColor,
    },
  });
}