/*--------------------------------------------------
ランダムに作品情報を返す
--------------------------------------------------*/
const doGet = (e) => {
  debuglog("@@Called: doGet")
  const data = getRandomWorkItem();
  debuglog(data);
  return genResponce(data);
}


/*--------------------------------------------------
LINE Bot用のレスポンスを返す
--------------------------------------------------*/
const doPost = (e) => {
  const contents_str = e.postData.contents
  debuglog("@@Called: doPost")
  const myBot = new Bot(token);
  myBot.reply(contents_str);
  return genResponce("OK");
}
