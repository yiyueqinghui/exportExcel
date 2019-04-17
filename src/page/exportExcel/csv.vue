<template>
   <div id="csv">
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
       <el-row style="width: 80%;text-align: left;margin: 0 auto;">
          <h4>csv文件的转换规则</h4>
          <dl>
            <dd>1,以逗号(,)来分割单元格</dd>
            <dd>2,每行结束,以换行符(\r\n)来分割</dd>
            <dd>3,字段中若包含换行符、双引号或者逗号，该字段需要用双引号括起来</dd>
            <dd>4,字段内出现双引号,则用两个双引号来转义eg:"x\"x"====> "x\"\"x" </dd>
            <dd></dd>
          </dl>
       </el-row>
       <el-row >
         <el-col :span="24">
           <el-button type="primary" @click="exportCsv">导出csv文件</el-button>
         </el-col>
       </el-row>
   </div>
</template>

<script>
  export default {
    name: "csv",
    data(){
      return {
        tableData:[
          {
            name:'"cj',
            chinese:99,
            math:97,
            english:90
          },
          {
            name:"l\r\nq",
            chinese:99,
            math:97,
            english:90
          },
          {
            name:'l,c',
            chinese:99,
            math:97,
            english:90
          },
          {
            name:'xx',
            chinese:99,
            math:97,
            english:90
          },
        ]
      }
    },
    methods:{
      dataToCsv(tabArr){
        let csvStr = '';
        tabArr.forEach((item,sub)=>{
          if(item.constructor === Object){
            let allkeys = Object.keys(item);
            allkeys.forEach( (keyVal,index) =>{
              if((allkeys.length - index) === 1){
                csvStr += (dealSpecialStr(item[keyVal])+'\r\n');
              }else{
                csvStr += (dealSpecialStr(item[keyVal])+',');
              }
            })
          }else{
             if(tabArr.length - sub === 1){
               csvStr += (dealSpecialStr(item) +'\r\n');
             }else{
               csvStr += (dealSpecialStr(item) +',');
             }
          }

        })

        function dealSpecialStr(str){
          str = str.toString();
          str = "\""+str.replace(/["]/g,'""')+"\"";
          return str;
        }

        return csvStr;
      },
      exportCsv(){
        let title = ['姓名','语文','数学','英语'];
        let headerTitle = this.dataToCsv(title),
          tabStr = this.dataToCsv(this.tableData);
        this.downloadFile('成绩单',headerTitle,tabStr);
      },
      downloadFile(name,headerTitle,tabStr){
        console.log(tabStr);

        let coding = Int8Array.from([0xef,0xbb,0xbf]),
          blob = new Blob([coding,headerTitle,tabStr],{type: 'application/octet-stream'}),
          csvUrl = URL.createObjectURL(blob),
          link = document.createElement('a');
        link.href = csvUrl;
        link.download = reName(name) + '.csv';
        link.click();

        function reName(name){
          let now = new Date(),
            time=now.getFullYear()+''+now.getMonth()+''+now.getDate()+''+now.getHours()+''+now.getMinutes()+''+now.getSeconds();
          name +=time;
          return name;
        }
      }
    }


  }
</script>

<style scoped>

</style>
