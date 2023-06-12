<script lang="ts" setup>
import { watch, watchEffect } from "vue";
import { useTres } from "@tresjs/core";
import { computedWithControl, useMagicKeys } from "@vueuse/core";
import * as THREE from "three";

import { usePlayerPosition } from "../composables/position";
import PointerLockControls from "./PointerLockControls.vue";

const player = usePlayerPosition();

const { state } = useTres();

const cameraAngle = computedWithControl(
  () => state.camera,
  () => state.camera?.quaternion.clone()
);
const updateCameraAngle = cameraAngle.trigger;

const keys = useMagicKeys({ reactive: true });
watchEffect(() => {
  if (!cameraAngle.value) return;

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

  velocity.applyQuaternion(cameraAngle.value).setY(0);

  player.setWalkDirection(velocity);
});

watch(() => keys.Space, (space) => {
  player.setIsJumping(space);
});
</script>

<template>
  <PointerLockControls @change="updateCameraAngle" />
</template>
