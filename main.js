function onOpen(){
    var ui = SpreadsheetApp.getUi();
    ui.createAddonMenu()
        .addItem("Настроить документ", "startWorking")
        .addItem("Добавить портфель", "newPortfolio")
        .addToUi()
}

NECESSARY_TABLES = ["Дашборд", "Портфели", "Тикеры", "Сделки"];

function startWorking(){
    for (var i in NECESSARY_TABLES){
        new TableSheet(NECESSARY_TABLES[i]);
    }
}

function newPortfolio(){
    if (!checkExcistingTables()){
        return;
    }

    var html = HtmlService.createHtmlOutputFromFile('createPortfolio')
        .setWidth(400)
        .setHeight(300);
    SpreadsheetApp.getUi()
        .showModalDialog(html, 'Создать портфель');
}

function newPortfolio2(data){
    createNewPortfolio(data);
    var html = HtmlService.createHtmlOutputFromFile('createPortfolio2')
        .setWidth(400)
        .setHeight(300);
    SpreadsheetApp.getUi()
        .showModalDialog(html, 'Создать портфель');
}

function createNewPortfolio(data){
    var portfolioTS = new TableSheet("Портфели");
    var options = {

    };
    
    // portfolioTS.appendRow(data)
}

function checkExcistingTables(){
    var sheets = SpreadsheetApp.getActive().getSheets();
    for (var i in NECESSARY_TABLES){
        var filtered = sheets.filter((sheet) => {sheet.getName() == NECESSARY_TABLES[i]});
        if (filtered.length == 0){
            errorHandler("Документ не настроен", "Отсутствует таблица "+ NECESSARY_TABLES[i] +". Нажмите на пункт \"Настроить документ\" в выпадающем списке расширения.");
            return false;
        }
    }
}

function errorHandler(error_type, message){
    alert(error_type + ": " + message);
}