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
    var chart = sheet.getCharts()[1];
    chart = chart.modify()
        .setChartType(Charts.ChartType.PIE)
        .addRange(rangeValues)
        .addRange(rangeHeader)
        .setMergeStrategy(Charts.ChartMergeStrategy.MERGE_ROWS)
        // .setNumHeaders(rangeValues.getValues()[0].length)
        .setTransposeRowsAndColumns(true)
        .setOption("title", "План по классам типов")
        .setOption("is3D", true)
        .build()
    sheet.updateChart(chart);
  }