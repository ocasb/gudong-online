"use client";

import { useLaoSkill } from "../../lib/skill/lao";

export function LaoSkill({
  roomId,
  roomData,
  player,
}: {
  roomId: string | null;
  roomData: any;
  player: any;
}) {
  if (
    roomData?.gameState?.phase !== "action" ||
    player?.role !== "老朝奉"
  ) {
    return null;
  }

  const round =
    roomData.gameState.round;

  const used =
    !!roomData?.gameState?.roundSkills?.[
      `round${round}`
    ]?.lao;

    if (used) {
  return (
    <div className="mt-4 border rounded p-4 text-gray-600">
      老朝奉技能已使用
    </div>
  );
}

return (
  <div className="mt-4 border rounded p-4">

    <div className="font-bold mb-3">
      老朝奉技能
    </div>

    <div className="text-sm mb-3">
      發動後，老朝奉之後所有玩家的鑑定結果反轉。
    </div>

    <button
      onClick={async () => {
        if (!roomId) return;

        await useLaoSkill(
          roomId,
          round
        );
      }}
      className="mt-4 w-full bg-red-600 text-white rounded p-3"
    >
      發動反轉
    </button>

  </div>
);
}