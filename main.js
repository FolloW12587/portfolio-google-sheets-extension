function onOpen(){
    var ui = SpreadsheetApp.getUi();
    ui.createAddonMenu()
        .addItem("Настроить документ", "startWorking")
        .addItem("Добавить портфель", "newPortfolio")
        .addSeparator()
        .addItem("Пополнить портфель", "TopUp")
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
    var portfolioTS = new PortfolioSheet("P.Консервативный_шаблон (копия)");
    
    var new_data = {
        "Тикер": "SBER",
        "Дата открытия": new Date(),
        "Наименование": "Сбербанк",
        "Кол-во акций": 2,
        "Цена входа": 10000,
        "Цена рыночная": 10100,
    };
    portfolioTS.appendRow(new_data);
}