<template>
  <dashboard :JSIMg="JSIMg" />
</template>

<script>
import Vue from 'vue'
import JSIMg from '@JSIMg/core'
import { Dashboard } from '@JSIMg/vue'

export default {
  name: 'App',
  components: {
    Dashboard,
  },
  computed: {
    JSIMg: () => new JSIMg(),
  },
}
</script>

<style src="@JSIMg/core/dist/style.css"></style>
<style src="@JSIMg/dashboard/dist/style.css"></style>
