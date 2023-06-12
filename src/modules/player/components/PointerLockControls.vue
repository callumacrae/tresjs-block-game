<script lang="ts" setup>
/**
 * This is a modified version of PointerLockControls from @tresjs/cientos
 *
 * The main difference is that it emits the change, lock, and unlock events, but
 * it also avoids the global TresJS extension and has some stuff removed that
 * wasn't needed here.
 */
import { ref, watch } from "vue";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { useTres } from "@tresjs/core";
import { useEventListener } from "@vueuse/core";

const emit = defineEmits<{
  change: [];
  lock: [];
  unlock: [];
}>();

const { state } = useTres();

const controls = ref<PointerLockControls | null>(null);
watch(
  () => [state.camera, state.renderer],
  () => {
    if (!state.camera || !state.renderer) return null;
    if (controls.value) {
      console.warn("PointerLockControls already exists??");
      controls.value.dispose();
      controls.value = null;
    }

    const c = new PointerLockControls(state.camera, state.renderer.domElement);
    c.addEventListener("change", () => emit("change"));
    c.addEventListener("lock", () => emit("lock"));
    c.addEventListener("unlock", () => emit("unlock"));
    controls.value = c;
  },
  { immediate: true }
);

useEventListener(
  () => state.renderer?.domElement,
  "click",
  () => controls.value?.lock()
);
</script>

<template>
  <primitive v-if="controls" :object="controls" />
</template>
