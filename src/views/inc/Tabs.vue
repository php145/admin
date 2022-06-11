<template>
  <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab" @tab-click="clickTab">
    <!--    <el-tab-pane label="首页" name="Index" key="Index"></el-tab-pane>-->
    <el-tab-pane
        v-for="(item) in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        :closable="item.closable"
    >
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "TabsView",
  data() {
    return {}
  },
  computed: {
    editableTabsValue: {
      get() {
        // console.log('editableTabsValue->get' + this.$store.state.menus.editableTabsValue)
        return this.$store.state.menus.editableTabsValue
      },
      set(val) {
        this.$store.state.menus.editableTabsValue = val
      }
    }, editableTabs: {
      get() {
        return this.$store.state.menus.editableTabs
      }, set(val) {
        this.$store.state.menus.editableTabs = val
      }
    }
  }
  ,
  methods: {

    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      this.$router.push({name: activeName})
    },
    clickTab(target) {
      this.$router.push({name: target.name})
    }
  }
}
</script>

<style scoped>

</style>