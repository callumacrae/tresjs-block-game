<script setup lang="ts">
import { computed, toRefs } from "vue";
import * as THREE from "three";
import { useBlockData } from "../composables/blocks";

const { data } = toRefs(useBlockData());

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: "lightgreen" });

const mesh = computed(() => {
  const mesh = new THREE.InstancedMesh(geometry, material, data.value.length);

  const dummy = new THREE.Object3D();

  for (let i = 0; i < data.value.length; i++) {
    const block = data.value[i];
    dummy.position.set(...block.position);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  return mesh;
});
</script>

<template>
  <primitive :object="mesh" />
</template>
