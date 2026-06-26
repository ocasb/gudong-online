import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";
import { shouldReverseByLao } from "./skill/checkLao";
import { shouldBlockByZheng } from "./skill/checkZheng";
import { shouldDebuffBlock } from "./skill/checkDebuff";
import { addPlayerHistory } from "./history";

export async function identifyAnimal(
  roomId: string,
  animal: string,
  player: any
) {
  const roomRef = doc(
    db,
    "rooms",
    roomId
  );

  const snap =
    await getDoc(roomRef);

  const data = snap.data();

  if (!data) return null;

  const animals =
    data.gameState.animals;

    if (
  shouldBlockByZheng(
    data,
    animal
  )
) {
  return null;
}

if (
  shouldDebuffBlock(
    data,
    player
  )
) {
  return null;
}
  const realResult = animals[animal];

let result = realResult;

if (
  shouldReverseByLao(
    data,
    player
  )
) {
  result = !result;
}

await addPlayerHistory(roomId, player.color, {
  round: data.gameState.round,
  actorColor: player.color,
  actorRole: player.role,
  type: "identify_animal",
  target: animal,
  result: result ? "真品" : "贗品",
  note: `${player.color} 鑑定 ${animal}，結果：${
    result ? "真品" : "贗品"
  }`,
});

return result;
}