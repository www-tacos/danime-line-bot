class Bot {
  constructor(token) {
    this.TOKEN = token;
    this.FUNC_MSG = {
      RANDOM : FUNC_MSG.RANDOM,
      SEARCH : FUNC_MSG.SEARCH
    };
  }

  reply(contents_str) {
    debuglog("@@Called: reply");
    try {
      const contents = JSON.parse(contents_str);
      debuglog({'key': '@@contents', 'value': contents});
      contents.events.forEach(event => {
        try {
          switch(event.type) {
            case "message":
              this.reply2Message(event);
              break;
            default:
              throw new Error("未定義のイベントタイプの連携");
          }
        } catch(err_reply) {
          debuglog(err_reply, "red");
          this.reply2Error(event);
        }
      })
    } catch(err_unknown) {
      debuglog(err_unknown, "red");
    }
  }

  reply2Message(event){
    debuglog("@@Called: reply2Message");
    const messageText = event.message.text;
    debuglog(`@@Message is "${messageText}"`);

    let messages;
    switch(messageText) {
      case this.FUNC_MSG.RANDOM:
        messages = this.funcRandom();
        break;
      case this.FUNC_MSG.SEARCH:
        messages = this.funcSearch();
        break;
      default:
        messages = this.funcSearch(messageText);
        break;
    }
    debuglog({'key': '@@messages', 'value': messages});

    const respCode = this.post({
      "replyToken" : event.replyToken,
      "messages" : messages,
      "notificationDisabled": true
    });
    debuglog(`@@respCode is ${respCode}`);
  }

  reply2Error(event) {
    debuglog("@@Called: reply2Error");
    this.post({
      "replyToken" : event.replyToken,
      "messages" : [{
        "type": "text",
        "text": "エラーが発生しました"
      }],
      "notificationDisabled": true
    });
  }

  funcRandom() {
    debuglog("@@Called: funcRandom");
    const messages = [];
    const randomWorkItemData = getRandomWorkItem();
    debuglog({'key': '@@randomWorkItemData', 'value': randomWorkItemData});
    messages.push({
      "type": "template",
      "altText": randomWorkItemData.workTitle,
      "template": {
        "type": "buttons",
        "thumbnailImageUrl": randomWorkItemData.mainKeyVisualPath,
        "imageAspectRatio": "rectangle",
        "imageSize": "contain",
        "imageBackgroundColor": "#FFFFFF",
        "text": randomWorkItemData.workTitle,
        "actions": [{
          "type": "uri",
          "label": "作品ページ",
          "uri": DAnimeApi.getInfoLink(randomWorkItemData.workId)
        }]
      }
    });
    return messages;
  }

  funcSearch(keyword=null) {
    debuglog("@@Called: funcSearch");
    const messages = [];
    if(keyword == null) {
      messages.push({
        "type": "text",
        "text": "検索キーワードを入力してください\n（作品名/曲名/声優/歌手/キャラ名）"
      });
    } else {
      const searchResult = DAnimeApi.fetchSearchResult(keyword);
      debuglog({'key': '@@searchResult', 'value': searchResult});
      messages.push({
        "type": "text",
        "text": `検索結果は${searchResult.data.maxCount}件でした`
      });
      if (searchResult.data.maxCount > 0) {
        const columns = [];
        searchResult.data.workList.forEach(item => {
          columns.push({
          "thumbnailImageUrl": item.workInfo.mainKeyVisualPath,
          "imageBackgroundColor": "#FFFFFF",
          "text": item.workInfo.workTitle,
          "actions": [{
            "type": "uri",
            "label": "作品ページ",
            "uri": DAnimeApi.getInfoLink(item.workId)
          }]
          });
        });
        messages.push({
          "type": "template",
          "altText": `"${keyword}"の検索結果`,
          "template": {
            "type": "carousel",
            "columns": columns,
            "imageAspectRatio": "rectangle",
            "imageSize": "contain",
          }
        });
      }
      if (searchResult.data.maxCount > searchResult.data.count) {
        messages.push({
          "type": "template",
          "altText": "検索結果の詳細",
          "template": {
            "type": "buttons",
            "imageBackgroundColor": "#FFFFFF",
            "text": "検索結果をさらに見る場合は以下のリンクから確認してください",
            "actions": [{
              "type": "uri",
              "label": "ほかの検索結果",
              "uri": DAnimeApi.getSearchLink(keyword)
            }]
          }
        });
      }
    }
    return messages;
  }

  post(payload) {
    debuglog("@@Called: post");
    const data = {
      "method" : "post",
      "headers" : {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${this.TOKEN}`
      },
      "payload" : JSON.stringify(payload)
    };
    debuglog(data);
    // LINEプラットフォームに返信データを送らないテストモードも用意しておく
    if(CURRENT_RELEASE_MODE == RELEASE_MODE.LOCAL) {
      return 200;
    } else {
      const responce = UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", data);
      return responce.getResponseCode();
    }
  }
}

