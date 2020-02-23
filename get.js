const axios=require('axios');

async function getOauthKey(){
    const result=await axios.get('https://passport.bilibili.com/qrcode/getLoginUrl')
      .then((res)=>{
        return res.data.data;
      })
      console.log(result);
    return result;
}

async function identifyKey(oauthKey){
  console.log(oauthKey);
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
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  });
  console.log(identify.data);
  return identify;
}

async function login(){
  await axios.get('https://api.bilibili.com/x/web-interface/nav')
          .then(res=>
            console.log(res.data)  
          );
}

async function run(){
  const oauthKey=await getOauthKey();
  for(let i=0;i<50;i++){
    ((i)=>{
      setTimeout(async ()=>{
        await identifyKey(oauthKey.oauthKey)
          .then(login());
      },2000*i);
    })(i);
  }
}

run();