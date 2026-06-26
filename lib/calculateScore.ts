export function calculateScore(roomData: any) {
  const gameState = roomData.gameState;
  const players = roomData.players;

  let relicScore = 0;
  let identifyScore = 0;
  let laoScore = 0;
  let yaoScore = 0;

  // =========
  // ① 六件寶物計分
  // =========

  const roundResults =
    gameState.roundResults || {};

  Object.values(roundResults).forEach(
    (round: any) => {
      if (
        gameState.animals[
          round.firstPlace
        ]
      ) {
        relicScore++;
      }

      if (
        gameState.animals[
          round.secondPlace
        ]
      ) {
        relicScore++;
      }
    }
  );

  // =========
  // 找角色
  // =========

  const lao =
    players.find(
      (p: any) =>
        p.role === "老朝奉"
    );

  const xuyuan =
    players.find(
      (p: any) =>
        p.role === "許願"
    );

  const yao =
    players.find(
      (p: any) =>
        p.role === "藥不然"
    );

  const fang =
    players.find(
      (p: any) =>
        p.role === "方震"
    );

  const votes =
    gameState.identifyVotes || {};

  // =========
  // ② 是否成功抓老朝奉
  // =========

  if (lao) {

    let count = 0;

    const goodPlayers = players.filter(
  (p: any) =>
    ![
      "老朝奉",
      "藥不然",
      "鄭國渠",
    ].includes(p.role)
);

goodPlayers.forEach((p: any) => {
  if (votes[p.color] === lao.color) {
    count++;
  }
});

if (count > goodPlayers.length / 2) {
  identifyScore = 1;
}

  }

  // =========
  // ③ 老朝奉有沒有猜中許願
  // =========

  if (
    lao &&
    xuyuan
  ) {

    if (
      votes[lao.color] !==
      xuyuan.color
    ) {

      laoScore = 2;

    }

  }

  // =========
  // ④ 藥不然有沒有猜中方震
  // =========

  if (
    yao &&
    fang
  ) {

    if (
      votes[yao.color] !==
      fang.color
    ) {

      yaoScore = 1;

    }

  }

  // =========

  const total =
    relicScore +
    identifyScore +
    laoScore +
    yaoScore;

 return {
  relicScore,
  identifyScore,
  laoScore,
  yaoScore,
  total,

  winner:
    total >= 6
      ? "xuyuan"
      : "laochaofeng",

  details: {
    relics: roundResults,
    identifySuccess: identifyScore === 1,
    laoGuessCorrect: laoScore === 0,
    yaoGuessCorrect: yaoScore === 0,
  },
};

}