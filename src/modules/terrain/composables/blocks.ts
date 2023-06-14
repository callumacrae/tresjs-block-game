import { defineStore } from "pinia";
import * as THREE from "three";
import { ref } from "vue";

export interface Block {
  position: [number, number, number];
  type: "grass" | "stone";
}


const terrainWorker = new Worker(new URL("../worker.ts", import.meta.url), {
  type: "module",
});

function generateTerrainAbout(origin: [number, number]) {
  terrainWorker.postMessage(Array.from(origin));
}

export const useBlockData = defineStore("blocks", () => {
  const data = ref<Block[]>([]);
  terrainWorker.addEventListener("message", (e) => {
    data.value.push(...e.data);
  });
  generateTerrainAbout([0, 0]);

  // TODO: find closest block below, not any block below
  function getBlockBelow(position: [number, number, number]) {
    return data.value.find(
      (block) =>
        block.position[0] === Math.round(position[0]) &&
        block.position[1] < Math.round(position[1]) &&
        block.position[2] === Math.round(position[2])
    );
  }

  function getHighestBlockBelow(positions: [number, number, number][]) {
    let highestBlock = getBlockBelow(positions[0]);
    for (const position of positions.slice(1)) {
      const maybeHighestBlock = getBlockBelow(position);
      if (
        !highestBlock ||
        (maybeHighestBlock &&
          maybeHighestBlock.position[1] > highestBlock.position[1])
      ) {
        highestBlock = maybeHighestBlock;
      }
    }
    return highestBlock;
  }

  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      if (x === 0 && z === 0) continue;
      generateTerrainAbout([x * 32, z * 32]);
    }
  }

  // Called by the play position store, used to load more terrain as needed
  function onPlayerPositionUpdate(
    position: [number, number, number],
    cameraAngle: THREE.Quaternion
  ) {
    // TODO: load more terrain
  }

  return { data, getBlockBelow, getHighestBlockBelow, onPlayerPositionUpdate };
});
