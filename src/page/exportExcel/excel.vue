<template>
  <div id="excel">
    <dl style="text-align: left;width: 80%;margin: 0 auto;">
      <dd>1,安装三个依赖包
        npm install -S file-saver
        npm install -S xlsx
        npm install -D script-loader
      </dd>
      <dd>2,在项目中创建一个文件夹（比如vendor，一般是在src目录下创建）

        把Blob.js和 Export2Excel.js这两个文件夹放到新建的文件夹内
      </dd>
      <dd>3,在页面中使用

        Export2Excel.js暴露了两个接口export_table_to_excel和export_json_to_excel,我们常用export_json_to_excel因为更加的可控一点
      </dd>
      <dd>
        4,注意问题：

        const { export_json_to_excel } = require('@/vendor/Export2Excel')这里的@/vendor/Export2Excel路径问题
        关键是看build目录下的webpack.base.conf.js配置文件的alias中@的配制.
      </dd>

    </dl>
    <el-alert
      title="参考链接:https://www.cnblogs.com/qiu-Ann/p/7743897.html"
      type="info">
    </el-alert>

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
            export_json_to_excel(tHeader, data, '成绩单')
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
  dl dd{
    margin: 10px 0;
  }

</style>
