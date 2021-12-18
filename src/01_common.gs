/*==================================================
共用定数
==================================================*/
// 開発or本番、本番デプロイ前にfalseにする
const RELEASE_MODE = {
  LOCAL: 1,  // 開発、LINEボットにメッセージレスポンスを返さない
  DEV: 2,    // 開発、LINEボットにメッセージレスポンスを返す
  PROD: 3    // 本番
}
const CURRENT_RELEASE_MODE = RELEASE_MODE.PROD;

// ブックID
const BOOKID = '1gxn1xuA4fLlMwa8HFYJawzUeSLjmzAMATG-bFx50rOI';

// シート名
const SHEET = {
  WORKLIST : "workList",
  LOG  : "log"
}

// 機能を指定するメッセージ
const FUNC_MSG = {
  RANDOM : "ランダムに作品を選択する",
  SEARCH : "キーワードで作品を検索する"
}



/*==================================================
ユーティリティ関数
==================================================*/
// オブジェクトをdoGetやdoPostで返すためのレスポンスを生成する関数
const genResponce = (obj) => {
  return ContentService
    .createTextOutput()
    .setContent(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// 日付をyyyyMMddで返す関数
const getYMD = () => {
  const dt = new Date();
  const yyyy = dt.getFullYear();
  const MM = ("00" + (dt.getMonth()+1)).slice(-2);
  const dd = ("00" + dt.getDate()).slice(-2);
  return `${yyyy}${MM}${dd}`;
}

// 日付をyyyy/MM/dd hh:mm:ssで返す関数
const getTimeStamp = () => {
  const dt = new Date();
  const yyyy = dt.getFullYear();
  const MM = ("00" + (dt.getMonth()+1)).slice(-2);
  const dd = ("00" + dt.getDate()).slice(-2);
  const hh = ("00" + (dt.getHours())).slice(-2);
  const mm = ("00" + (dt.getMinutes())).slice(-2);
  const ss = ("00" + (dt.getSeconds())).slice(-2);
  return `${yyyy}/${MM}/${dd} ${hh}:${mm}:${ss}`
}

// 指定したサイズの順列配列を作成する関数（0スタート）
const range = (n) => [...Array(n).keys()]

// 指定したminとmaxの間のランダムな整数を返す関数
const random = (min, max) => Math.floor(Math.random() * (max - min) + min)

// LOGシートにログを記録する関数（遅いので本番では使用しない）
const debuglog = (obj, color="black") => {
  if(CURRENT_RELEASE_MODE != RELEASE_MODE.PROD) {
    // ブックとシートの取得
    const book = SpreadsheetApp.openById(BOOKID);
    var sheet = book.getSheetByName(SHEET.LOG);

    // シートが存在しない場合は作成する
    if (!sheet) {
      sheet = book.insertSheet();
      sheet.setName(SHEET.LOG);
      sheet.appendRow(["Timestamp", "Log"])
      sheet.setFrozenRows(1)
      sheet.getRange(1,1, 1,2).setFontWeight("bold")
    }

    sheet.appendRow([`[${getTimeStamp()}]`, JSON.stringify(obj)]);
    sheet.getRange(sheet.getLastRow(), 1, 1, 2).setFontColor(color);
  }
}

// URLエンコード関数（記号のみ）
const urlEncode = (s) => {
  const mappings = [
    [':', '%3A'],
    ['/', '%2F'],
    ['?', '%3F'],
    ['#', '%23'],
    ['[', '%5B'],
    [']', '%5D'],
    ['@', '%40'],
    ['!', '%21'],
    ['$', '%24'],
    ['&', '%26'],
    ["'", '%27'],
    ['(', '%28'],
    [')', '%29'],
    ['+', '%2B'],
    [',', '%2C'],
    [';', '%3B'],
    ['=', '%3D']
  ]
  var ss = s;
  mappings.forEach(mapping => {
    ss = ss.replace(mapping[0], mapping[1])
  })
  return ss;
}
