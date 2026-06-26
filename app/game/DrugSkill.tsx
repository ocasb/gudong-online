"use client";

import { useState } from "react";
import { useDrugSkill } from "../../lib/skill/drug";

export function DrugSkill({
  roomId,
  roomData,
  player,
}: {
  roomId: string | null;
  roomData: any;
  player: any;
}) {
  const [targetColor, setTargetColor] =
    useState("");

  if (
    roomData?.gameState?.phase !== "action" ||
    player?.role !== "藥不然"
  ) {
    return null;
  }

  const round =
    roomData.gameState.round;

  const used =
    !!roomData?.gameState?.roundSkills?.[
      `round${round}`
    ]?.drug;

  if (used) {
    return (
      <div className="mt-4 border rounded p-4 text-gray-600">
        藥不然技能已使用
      </div>
    );
  }

  return (
    <div className="mt-4 border rounded p-4">

      <div className="font-bold mb-3">
        藥不然技能
      </div>

      <div className="text-sm mb-3">
        選擇一名玩家，使其本回合跳過行動。
      </div>

      <div className="grid grid-cols-2 gap-2">

        {roomData?.players
          ?.filter(
            (p: any) =>
              p.color !== player.color
          )
          .map((p: any) => (
            <button
              key={p.color}
              onClick={() =>
                setTargetColor(p.color)
              }
              className={`border rounded p-2 ${
                targetColor === p.color
                  ? "bg-red-500 text-white"
                  : ""
              }`}
            >
              {p.color}色
            </button>
          ))}

      </div>

      <button
        disabled={!targetColor}
        onClick={async () => {
          if (!roomId) return;

          await useDrugSkill(
  roomId,
  round,
  player.color,
  player.role,
  targetColor
);
        }}
        className="mt-4 w-full bg-red-600 text-white rounded p-3 disabled:bg-gray-400"
      >
        發動偷襲
      </button>

    </div>
  );
}