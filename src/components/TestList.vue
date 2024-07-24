<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto">
      <v-row>
        <v-col cols="6">
          <v-card class="mx-auto" max-width="500" border flat>
            <v-list-item class="pl-2 pr-4" height="88">
              <template v-slot:title>
                <v-card-title class="pb-0">Experimento iLPF do João</v-card-title>
                <v-card-subtitle>13/8/24 8h32</v-card-subtitle>
              </template>

              <template v-slot:append>
                <v-icon size="32" icon="mdi-cloud-check-variant" color="success"></v-icon>
              </template>
            </v-list-item>

            <v-divider></v-divider>

            <v-card-actions class="text-medium-emphasis pb-0">
              <v-list-item class="w-50">
                <template v-slot:prepend><v-icon size="32" icon="mdi-cloud-download" color="info" /></template>
                <v-list-item-title class="text-h5 font-weight-black">25 Mbps</v-list-item-title>
              </v-list-item>
              <v-list-item class="w-50" color="error">
                <template v-slot:prepend><v-icon size="32" icon="mdi-cloud-upload" color="warning" /></template>
                <v-list-item-title class="text-h5 font-weight-black">2 Mbps</v-list-item-title>
              </v-list-item>
            </v-card-actions>

            <v-card-actions class="pt-0">
              <v-list-item class="w-50">
                <v-progress-linear
                  bg-color="surface-variant"
                  class="mb-1"
                  color="info"
                  height="10"
                  model-value="37"
                  rounded="pill"
                />
              </v-list-item>
              <v-list-item class="w-50">
                <v-progress-linear
                  bg-color="surface-variant"
                  class="mb-1"
                  color="warning"
                  height="10"
                  model-value="67"
                  rounded="pill"
                />
              </v-list-item>
            </v-card-actions>

            <v-img :src="mapUrl" />
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import "leaflet/dist/leaflet.css"
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet"
import helpers from '@/helpers'

const mapUrl = helpers.getMapUrl(-47.716863, -15.598093, 12)

console.log('URLLL: '+ mapUrl)

// const components = {
//     LMap,
//     LTileLayer,
// }

const zoom = 2
// import { db } from '@/db'

// const tests = ref([])
</script>
