function onOpen(){
    var ui = SpreadsheetApp.getUi();
    ui.createAddonMenu()
        .addItem("Настроить документ", "startWorking")
        .addItem("Добавить портфель", "newPortfolio")
        .addItem("Купить актив", "buySymbols")
        .addToUi()
}

NECESSARY_TABLES = ["Портфели", "Тикеры", "Сделки"];


/**
 * Get the price of symbol by its id.
 *
 * @param {symbol_id} input The symbol id that you want to get the price of.
 * @return The price of symbol.
 * @customfunction
 */
function YARDOFFSYMBOL(symbol_id){
    var backendAPI = new BackendAPI();

    var symbols = backendAPI.getSymbolBySymbolId(symbol_id);
    if (symbols.length < 1){
        alert("Указанного актива \""+symbol_id+"\" не существует!");
        return 0;
    }
    var symbol = symbols[0];
    return parseFloat(symbol["price"]);
}

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

function getExistingPortgolios(){
    var portfolioTS = new TableSheet("Портфели", 3);

    var data = portfolioTS.getData();
    var output = [];
    for (var i in data){
        var temp = {
            "id": data[i][portfolioTS.columns["ID"]],
            "name": data[i][portfolioTS.columns["Название"]],
        }
        output.push(temp);
    }
    return output;
}

function errorHandler(error_type, message){
    alert(error_type + ": " + message);
}