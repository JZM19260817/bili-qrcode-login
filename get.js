const axios=require('axios');

async function getOauthKey(){
    const result=await axios.get('https://passport.bilibili.com/qrcode/getLoginUrl')
      .then((res)=>{
        console.log(res.data.data.url);
        return res.data.data;
      })
    return result;
}

async function identifyKey(oauthKey){
  // console.log(oauthKey);
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
  return identify;
}

async function getCookie(myUrl){
  await axios.get(myUrl)
          .then(res=>
            console.log('res:',res.data)  
          );
}

async function tryUrl(oauthKey){
  // console.log(oauthKey);
  let myUrl='';
  await identifyKey(oauthKey)
    .then((res)=>{
      // console.log(res.data.status)
      if(res.data.status){
        myUrl=res.data.data.url;
        // console.log(myUrl);
      }else{
        setTimeout(()=>{
          tryUrl(oauthKey);
        },2000);
      }
    });
  return myUrl;
}

async function getMyUrl(){
  let myUrl='';
  await getOauthKey()
    .then(res=>
      tryUrl(res.oauthKey)  
    );
  return myUrl;
}

async function run(){
  // let cookie='';
  await getMyUrl();
}

run();
