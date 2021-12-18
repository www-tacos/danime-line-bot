/*====================================================================================================
LINE Bot のリッチメニュー管理ツール
以下の仕様のいくつかを実装したもの
https://developers.line.biz/ja/reference/messaging-api/#rich-menu
richMenuObjectやrichMenuIdを適宜変更して使用する
====================================================================================================*/
/*--------------------------------------------------
引数
--------------------------------------------------*/
//const token = "<LINE BOTのトークン>"

const richMenuObject = {
  "size":{
    "width":1000,
    "height":500
  },
  "selected": false,
  "name": "RichMenu",
  "chatBarText": "メニューを開く",
  "areas": [
    {
      "bounds": {
        "x": 0,
        "y": 0,
        "width": 500,
        "height": 500
      },
      "action": {
        "type": "message",
        "text": FUNC_MSG.RANDOM
      }
    },
    {
      "bounds": {
        "x": 500,
        "y": 0,
        "width": 500,
        "height": 500
      },
      "action": {
        "type": "message",
        "text": FUNC_MSG.SEARCH
      }
    }
  ]
};

const richMenuId = "";
/**
 * 画像フォーマット：JPEGまたはPNG
 * 画像の幅サイズ（ピクセル）：800以上、2500以下
 * 画像の高さサイズ（ピクセル）：250以上
 * 画像のアスペクト比（幅/高さ）：1.45以上
 * 最大ファイルサイズ：1MB
 */
const richMenuImage = "https://raw.githubusercontent.com/www-tacos/danime-line-bot/main/img/menu_d_anime.png";




/*--------------------------------------------------
関数
--------------------------------------------------*/
// 引数確認用
const checkExists = (...args) => {
  if (args.filter(arg=>arg).length == args.length) {
    Logger.log(...args);
  } else {
    throw new Error("必要な情報が足りません");
  }
}

// 仕様：https://developers.line.biz/ja/reference/messaging-api/#create-rich-menu
const createRichMenu = () => {
  checkExists(token, richMenuDef);
  const resp = UrlFetchApp.fetch("https://api.line.me/v2/bot/richmenu", {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json",
      "Authorization" : `Bearer ${token}`
    },
    "payload" : JSON.stringify(richMenuObject)
  });
  if(resp.getResponseCode() != 200){
    throw new Error("リッチメニューオブジェクトを設定できませんでした");
  }
  const rmid = JSON.parse(resp).richMenuId;
  Logger.log(`発行されたリッチメニューIDは ${rmid} です`);
}

// 仕様：https://developers.line.biz/ja/reference/messaging-api/#upload-rich-menu-image
const uploadRichMenuImage = () => {
  const richMenuImageType = richMenuImage.split(".").slice(-1);
  checkExists(token, richMenuId, richMenuImage, richMenuImageType);
  const blob = UrlFetchApp.fetch(richMenuImage).getBlob();
  const resp = UrlFetchApp.fetch(`https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`, {
    "method" : "post",
    "headers" : {
      "Content-Type" : `image/${richMenuImageType}`,
      "Authorization" : `Bearer ${token}`
    },
    "payload": blob
  });
  if(resp.getResponseCode() != 200){
    throw new Error("リッチメニュー画像を設定できませんでした");
  }
  Logger.log(`リッチメニューの画像に ${richMenuImage} を設定しました`);
}

// 仕様：https://developers.line.biz/ja/reference/messaging-api/#get-rich-menu-list
const getRichMenuList = () => {
  checkExists(token);
  const resp = UrlFetchApp.fetch('https://api.line.me/v2/bot/richmenu/list', {
    "method" : "get",
    "headers" : {
      "Authorization" : `Bearer ${token}`
    },
  });
  if(resp.getResponseCode() != 200){
    throw new Error("リッチメニュー一覧を取得できませんでした");
  }
  const rms = JSON.parse(resp).richmenus;
  Logger.log(rms);
}

// 仕様：https://developers.line.biz/ja/reference/messaging-api/#set-default-rich-menu
const setDefaultRichMenu = () => {
  checkExists(token, richMenuId);
  const resp = UrlFetchApp.fetch(`https://api.line.me/v2/bot/user/all/richmenu/${richMenuId}`, {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json",
      "Authorization" : `Bearer ${token}`
    },
  });
  if(resp.getResponseCode() != 200){
    throw new Error("デフォルトのリッチメニューを設定できませんでした");
  }
  Logger.log(`デフォルトのリッチメニューを ${richMenuId} に設定しました`);
}

// 仕様：https://developers.line.biz/ja/reference/messaging-api/#get-default-rich-menu-id
const getDefaultRichMenuId = () => {
  checkExists(token);
  const resp = UrlFetchApp.fetch('https://api.line.me/v2/bot/user/all/richmenu', {
    "method" : "get",
    "headers" : {
      "Authorization" : `Bearer ${token}`
    },
  });
  if(resp.getResponseCode() != 200){
    throw new Error("デフォルトのリッチメニューを取得できませんでした");
  }
  const rmid = JSON.parse(resp).richMenuId;
  Logger.log(`デフォルトリッチメニューのIDは ${rmid} です`);
}

// 仕様：https://developers.line.biz/ja/reference/messaging-api/#cancel-default-rich-menu
const cancelDefaultRichMenu = () => {
  checkExists(token);
  const resp = UrlFetchApp.fetch('https://api.line.me/v2/bot/user/all/richmenu', {
    "method" : "delete",
    "headers" : {
      "Authorization" : `Bearer ${token}`
    },
  });
  if(resp.getResponseCode() != 200){
    throw new Error("デフォルトのリッチメニューを解除できませんでした");
  }
  Logger.log("デフォルトのリッチメニューを解除しました");
}

