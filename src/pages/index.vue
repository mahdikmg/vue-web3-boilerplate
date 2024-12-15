<template>
  <h1>Homepage</h1>
</template>

<script setup>
import { inject } from 'vue';
import usePreTransaction from '~/composables/usePreTransaction'
import useTransactionTracker from '~/composables/useTransactionTracker'

const preTransaction = usePreTransaction()
const tracker = useTransactionTracker()

const $loading = inject('loading')
const $notif = inject('notif')

// eslint-disable-next-line no-unused-vars
const exampleTransaction = () => {
  $loading.show()
  preTransaction("methodName", ["arguments"])
    .then((txnHash) => {
      tracker.checkTxn(txnHash)
      tracker.$on("success", (hash) => {
        if (hash === txnHash) {
          $notif.push("Successfully done", "success")
          $loading.hide()
        }
      })
      tracker.$on("failed", (hash) => {
        if (hash === txnHash) {
          $notif.push("Transaction reverted", "danger")
          $loading.hide()
        }
      })
    })
    .catch((err) => {
      $loading.hide()
      if (!err.message && !err.message.includes("User denied transaction signature")) {
        $notif.push("Connection error", "danger")
      }
    })
}
</script>

<style>
</style>