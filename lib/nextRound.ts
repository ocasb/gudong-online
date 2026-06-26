import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export async function nextRound(
  roomId: string
) {
  const roomRef =
    doc(db, "rooms", roomId);

  const snap =
    await getDoc(roomRef);

  const data =
    snap.data();

  if (!data) return;

  const gameState =
    data.gameState;

  const currentRound = gameState.round;

  const roundResults = {
    ...(gameState.roundResults || {}),

    [`round${currentRound}`]: {
        firstPlace: gameState.voteResult.firstPlace,
        secondPlace: gameState.voteResult.secondPlace,
    },
}; 

  const nextRoundNo =
    gameState.round + 1;

  if (nextRoundNo > 3) {

    await updateDoc(roomRef, {
  gameState: {
    ...gameState,
    roundResults,
    phase: "identify",
  },
});

return;
}

  await updateDoc(
    roomRef,
    {
      gameState: {
        ...gameState,

        roundResults,

        round:
          nextRoundNo,

        phase:
          "action",

        actedPlayers: [],

        currentAnimals:
          gameState.rounds[
            `round${nextRoundNo}`
          ],

        currentPlayerColor:
          gameState.lastPlayerColor,

        voteResult: {
          firstPlace: "",
          secondPlace: "",
          revealed: false,
        },
      },
    }
  );
}