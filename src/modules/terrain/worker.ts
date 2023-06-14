import alea from "alea";
import { createNoise2D } from "simplex-noise";
import type { Block } from './composables/blocks';

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

onmessage = (e: MessageEvent) => {
  postMessage(generateTerrainAbout(e.data));
};
