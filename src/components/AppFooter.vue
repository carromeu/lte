<template>
  <v-footer height="40" app>
    <v-img
      position="left"
      src="@/assets/embrapa.io.png"
      height="18"
      referrerpolicy="no-referrer"
      tile
      class="d-inline-block"
      @click="go('https://embrapa.io')"
    />

    <div
      class="text-caption text-disabled"
      style="position: absolute; right: 16px;"
    >
      &copy; 2024 &bull;
      <a
        class="text-decoration-none on-surface"
        href="https://embrapa.br"
        rel="noopener noreferrer"
        target="_blank">
        Embrapa
      </a>
    </div>
  </v-footer>
</template>

<script setup>
const go = (url) => {
  window.open(url, '_blank')
}
</script>
