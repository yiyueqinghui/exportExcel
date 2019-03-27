<template>
    <div id="home">
       首页{{msg}},请求状态 {{status }}
    </div>
</template>

<script>
    export default {
      name: "home",
      data(){
        return {
          msg:'',
          status:0
        }
      },
      methods:{
        init(){
          this.msg = this.$Store.test;
          let data = {
            id:1
          }
          this.$axios.Home.detail(data).then((res)=>{
            console.log(res);
            this.status = res.status;
          })
        }
      },
      created(){
        this.init();
      }

    }
</script>

<style scoped lang="less">
  @color:red;

  #home{
    color:@color;
  }

</style>
