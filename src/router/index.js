import Vue from 'vue'
import Router from 'vue-router'
import ExportExcel from '@/page/exportExcel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component:ExportExcel.home,
      redirect:'/csv',
      children:[
        {
          path:'/csv',
          component:ExportExcel.csv
        },
        {
          path:'/excel',
          component:ExportExcel.excel
        }
      ]
    }
  ]
})
