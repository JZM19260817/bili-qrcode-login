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

async function tryUrl(oauthKey){
  console.log(0);
  let myUrl='';
  await identifyKey(oauthKey)
    .then((res)=>{
      if(res.data.status){
        myUrl=res.data.data.url;
        console.log(myUrl);
      }else{
        setTimeout(()=>{
          tryUrl(oauthKey);
        },2000);
      }
    });
  return myUrl;
}

async function getMyUrl(){
  const res=await getOauthKey();
  const myUrl = await tryUrl(res.oauthKey);
  return myUrl;
}

async function getCookie(myUrl){
  console.log('arr:',myUrl.length);
  // console.log('myUrl:',myUrl);
  // if(myUrl){
  //   await axios.get(`${myUrl}`)
  //   .then((res)=>{
  //     cookie=res.data;
  //     console.log('cookie:',cookie)
  //   })
  //   .catch(err=>console.log('err:'));
  // }else{
  //   setTimeout(()=>getCookie(myUrl),1000);
  // } 
  let cookie=''; 
  if(myUrl.length!==1){
    cookie=await axios({
      url: 'https://passport.biligame.com/crossDomain',
      method: 'get',
      data: {
        DedeUserID:myUrl[1],
        DedeUserID__ckMd5:myUrl[3],
        Expires:myUrl[5],
        SESSDATA:myUrl[7],
        bili_jct:myUrl[9],
        gourl: 'https://www.bilibili.com'
      },
      transformRequest: [function (data) {
        let ret = '';
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
        }
        return ret;
      }]
    });
  }else{
    setTimeout(()=>{
      getCookie(myUrl);
    },1000);
  }
  return cookie;
}

async function getAllMessage(myUrl){
  let arr=await myUrl.split(/=|&/);
  return arr;
}

async function run(){
  const myUrl=await getMyUrl();
  const arr=await getAllMessage(myUrl);
  const cookie=await getCookie(arr);
}

run();
