/*
 * @Author: liucz 
 * @Date: 2018-08-16 17:21:21 
 * @Last Modified by: liucz
 * @Last Modified time: 2018-08-16 18:49:04
 */
<template>
  <section>
    <!-- 固定值 -->
    <span v-if="type === 'constantValue'">
      <el-input-number v-model="constantValue"
                      :precision="2"
                      :step="0.1"
                      :size="size"
                      @change="handleValueChange"
                      label="固定值"></el-input-number>
    </span>

    <!-- 范围值 -->
    <span v-if="type === 'rangeValue'">
      <el-input-number v-model="rangeValue1" 
                      :precision="2"
                      :step="0.1"
                      :size="size"
                      @change="handleValueChange"
                      label="范围值1"></el-input-number>
      <span> - </span>
      <el-input-number v-model="rangeValue2"
                      :precision="2"
                      :step="0.1"
                      :size="size"
                      @change="handleValueChange"
                      label="范围值2"></el-input-number>
      <div class="flex-wrap">
        <p class="w-50">
          <el-checkbox v-model="minBoundary" @change="handleValueChange">能否达到最小值</el-checkbox>
        </p>
        <p class="w-50 text-right">
          <el-checkbox v-model="maxBoundary" @change="handleValueChange">能否达到最大值</el-checkbox>
        </p>
      </div>
    </span>

    <!-- 浮动值 -->
    <span v-if="type === 'floatValue'">
      <el-input-number v-model="floatValue1"
                      :precision="2"
                      :step="0.1"
                      :size="size"
                      @change="handleValueChange"
                      label="浮动值1"></el-input-number>
      <span> ± </span>
      <el-input-number v-model="floatValue2"
                      :precision="2"
                      :step="0.01"
                      :size="size"
                      @change="handleValueChange"
                      label="浮动值2"></el-input-number>
    </span>
  </section>
</template>

<script>
export default {
  name: "standard-input",
  components: {},
  props: {
    type: {
      type: String,
      default: 'constantValue' // 三种类型：固定值： constantValue 范围值： rangeValue 浮动值： floatValue
    },
    size: {
      type: String,
      default: '' // 和elementui 保持一致
    },
    // 最小值的边界值，> 表示不能达到最小值，>= 表示能达到最小值
    minBoundarySymbol: {
      type: String,
      default: '>='
    },
    // 最大值的边界值，< 表示不能达到最大值，<= 表示能达到最大值
    maxBoundarySymbol: {
      type: String,
      default: '<='
    },
    value: [String, Number]
  },
  data() {
    return {
      constantValue: '',
      rangeValue1: '',
      rangeValue2: '',
      floatValue1: '',
      floatValue2: '',
      outputValue: '',
      minBoundary: false,
      maxBoundary: false
    }
  },
  computed: {
  },
  mounted() {
    this.setValue(this.value)
  },
  methods: {
    handleValueChange () {
      this.$emit('change', this.getOutputValue())
    },
    // 获取输出的值
    getOutputValue () {
      switch (this.type) {
        case 'constantValue':
          return this.constantValue
        break
        case 'rangeValue':
          let minBoundarySymbol = '>='
          let maxBoundarySymbol = '<='
          // 是否能达到边界值
          if (this.minBoundary) {
            minBoundarySymbol = '>='
          } else {
            minBoundarySymbol = '>'
          }
          if (this.maxBoundary) {
            maxBoundarySymbol = '<='
          } else {
            maxBoundarySymbol = '<'
          }
          return {
            minBoundarySymbol: minBoundarySymbol,
            maxBoundarySymbol: maxBoundarySymbol,
            value: [this.rangeValue1 || '', this.rangeValue2 || ''].join(',')
          }
        break
        case 'floatValue':
          return [this.floatValue1 || '', this.floatValue2 || ''].join(',')
        break
      }
    },
    // 设置对应的值
    setValue (val) {
      switch (this.type) {
        case 'constantValue':
          this.constantValue = parseFloat(val)
        break
        case 'rangeValue':
          if (val.length > 0) {
            let arr = val.split(',')
            this.rangeValue1 = parseFloat(arr[0])
            this.rangeValue2 = parseFloat(arr[1])
          } else {
            this.rangeValue1 = ''
            this.rangeValue2 = ''
          }
        break
        case 'floatValue':
          if (val.length > 0) {
            let arr = val.split(',')
            this.floatValue1 = parseFloat(arr[0])
            this.floatValue2 = parseFloat(arr[1])
          } else {
            this.floatValue1 = ''
            this.floatValue2 = ''
          }
        break
      }
    },
    // 数据校验
    checkOutputValue () {

    }
  },
  watch: {
    value (val) {
      this.setValue(val + '')
    },
    minBoundarySymbol (val) {
      this.minBoundary = val === '>='
    },
    maxBoundarySymbol (val) {
      this.maxBoundary = val === '<='
    }
  }
};
</script>

<style lang="scss" scoped>
section {
  display: inline-block;
}
</style>
