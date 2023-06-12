import alea from "alea";
import { defineStore } from "pinia";
import { createNoise2D } from "simplex-noise";
import { ref } from "vue";

interface Block {
  position: [number, number, number];
  type: "grass" | "stone";
}

const prng = alea("seed");
const noise2D = createNoise2D(prng);

// TODO: this is a temporary function
function generateInitialTerrain() {
  const data: Block[] = [];
  for (let x = -30; x < 30; x++) {
    for (let z = -30; z < 30; z++) {
      const slowNoise = noise2D(x / 100, z / 100) + 1 / 2;
      const fastNoise = noise2D(x / 10, z / 10) + 1 / 2;
      const y = Math.floor(slowNoise * 10 + fastNoise * 2 + 2);

      data.push({
        position: [x, y - 1, z],
        type: "stone",
      });
      data.push({
        position: [x, y, z],
        type: "grass",
      });
    }
  }
  return data;
}

export const useBlockData = defineStore("blocks", () => {
  const data = ref<Block[]>(generateInitialTerrain());

  return { data };
});
