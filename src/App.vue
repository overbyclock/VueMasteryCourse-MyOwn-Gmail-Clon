<template>
  <h1>VMail Inbox</h1>
  <Suspense>
    <template #default><EmailTable /> </template>
    <template #fallback>Loading... </template>
  </Suspense>
</template>

<script>
import EmailTable from './components/EmailTable.vue'

export default {
  name: 'App',
  components: { EmailTable },
  setup() {
    return {}
  }
}
</script>

<style scoped></style>
