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
      <el-table :data="tableData" style="width: 80%;margin: 20px auto;" border fit highlight-current-row >
        <el-table-column  label="姓名" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column  label="语文" align="center">
          <template slot-scope="scope">{{scope.row.chinese}}</template>
        </el-table-column>
        <el-table-column  label="数学" align="center">
          <template slot-scope="scope">{{scope.row.math}}</template>
        </el-table-column>
        <el-table-column  label="英语" align="center">
          <template slot-scope="scope">{{scope.row.english}}</template>
        </el-table-column>
      </el-table>
      <router-view></router-view>
    </div>
</template>

<script>
    export default {
      name: "home",
      created(){
        this.tableData = this.$Store.tableData;
      }

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
