<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import TerrainView from "@/modules/terrain/components/TerrainView.vue";
import { usePlayerPosition } from "@/modules/player/composables/position";
import PlayerControls from "@/modules/player/components/PlayerControls.vue";

const player = usePlayerPosition();
</script>

<template>
  <TresCanvas window-size>
    <TresPerspectiveCamera :position="player.cameraPosition" />
    <PlayerControls />
    <TerrainView />
    <TresDirectionalLight :intensity="1.5" :position="[3, 4, 3]" />
    <TresAmbientLight :intensity="0.5" />
  </TresCanvas>
</template>
