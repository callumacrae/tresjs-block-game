import { computed, ref } from "vue";
import { defineStore } from "pinia";
import * as THREE from "three";
import { useBlockData } from "@/modules/terrain/composables/blocks";

export const usePlayerPosition = defineStore("playerPosition", () => {
  const blockStore = useBlockData();

  let highestY = 0;
  for (const block of blockStore.data) {
    if (
      block.position[0] === 0 &&
      block.position[2] === 0 &&
      block.position[1] > highestY
    ) {
      highestY = block.position[1];
    }
  }

  const initialPosition = [0, highestY + 0.5, 0];

  const position = ref(initialPosition);
  const velocity = ref(new THREE.Vector3());

  function setXZVelocity(x: number, z: number) {
    velocity.value.x = x;
    velocity.value.z = z;
  }

  const cameraPosition = computed(() => [
    position.value[0],
    position.value[1] + 1.8,
    position.value[2],
  ]);

  function tick(delta: number) {
    position.value[0] += velocity.value.x * delta;
    position.value[1] += velocity.value.y * delta;
    position.value[2] += velocity.value.z * delta;
  }

  return { position, setXZVelocity, cameraPosition, tick };
});
