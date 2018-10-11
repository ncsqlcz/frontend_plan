<!--工艺路线-->
<template>
  <section class="p-3">
    <flow-chart></flow-chart>
  </section>
</template>

<script>
// import flowChart from '@/components/production/flowChart.vue'
import flowChart from '@/components/production/processFlowChart.vue'
export default {
  name: 'add-plan-step2',
  components: {
    flowChart
  },
  data () {
    return {
    }
  },
  mounted () {},
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>