import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

const ANIMALS = [
  "鼠",
  "牛",
  "虎",
  "兔",
  "龍",
  "蛇",
  "馬",
  "羊",
  "猴",
  "雞",
  "狗",
  "豬",
];

const ROLES_6 = [
  "老朝奉",
  "藥不然",
  "許願",
  "方震",
  "黃煙煙",
  "木戶加奈",
];

const ROLES_7 = [
  ...ROLES_6,
  "鄭國渠",
];

const ROLES_8 = [
  ...ROLES_7,
  "姬雲浮",
];

function shuffle<T>(arr: T[]) {
  const copy = [...arr];

  for (
    let i = copy.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [copy[i], copy[j]] = [
      copy[j],
      copy[i],
    ];
  }

  return copy;
}

const truths = shuffle([
  true,
  true,
  true,
  true,
  true,
  true,

  false,
  false,
  false,
  false,
  false,
  false,
]);

const animalMap: Record<
  string,
  boolean
> = {};

ANIMALS.forEach(
  (animal, index) => {
    animalMap[animal] =
      truths[index];
  }
);

const shuffledAnimals =
  shuffle(ANIMALS);

const rounds = {
  round1:
    shuffledAnimals.slice(0, 4),

  round2:
    shuffledAnimals.slice(4, 8),

  round3:
    shuffledAnimals.slice(8, 12),
};

export async function startGame(
  roomId: string
) {
  const roomRef = doc(
    db,
    "rooms",
    roomId
  );

  const snap = await getDoc(
    roomRef
  );

  if (!snap.exists()) return;

  const room = snap.data();

  const players =
    room.players || [];

  let roles: string[] = [];

  switch (players.length) {
    case 6:
      roles = ROLES_6;
      break;

    case 7:
      roles = ROLES_7;
      break;

    case 8:
      roles = ROLES_8;
      break;

    default:
  console.error("人數錯誤，目前人數：", players.length);
  return;
  }

  const shuffledRoles =
    shuffle(roles);

  const newPlayers =
    players.map(
      (player: any, index: number) => ({
        ...player,
        role:
          shuffledRoles[index],
      })
    );

  const lao =
    newPlayers.find(
      (p: any) =>
        p.role === "老朝奉"
    );

  const yao =
    newPlayers.find(
      (p: any) =>
        p.role === "藥不然"
    );

  if (lao && yao) {
    newPlayers.forEach(
      (player: any) => {
        if (
          player.role ===
          "老朝奉"
        ) {
          player.partnerColor =
            yao.color;
        }

        if (
          player.role ===
          "藥不然"
        ) {
          player.partnerColor =
            lao.color;
        }
      }
    );
  }

  // 第一回合隨機首位玩家

  const firstPlayer =
    newPlayers[
      Math.floor(
        Math.random() *
          newPlayers.length
      )
    ];

    const debuffRounds = {
  黃煙煙:
    Math.floor(
      Math.random() * 3
    ) + 1,

  木戶加奈:
    Math.floor(
      Math.random() * 3
    ) + 1,
};

 await updateDoc(roomRef, {
  status: "playing",

  players: newPlayers,

  gameState: {
  round: 1,

  debuffRounds,

  score: 0,

  animals: animalMap,

  rounds,

  currentAnimals:
    rounds.round1,

  actedPlayers: [],

  currentPlayerColor:
    firstPlayer.color,

  lastPlayerColor:
    null,

  firstPlayerColor:
    firstPlayer.color,

  blockedAnimals: [],

  pendingAttacks: [],

  roundSkills: {},

history: [],

  voteResult: {
    firstPlace: "",
    secondPlace: "",
    revealed: false,
  },

  phase: "action",

  createdAt: Date.now(),
},
});
}