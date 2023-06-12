import alea from "alea";
import { defineStore } from "pinia";
import { createNoise2D } from "simplex-noise";
import * as THREE from 'three';
import { ref } from "vue";
import useIdleQueue from "@/composables/idle-queue";

interface Block {
  position: [number, number, number];
  type: "grass" | "stone";
}

const prng = alea("seed");
const noise2D = createNoise2D(prng);

function generateTerrainAbout(origin: [number, number]) {
  const data: Block[] = [];
  for (let x = -16; x < 16; x++) {
    for (let z = -16; z < 16; z++) {
      const offsetX = origin[0] + x;
      const offsetZ = origin[1] + z;
      const slowNoise = noise2D(offsetX / 100, offsetZ / 100) + 1 / 2;
      const fastNoise = noise2D(offsetX / 10, offsetZ / 10) + 1 / 2;
      const y = Math.floor(slowNoise * 10 + fastNoise * 2 + 2);

      data.push({
        position: [offsetX, y - 1, offsetZ],
        type: "stone",
      });
      data.push({
        position: [offsetX, y, offsetZ],
        type: "grass",
      });
    }
  }
  return data;
}

export const useBlockData = defineStore("blocks", () => {
  const data = ref<Block[]>(generateTerrainAbout([0, 0]));

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

  const idleQueue = useIdleQueue<[number, number]>((coords) => {
    data.value = data.value.concat(generateTerrainAbout(coords));
  });
  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      if (x === 0 && z === 0) continue;
      idleQueue.push([x * 32, z * 32]);
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
