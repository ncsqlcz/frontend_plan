<!--框架模板页-->
<template>
  <div id="mesLayout">
    <el-container>
      <el-header class="Header">
        <div class="systemName">
          <img :src="require('@/assets/img/imesLogo.png')"
             alt="imes"
             class="imesLogo">
          <span v-for="(item ,index) in $route.name.split('/')"
                :key="index"
                :class="$route.name.split('/').length-1==index?'tagName':''"
                v-html="$route.name.split('/').length-1==index?item+'':item+'&nbsp;/&nbsp;'">
          </span>
        </div>
      </el-header>
      <el-container>
        <el-aside class="Menu" width="150px">
          <el-menu :default-active="$route.path.params"
                   class="el-menu--custom"
                   unique-opened
                   collapse
                   router>
            <el-submenu v-for="(menuitem, menuindex) in menuList"
                        :key="menuindex"
                        :index="menuitem.name"
                        :title="menuitem.title"
                        popper-append-to-body>
              <template slot="title">
                <i :class="menuitem.icon"></i>
                <span v-text="menuitem.text"></span>
              </template>
              <el-submenu v-if="groupitem.leaf"
                          v-for="(groupitem, groupindex) in menuitem.childGroup"
                          :key="groupindex"
                          :index="'/'+menuitem.name+'/'+groupitem.name"
                          popper-append-to-body>
                <span slot="title">{{groupitem.text}}</span>
                <!-- 二级菜单有无子节点 -->
                <el-menu-item v-for="(item, index) in groupitem.childGroup"
                              :key="index"
                              :index="'/'+menuitem.name+'/'+groupitem.name+'/'+item.name">{{item.text}}</el-menu-item>
              </el-submenu>
              <!-- 二级菜单无子节点 -->
              <el-menu-item v-if="!groupitem.leaf"
                            v-for="(groupitem, groupindex) in menuitem.childGroup"
                            :key="groupindex"
                            :index="'/'+menuitem.name+'/'+groupitem.name">{{groupitem.text}}</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="Content">
          <!-- <keep-alive> -->
          <router-view :name="$route.params.page"></router-view>
          <!-- </keep-alive> -->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Menu from "@/assets/json/menu.js";
export default {
  name: "mesLayout",
  data() {
    return {
      //菜单
      menuList: Menu
    };
  }
};
</script>
<style lang="scss">
@import "@/styles/layout.scss";
@import "@/styles/icon.scss";
</style>



