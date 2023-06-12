<script lang="ts" setup>
import { toRefs } from "vue";
import { useTres, useRenderLoop } from "@tresjs/core";
import { useMagicKeys } from "@vueuse/core";
import * as THREE from "three";

import { usePlayerPosition } from "../composables/position";
import PointerLockControls from "./PointerLockControls.vue";

const { position } = toRefs(usePlayerPosition());

const { state } = useTres();

const keys = useMagicKeys({ reactive: true });
const { onLoop } = useRenderLoop();
onLoop(({ delta }) => {
  const velocity = new THREE.Vector3();

  if (keys.W) {
    velocity.z -= 1;
  }
  if (keys.S) {
    velocity.z += 1;
  }
  if (keys.A) {
    velocity.x -= 1;
  }
  if (keys.D) {
    velocity.x += 1;
  }

  velocity
    .applyQuaternion(state.camera.quaternion)
    .setY(0)
    .setLength(10 * delta);

  position.value[0] += velocity.x;
  position.value[1] += velocity.y;
  position.value[2] += velocity.z;
});
</script>

<template>
  <PointerLockControls />
</template>
