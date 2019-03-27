import { Get,Post } from '@/utils/http_factory.js'

//demo
const Home = {
	detail:(data)=>{ return	Get('/api/1.0/page/flight',data) }

}



export default {
	Home
}


