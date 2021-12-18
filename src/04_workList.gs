/*--------------------------------------------------
全作品一覧を設定する関数
トリガーまたは手動で定期的に実行する
--------------------------------------------------*/
const setWorkItemList = () => {
  // 母音子音のKey
  // keyにするときは母音も子音もともに+1する（1スタートのため）
  // ＿はスキップ対象
  const INITIAL_TABEL = [
    ['あ', 'い', 'う', 'え', 'お'],
    ['か', 'き', 'く', 'け', 'こ'],
    ['さ', 'し', 'す', 'せ', 'そ'],
    ['た', 'ち', 'つ', 'て', 'と'],
    ['な', 'に', 'ぬ', 'ね', 'の'],
    ['は', 'ひ', 'ふ', 'へ', 'ほ'],
    ['ま', 'み', 'む', 'め', 'も'],
    ['や', '＿', 'ゆ', '＿', 'よ'],
    ['ら', 'り', 'る', 'れ', 'ろ'],
    ['わ', 'を', 'ん', '＿', '＿']
  ];

  // ブックとシートの取得
  const book = SpreadsheetApp.openById(BOOKID);
  var sheet = book.getSheetByName(SHEET.WORKLIST);

  // シートが存在する場合は既存シートをクリアし、存在しない場合は作成する
  if(sheet) {
    sheet.clear();
  } else {
    sheet = book.insertSheet();
    sheet.setName(SHEET.WORKLIST);
  }

  // シートのヘッダー行を作成する
  sheet.appendRow(["workId", "workTitle", "mainKeyVisualPath"]);
  sheet.setFrozenRows(1);
  sheet.getRange(1,1, 1,3).setFontWeight("bold");

  // 作品一覧を取得しシートに記入する
  var row_start = 2;
  // 母音のループ
  for(var ik=0; ik<INITIAL_TABEL.length; ik++) {
    // 子音のループ
    for(var ck=0; ck<INITIAL_TABEL[ik].length; ck++) {
      if(INITIAL_TABEL[ik][ck] != "＿") {
        var json = DA_API.fetchAllItem(ik+1, ck+1);
        var data = [];
        json.data.workList.forEach(d => data.push([d.workId, d.workInfo.workTitle, d.workInfo.mainKeyVisualPath.replace(/_[0-9]\.png/, '_1.png')]));
        Utilities.sleep(2 * 1000);
        if(data.length > 0) {
          // シートにまとめて記入（appendRowより高速）
          sheet.getRange(row_start,1, data.length, 3).setValues(data);
          row_start += data.length;
          Logger.log(`${INITIAL_TABEL[ik][ck]} から始まる作品一覧の取得完了`);
        } else {
          Logger.log(`${INITIAL_TABEL[ik][ck]} から始まる作品なし`);
        }
      }
    }
  }
}


/*--------------------------------------------------
作品をランダムに取得する関数
--------------------------------------------------*/
const getRandomWorkItem = () => {
  const book = SpreadsheetApp.openById(BOOKID);
  const sheet = book.getSheetByName(SHEET.WORKLIST);
  const row_min = 2;
  const row_max = sheet.getDataRange().getLastRow();
  const row = random(row_min, row_max);
  const data = sheet.getRange(row,1 , 1,3).getValues()[0];
  return {
    workId: data[0],
    workTitle: data[1],
    mainKeyVisualPath: data[2]
  };
}
