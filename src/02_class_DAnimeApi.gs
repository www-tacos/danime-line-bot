// dアニメストアのAPIをまとめたクラス
// 静的プロパティ・メソッドだけのクラスなので実質オブジェクト
const DAnimeApi = {
  URL_BASE : "https://anime.dmkt-sp.jp/animestore/rest",
  ENDPOINT : {
    LIST : "WS000108",  // アイテム一覧取得用
    FIND : "WS000105"   // 検索用
  },
  getInfoLink : (workId) => {
    return `https://anime.dmkt-sp.jp/animestore/ci_pc?workId=${workId}`;
  },
  getSearchLink : (keyword) => {
    return `https://anime.dmkt-sp.jp/animestore/sch_pc?searchKey=${urlEncode(keyword)}&vodTypeList=svod`;
  },
  fetchAllItem : (initialCollectionKey=1, consonantKey=1) => {
    const url = `${DAnimeApi.URL_BASE}/${DAnimeApi.ENDPOINT.LIST}?workTypeList=anime&length=300&initialCollectionKey=${initialCollectionKey}&consonantKey=${consonantKey}&vodTypeList=svod`;
    const resp = UrlFetchApp.fetch(url);
    return JSON.parse(resp.getContentText());
  },
  fetchSearchResult : (keyword) => {
    const url = `${DAnimeApi.URL_BASE}/${DAnimeApi.ENDPOINT.FIND}?length=10&mainKeyVisualSize=1&sortKey=4&searchKey=${urlEncode(keyword)}&vodTypeList=svod`;
    const resp = UrlFetchApp.fetch(url);
    return JSON.parse(resp.getContentText());
  }
};

