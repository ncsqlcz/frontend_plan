<!--创建路径-->
<template>
    <div class="s ">
        <div class="jiba ">
            <span></span>
        </div>
        <div class="ad "></div>
    </div>
</template>
<style lang="scss" scoped>
@import "@/styles/mixin.scss";
.s {
  display: inline-block;
  .jiba {
    display: inline-block;
    width: 200px;
    height: 5px;
    border-bottom: 1px solid #000;
  }
  .ad {
    display: inline-block;
    @include triangle(21px, 5px, #000, right);
  }
}
</style>
