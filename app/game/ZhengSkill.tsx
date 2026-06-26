"use client";

import { useState } from "react";
import { useZhengSkill } from "../../lib/skill/zheng";

export function ZhengSkill({
  roomId,
  roomData,
  player,
}: {
  roomId: string | null;
  roomData: any;
  player: any;
}) {
  const [selectedAnimal, setSelectedAnimal] =
    useState("");

  if (
    roomData?.gameState?.phase !== "action" ||
    player?.role !== "鄭國渠"
  ) {
    return null;
  }

  const round = roomData.gameState.round;

  const used =
    !!roomData?.gameState?.roundSkills?.[
      `round${round}`
    ]?.zheng;

  if (used) {
    return (
      <div className="mt-4 border rounded p-4 bg-gray-100">
        鄭國渠技能已使用
      </div>
    );
  }

  return (
    <div className="mt-4 border rounded p-4 bg-gray-100">
      <div className="font-bold mb-2">
        鄭國渠技能
      </div>

      <div className="text-sm mb-3">
        指定一件寶物，使其無法鑑定。
      </div>

      <div className="flex flex-wrap gap-2">
        {roomData?.gameState?.currentAnimals?.map(
          (animal: string) => (
            <button
              key={animal}
              onClick={() =>
                setSelectedAnimal(animal)
              }
              className={`border rounded px-3 py-2 ${
                selectedAnimal === animal
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {animal}
            </button>
          )
        )}
      </div>

      <button
        disabled={!selectedAnimal}
        onClick={async () => {
          if (
            !roomId ||
            !selectedAnimal
          ) {
            return;
          }

          await useZhengSkill(
            roomId,
            round,
            selectedAnimal
          );
        }}
        className="mt-4 w-full bg-blue-600 text-white rounded p-3 disabled:bg-gray-400"
      >
        發動技能
      </button>
    </div>
  );
}