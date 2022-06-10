<template>
  <el-container>
    <el-aside width="200px">
      <side-menu></side-menu>
    </el-aside>

    <el-container>
      <el-header>
        <strong>后台管理系统</strong>
        <div class="header-avatar">
          <el-avatar size="medium"
                     src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ userInfo.username }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="{name:'UserCenter'}"></router-link>
              </el-dropdown-item>
              <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideMenu from "./sys/SideMenu";

export default {
  name: "HomeView",
  components: {
    SideMenu
  },
  data() {
    return {
      userInfo: {
        id: "",
        username: "",
        avatar: ""
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      this.$axios.get("/sys/userInfo").then(res => {
        this.userInfo = res.data.data
      })
    }
  }
}
</script>

<style scoped>

.el-container {
  padding: 0;
  margin: 0;
  height: 100%;
}

.el-dropdown-link {
  cursor: pointer;
}

.header-avatar {
  float: right;
  width: 120px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.el-header {
  background-color: #17B3A3;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  line-height: 200px;
  text-align: left;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.el-menu-vertical-demo {
  height: 100%;
}
</style>