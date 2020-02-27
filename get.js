const axios=require('axios');
const jsCookie=require('js-cookie');
axios.defaults.withCredentials=true;

async function getOauthKey(){
    const result=await axios.get('https://passport.bilibili.com/qrcode/getLoginUrl')
      .then((res)=>{
        console.log(res.data.data.url);
        return res.data.data;
      })
    return result;
}

async function identifyKey(oauthKey){
  const identify=await axios({
    url: 'https://passport.bilibili.com/qrcode/getLoginInfo',
    method: 'post',
    data: {
      oauthKey: oauthKey,
      gourl: 'https://www.bilibili.com'
    },
    transformRequest: [function (data) {
      let ret = '';
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
      }
      return ret;
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Headers':'Authorization,Origin, X-Requested-With, Content-Type, Accept',
      'Access-Control-Allow-Methods':'GET,POST'
    }
  });
  return identify;
}

async function tryUrl(oauthKey){
  let myCookie='';
  await identifyKey(oauthKey)
    .then(async (res)=>{
      if(res.data.status){
        myCookie=res.headers;
        const cookie=changeIntoCookie(myCookie['set-cookie']);
        const myData=await getMyData(cookie);
      }else{
        setTimeout(()=>{
          tryUrl(oauthKey);
        },2000);
      }
    });
  // return myUrl;
}

async function getMyUrl(){
  const res=await getOauthKey();
  const myUrl = await tryUrl(res.oauthKey);
  return myUrl;
}

function changeIntoCookie(myUrl){
  let str='';
  for(let i=0;i<myUrl.length;i++){
    str+=decodeURIComponent(myUrl[i].split(';')[0]);
    if(i<myUrl.length-1){
      str+=';';
    }
  }
  // console.log(str);
  return str;
}

async function getMyData(mycookie){
  const cookie=await axios({
      url: 'https://account.bilibili.com/home/userInfo',
      method: 'get',
      headers: {
        referer:'https://account.bilibili.com/home',
        host:'account.bilibili.com',
        cookie:mycookie
      }
    })
    .then(res=>console.log(res.data.data)
  );
  return cookie;
}

async function run(){
  const myUrl=await getMyUrl();
}

run();
