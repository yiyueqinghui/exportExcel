import axios from 'axios';

let http = axios.create({
  baseURL: process.env.API_ROOT,
  withCredentials: false,
  transformRequest: [function (data) {
    let newData = '';
    for (let k in data) {
      if (data.hasOwnProperty(k) === true) {
        newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
      }
    }
    return newData;
  }]
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
  console.log(config);
  return http(config).catch(function (err){
    console.log('error');
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
