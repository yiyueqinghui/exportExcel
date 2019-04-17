<template>
  <div id="excel">
    <el-col :span="24">
      <el-button type="primary" @click="handleDownload">导出excel文件</el-button>
    </el-col>
  </div>
</template>

<script>
    export default {
      name: "excel",
      data(){
        return {

        }
      },
      methods:{
        handleDownload(){
          require.ensure([], () => {
            const { export_json_to_excel } = require('@/vendor/Export2Excel')
            const tHeader = ['姓名', '语文', '数学','英语']
            const filterVal = ['name', 'chinese', 'math','english']
            const list = this.tableData
            const data = this.formatJson(filterVal, list)
            export_json_to_excel(tHeader, data, '列表excel')
          })
        },
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => v[j]))
        }
      },
      created(){
        this.tableData = this.$Store.tableData;
      }
    }
</script>

<style scoped>

</style>
