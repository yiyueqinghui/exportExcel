import axios from 'axios';


//axios  https://www.npmjs.com/package/axios
let http = axios.create({
  baseURL: process.env.API_ROOT,
  timeout:1000*6,
  withCredentials: false,
  transformRequest: [],     //请求之前,修改request数据
  transformResponse:[]      //响应之后,修改response数据
});

// 深度合并对象
function deepObjectMerge(FirstOBJ, SecondOBJ) {
    for (var key in SecondOBJ) {
        FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === "[object Object]" ?
            deepObjectMerge(FirstOBJ[key], SecondOBJ[key]) : FirstOBJ[key] = SecondOBJ[key];
    }
    return FirstOBJ;
}

function apiAxios(method, url, params,config){
	let default_config = {
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
  };
  if(typeof config == 'undefined') config = {};
  config = deepObjectMerge(default_config,config);
  return http(config).catch(function (err){
    console.log(err);
  })
}



function Get(url, params,config){
  return apiAxios('GET', url, params,config)
}
function Post(url, params,config){
  return apiAxios('POST', url, params,config)
}

export{
  Get,
  Post
}
