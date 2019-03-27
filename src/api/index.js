import { Get,Post } from '@/utils/http_factory.js'

//案例
const Home = {
	detail:(data)=>{ return	Get('/api/1.0/page/flight',data) },
	linkMe:(data)=>{ return Get('/api/1.0/page/flight',data) }

}



export default {
	Home
}


