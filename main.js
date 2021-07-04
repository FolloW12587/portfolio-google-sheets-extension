function onOpen(){
    var ui = SpreadsheetApp.getUi();
    ui.createAddonMenu()
        .addItem("Настроить документ", "startWorking")
        .addItem("Добавить портфель", "newPortfolio")
        .addSeparator()
        .addItem("Пополнить портфель", "topUp")
        .addSubMenu(ui.createMenu("Активы")
            .addItem("Купить", "buySymbols")
            .addItem("Продать", "sellSymbols")
        )
        .addSubMenu(ui.createMenu("Валюты")
            .addItem("Купить", "buyCurrency")
            .addItem("Продать", "sellCurrency")
        )
        .addToUi()
}

NECESSARY_TABLES = ["Портфели", "Тикеры", "Сделки"];


function startWorking(){
    for (var i in NECESSARY_TABLES){
        new TableSheet(NECESSARY_TABLES[i]);
    }
}

function checkExcistingTables(){
    var sheets = SpreadsheetApp.getActive().getSheets();
    for (var i in NECESSARY_TABLES){
        var filtered = sheets.filter((sheet) => sheet.getName() == NECESSARY_TABLES[i]);
        if (filtered.length == 0){
            errorHandler("Документ не настроен", "Отсутствует таблица "+ NECESSARY_TABLES[i] +". Нажмите на пункт \"Настроить документ\" в выпадающем списке расширения.");
            return false;
        }
    }
    return true;
}

function errorHandler(error_type, message){
    SpreadsheetApp.getUi().alert(error_type + ": " + message);
}

function Test(){
    var sheet = SpreadsheetApp.getActiveSheet();
    var plTS = new TableSheet("Портфели");
    var rangeHeader = plTS.sheet.getRange("O1:W1");
    var rangeValues = plTS.sheet.getRange("O3:W3");
    var chart = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .setTransposeRowsAndColumns(true)
      .setMergeStrategy(Charts.ChartMergeStrategy.MERGE_ROWS)
      .addRange(rangeHeader)
      .addRange(rangeValues)
      .setOption("title", "План по классам активов")
      .setOption("is3D", true)
      .setOption('width', 400)
      .setOption('height', 250)
      .setPosition(18, 8, 0, 0)
      .build()
    sheet.insertChart(chart);
}
  
function Test2(){
    var sheet = SpreadsheetApp.getActiveSheet();
    var rangeHeader = sheet.getRange("D20:D28");
    var rangeValues = sheet.getRange("E20:E28");
    var chart = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      // .setTransposeRowsAndColumns(true)
      .setMergeStrategy(Charts.ChartMergeStrategy.MERGE_COLUMNS)
      .addRange(rangeHeader)
      .addRange(rangeValues)
      .setOption("title", "Факт по классам активов")
      .setOption("is3D", true)
      .setOption('width', 400)
      .setOption('height', 250)
      .setPosition(31, 8, 0, 0)
      .build()
    sheet.insertChart(chart);
}