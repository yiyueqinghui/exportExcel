<template>
    <div id="home">
      <ul>
        <li>
          <router-link to="/csv">导出csv格式文件</router-link>
        </li>
        <li>
          <router-link to="/excel">导出excel文件</router-link>
        </li>
      </ul>
      <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "home"
    }
</script>

<style scoped>
  ul{
    display: flex;
    justify-content: space-around;
    list-style: none;
    margin-bottom: 20px;
  }
</style>
