<template>
  <v-toolbar>
    <v-toolbar-title>LTE Test</v-toolbar-title>
    <v-toolbar-items>
      <v-btn prepend-icon="mdi-cloud-upload-outline" color="warning">Enviar</v-btn>
      <v-btn prepend-icon="mdi-plus" color="success" @click="dialogAdd = true">Adicionar</v-btn>
    </v-toolbar-items>
  </v-toolbar>
  <v-container fluid>
    <v-row>
      <v-col xs="12" sm="6" lg="4" xl="3" v-for="n in 30" :key="n">
        <v-card border flat>
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
  </v-container>
  <v-dialog
    v-model="dialogAdd"
    transition="dialog-bottom-transition"
    max-width="800"
    :fullscreen="xs"
    persistent>
    <v-card
      append-icon="$close"
      elevation="16"
      title="Novo Teste">
      <template v-slot:append>
        <v-btn icon="$close" variant="text" @click="cancel"></v-btn>
      </template>

      <v-divider></v-divider>

      <v-stepper model-value="step" :alt-labels="xs" ref="stepper">
        <v-stepper-header>
          <v-stepper-item
            title="Coordenadas"
            :value="1"
            icon="mdi-map-marker"
          />

          <v-divider></v-divider>

          <v-stepper-item
            title="Velocidade"
            icon="mdi-speedometer"
            :value="2"
          />
        </v-stepper-header>

        <v-stepper-window>
          <v-stepper-window-item :value="1">
            <v-card-text class="px-2">
              <v-row dense>
                <v-col cols="12">
                  <v-text-field v-model="newTest.label" label="Nome da Área de Teste" hint="Ex.: Experimento iLPF do João" outlined></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="newTest.user" label="Seu Nome" hint="Ex.: Maria da Silva" outlined></v-text-field>
                </v-col>
                <v-col cols="6" sm="4">
                  <v-text-field v-model="newTest.latitude" label="Latitude" outlined disabled></v-text-field>
                </v-col>
                <v-col cols="6" sm="4">
                  <v-text-field v-model="newTest.longitude" label="Longitude" outlined disabled></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-btn size="x-large" prepend-icon="mdi-map-marker" @click="getCoordinates" color="info" :loading="loading" block>Obter GPS</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="error"
                text
                @click="cancel"
                size="large">
                Cancelar
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn
                size="large"
                variant="tonal"
                append-icon="mdi-chevron-right"
                color="success"
                @click="() => $refs.stepper.next()"
                :disabled="newTest.label === '' || newTest.user === '' || newTest.latitude === 0 || newTest.longitude === 0">
                Próximo
              </v-btn>
            </v-card-actions>
          </v-stepper-window-item>

          <v-stepper-window-item :value="2">
            <v-card-text class="px-2">
              <v-row dense>
                <v-col cols="6">
                  <v-text-field v-model="newTest.download" label="Download" suffix="Mbps" outlined disabled></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="newTest.upload" label="Upload" suffix="Mbps" outlined disabled></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="newTest.latencyDownload" label="Latência ⬇" suffix="ms" outlined disabled></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="newTest.latencyUpload" label="Latência ⬆" suffix="ms" outlined disabled></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newTest.aimGaming" outlined disabled prepend-inner-icon="mdi-controller" :color="aimColors[newTest.aimGaming]"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newTest.aimRTC" outlined disabled prepend-inner-icon="mdi-message-text"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newTest.aimStreaming" outlined disabled prepend-inner-icon="mdi-movie-open"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-btn size="x-large" prepend-icon="mdi-clock-fast" @click="runTest" color="info" :loading="loading" block>Executar Teste</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
            <v-alert v-model="alert" type="warning" class="mx-2">Parece que você está OFFLINE! Você pode verificar sua conexão e tentar EXECUTAR O TESTE novamente (botão acima) ou REGISTRAR este resultado (botão abaixo).</v-alert>
            <v-card-actions>
              <v-btn
                color="error"
                text
                @click="cancel"
                size="large">
                Cancelar
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn
                size="large"
                variant="tonal"
                append-icon="mdi-check"
                color="success"
                @click="() => $refs.stepper.next()"
                :disabled="newTest.connection === null">
                Registrar
              </v-btn>
            </v-card-actions>
          </v-stepper-window-item>
        </v-stepper-window>
      </v-stepper>

    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import helpers from '@/helpers'
import geo from 'vue3-geolocation'
import speed from '@cloudflare/speedtest'
import { round } from 'lodash'

const dialogAdd = ref(false)
const step = ref(1)
const loading = ref(false)
const alert = ref(false)

const userName = localStorage.getItem('userName') ?? ''

const newTest = ref({
  label: '',
  user: userName,
  date: null,
  latitude: 0,
  longitude: 0,
  connection: null,
  download: 0,
  upload: 0,
  latencyDownload: 0,
  latencyUpload: 0,
  aimGaming: 0,
  aimRTC: 0,
  aimStreaming: 0
})

const { xs } = useDisplay()

const mapUrl = helpers.getMapUrl(-47.716863, -15.598093, 12)

console.log('URL: '+ mapUrl)

const zoom = 2

const getCoordinates = () => {

  loading.value = true

  geo.getLocation({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  }).then(coordinates => {
    console.log(coordinates)

    newTest.value.latitude = coordinates.lat
    newTest.value.longitude = coordinates.lng

    loading.value = false
  });
}

const cancel = () => {
  dialogAdd.value = false
  clearNewTest()
}

const clearNewTest = () => {
  newTest.value = {
    label: '',
    user: userName,
    date: null,
    latitude: 0,
    longitude: 0,
    connection: null,
    download: 0,
    upload: 0,
    latencyDownload: 0,
    latencyUpload: 0,
    aimGaming: 0,
    aimRTC: 0,
    aimStreaming: 0
  }
}

const aimColors = ref({
  bad: 'red-darken-1',
  poor: 'orange-darken-2',
  average: 'light-blue-darken-2',
  good: 'teal-darken-1',
  great: 'green-darken-2'
})

const runTest = () => {
  if (!window.navigator.onLine) {
    newTest.value.connection = false

    alert.value = true

    return
  }

  loading.value = true

  new speed().onFinish = results => {
    newTest.value.connection = true

    const summary = results.getSummary()
    const scores = results.getScores()

    newTest.value.download = parseFloat((summary.download / 1000000).toFixed(2))
    newTest.value.upload = parseFloat((summary.upload / 1000000).toFixed(2))

    newTest.value.latencyDownload = round(summary.downLoadedLatency)
    newTest.value.latencyUpload = round(summary.upLoadedLatency)

    newTest.value.aimGaming = scores.gaming.classificationName
    newTest.value.aimRTC = scores.rtc.classificationName
    newTest.value.aimStreaming = scores.streaming.classificationName

    loading.value = false
  }
}

const register = () => {
  // https://dexie.org/docs/Tutorial/Vue
  // localStorage.setItem('darkMode', JSON.stringify(isDarkMode.value))
}

// Bad, Poor, Average, Good, Great

// import { db } from '@/db'

// const tests = ref([])
</script>
