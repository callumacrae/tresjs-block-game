<script setup lang="ts">
import { useBlockData } from "../composables/blocks";

const { data } = useBlockData();
</script>

<template>
  <TresMesh
    v-for="block in data"
    :key="block.position.join('-')"
    :position="block.position"
  >
    <TresBoxGeometry :args="[1, 1, 1]" />
    <TresMeshStandardMaterial color="lightgreen" />
  </TresMesh>
</template>
