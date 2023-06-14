import { computed, ref } from "vue";
import { defineStore } from "pinia";
import * as THREE from "three";
import { useBlockData } from "@/modules/terrain/composables/blocks";

export const usePlayerPosition = defineStore("playerPosition", () => {
  const blockStore = useBlockData();

  // const spawnAbove = blockStore.getBlockBelow([0, 10000, 0]);
  // if (!spawnAbove) throw new Error("couldn't find spawning block");
  const initialPosition = [0, 10, 0] as [
    number,
    number,
    number
  ];
  initialPosition[1] += 1;

  const position = ref(initialPosition);
  const velocity = ref(new THREE.Vector3());

  // TODO: add some kind of tweening here
  const walkDirection = ref(new THREE.Vector3());
  const walkVelocity = ref(new THREE.Vector3());
  function setWalkDirection(direction: THREE.Vector3) {
    walkDirection.value = direction;
  }

  const isJumping = ref(false);
  function setIsJumping(newIsJumping: boolean) {
    isJumping.value = newIsJumping;
  }

  function tick(delta: number) {
    walkVelocity.value = walkDirection.value.clone().multiplyScalar(4.3);

    // TODO: use getHighestBlockBelow to check full hitbox
    const blockBelow = blockStore.getBlockBelow(position.value);
    const distToBelow = blockBelow
      ? position.value[1] - blockBelow.position[1]
      : Infinity;

    if (distToBelow > 1) {
      // I got this off reddit - I'm not sure it's right
      // https://www.reddit.com/r/GameTheorists/comments/dk3f2f/i_calculated_minecrafts_true_gravity/
      velocity.value.y -= 31.36 * delta;
    } else if (isJumping.value) {
      // Designed to appromixate a jump height of 1.25 blocks
      velocity.value.y = 8.2;
    }

    velocity.value.x = walkVelocity.value.x;
    velocity.value.z = walkVelocity.value.z;

    position.value[0] += velocity.value.x * delta;
    position.value[1] += velocity.value.y * delta;
    position.value[2] += velocity.value.z * delta;

    if (blockBelow && position.value[1] < blockBelow.position[1] + 1) {
      position.value[1] = blockBelow.position[1] + 1;
      velocity.value.y = 0;
    }

    blockStore.onPlayerPositionUpdate(position.value, cameraAngle.value);
  }

  const cameraPosition = computed(() => [
    position.value[0],
    position.value[1] + 1.8 + 0.5,
    position.value[2],
  ]);

  // Writing to this won't change the camera angle!
  const cameraAngle = ref(new THREE.Quaternion());

  return { position, setWalkDirection, setIsJumping, cameraPosition, cameraAngle, tick };
});
