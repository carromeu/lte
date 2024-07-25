<template>
  <v-toolbar>
    <v-toolbar-title>LTE Test</v-toolbar-title>
    <v-toolbar-items>
      <v-btn prepend-icon="mdi-cloud-upload-outline" color="warning">Enviar</v-btn>
      <v-btn prepend-icon="mdi-plus" color="success" @click="dialogAdd = true">Adicionar</v-btn>
    </v-toolbar-items>
  </v-toolbar>
  <v-container v-if="tests.length === 0">
    <v-alert
      color="info"
      border="start"
      variant="tonal"
      class="mx-3 my-6">
      Não há nenhum teste aguardando para ser enviado! Sempre que clicar em "Enviar",
      os testes registrados serão enviados para o servidor e apagados do dispositivo.
      Para iniciar um novo teste, clique em "Adicionar".
    </v-alert>
  </v-container>
  <v-container v-else fluid>
    <v-row>
      <v-col xs="12" sm="6" lg="4" xl="3" v-for="t in tests" :key="t.id">
        <v-card border flat>
          <v-list-item class="pl-2 pr-4" height="88">
            <template v-slot:title>
              <v-card-title class="pb-0">{{ t.label }}</v-card-title>
              <v-card-subtitle>{{ formatDate(t.date) }}</v-card-subtitle>
            </template>

            <template v-slot:append>
              <v-icon v-if="t.connection" size="32" icon="mdi-cloud-check-variant" color="success"></v-icon>
              <v-icon v-else size="32" icon="mdi-cloud-off" color="error"></v-icon>
            </template>
          </v-list-item>

          <v-divider></v-divider>

          <v-card-actions class="text-medium-emphasis pb-0">
            <v-list-item class="w-50">
              <template v-slot:prepend><v-icon size="32" icon="mdi-cloud-download" color="info" /></template>
              <v-list-item-title class="text-h5 font-weight-black">{{ t.download }} Mbps</v-list-item-title>
              <v-list-item-subtitle>{{ t.latencyDownload }} ms</v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="w-50" color="error">
              <template v-slot:prepend><v-icon size="32" icon="mdi-cloud-upload" color="warning" /></template>
              <v-list-item-title class="text-h5 font-weight-black">{{ t.upload }} Mbps</v-list-item-title>
              <v-list-item-subtitle>{{ t.latencyUpload }} ms</v-list-item-subtitle>
            </v-list-item>
          </v-card-actions>

          <v-card-actions class="pt-0">
            <v-list-item class="w-50">
              <v-progress-linear
                bg-color="surface-variant"
                class="mb-1"
                color="info"
                height="10"
                :model-value="t.download"
                rounded="pill"
              />
            </v-list-item>
            <v-list-item class="w-50">
              <v-progress-linear
                bg-color="surface-variant"
                class="mb-1"
                color="warning"
                height="10"
                :model-value="t.upload"
                rounded="pill"
              />
            </v-list-item>
          </v-card-actions>

          <v-img :src="t.tile" />
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
                  <v-text-field v-model="newTest.aimGaming" outlined disabled prepend-inner-icon="mdi-controller" :class="'text-' + aimColors[newTest.aimGaming]"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newTest.aimRTC" outlined disabled prepend-inner-icon="mdi-message-text" :class="'text-' + aimColors[newTest.aimRTC]"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newTest.aimStreaming" outlined disabled prepend-inner-icon="mdi-movie-open" :class="'text-' + aimColors[newTest.aimStreaming]"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-btn size="x-large" prepend-icon="mdi-clock-fast" @click="runTest" color="info" :loading="loading" block>
                    Executar Teste
                    <template v-slot:loader>
                      <v-progress-circular indeterminate></v-progress-circular>
                      <span class="ml-3 text-body-2">Aguarde! Pode demorar vários minutos...</span>
                    </template>
                  </v-btn>
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
                @click="save()"
                :disabled="newTest.connection === null"
                :loading="saving">
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
import { db } from '@/db'
import { ref, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import helpers from '@/helpers'
import geo from 'vue3-geolocation'
import speed from '@cloudflare/speedtest'
import { round } from 'lodash'
import axios from 'axios'
import { Buffer } from 'buffer'
import moment from 'moment'

const tests = ref([])
const dialogAdd = ref(false)
const loading = ref(false)
const saving = ref(false)
const alert = ref(false)

const { xs } = useDisplay()

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
  aimGaming: '-',
  aimRTC: '-',
  aimStreaming: '-',
  tile: ''
})

const mapUrl = helpers.getMapUrl(-47.716863, -15.598093, 12)

const getCoordinates = () => {

  loading.value = true

  geo.getLocation({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  }).then(coordinates => {
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
    aimGaming: '-',
    aimRTC: '-',
    aimStreaming: '-',
    tile: ''
  }
}

const aimColors = ref({
  bad: 'red-lighten-4',
  poor: 'orange-lighten-4',
  average: 'light-blue-lighten-4',
  good: 'teal-lighten-4',
  great: 'green-lighten-4'
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

const save = () => {
  saving.value = true

  localStorage.setItem('userName', newTest.value.user)

  const tile = helpers.getMapUrl(newTest.value.longitude, newTest.value.latitude, 12)

  axios.get(tile, { responseType: 'arraybuffer' }).then(response => {
    newTest.value.tile = 'data:image/png;base64,' + Buffer.from(response.data, 'binary').toString('base64')

    newTest.value.date = new Date()

    const clone = JSON.parse(JSON.stringify(newTest.value))

    // https://dexie.org/docs/Tutorial/Vue

    db.tests.add(clone).then(() => {
      dialogAdd.value = false

      refresh()

      clearNewTest()
    }).catch(error => {
      console.error(error)
    }).finally(() => {
      saving.value = false
    })
  }).catch(error => {
    console.error(error)
  })
}

const refresh = () => {
  db.tests.toArray().then(t => {
    tests.value = t
  }).catch(error => {
    console.error(error)
  })
}

onMounted(() => {
  refresh()
})

const formatDate = date => moment(date).format('D/M/YY H:mm')
</script>
