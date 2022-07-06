<template>
  <el-menu
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :default-active="this.$store.state.menus.editableTabsValue"
  >
    <router-link to="/index">
      <el-menu-item index="Index">
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </template>
      </el-menu-item>
    </router-link>

    <div v-for="menu in menuList" v-bind:key="menu.name">
      <router-link :to="menu.path" v-if="menu.path != ''">
        <el-menu-item :index="menu.name">
          <template slot="title">
            <i :class="menu.icon"></i>
            <span slot="title">{{ menu.title }}</span>
          </template>
        </el-menu-item>
      </router-link>

      <el-submenu :index="menu.name" v-else>
        <template slot="title">
          <i :class="menu.icon"></i>
          <span>{{ menu.title }}</span>
        </template>
        <router-link :to="item.path" v-for="item in menu.children" v-bind:key="item.name">
          <el-menu-item :index="item.name">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
          </el-menu-item>
        </router-link>
      </el-submenu>
    </div>
  </el-menu>
</template>

<script>
export default {
  name: "SideMenu",
  data() {
    return {}
  },
  computed: {
    menuList: {
      get() {
        // console.log(this.$store.state.menus.menuList)
        return this.$store.state.menus.menuList
      }
    }
  },
  methods: {}
}
</script>

<style scoped>
.el-menu-vertical-demo {
  height: 100%;
}

a {
  text-decoration: none;
}
</style>