function newPortfolio(){
    if (!checkExcistingTables()){
        return;
    }

    var html = HtmlService.createHtmlOutputFromFile('createPortfolio')
        .setWidth(400)
        .setHeight(400);
    SpreadsheetApp.getUi()
        .showModalDialog(html, 'Создать портфель');
}

function newPortfolio2(data){
    createNewPortfolio(data);
    var html = HtmlService.createHtmlOutputFromFile('createPortfolio2')
        .setWidth(400)
        .setHeight(400);
    SpreadsheetApp.getUi()
        .showModalDialog(html, 'Диверсификация по типам ценных бумаг');
}

function newPortfolio3(data, symbol_types){
    updateObjectsDiversification(data, symbol_types);
    var html = HtmlService.createHtmlOutputFromFile('createPortfolio3')
        .setWidth(400)
        .setHeight(300);
    SpreadsheetApp.getUi()
        .showModalDialog(html, 'Диверсификация по странам');
}

function newPortfolio4(data, countries){
    updateObjectsDiversification(data, countries);
    var html = HtmlService.createHtmlOutputFromFile('createPortfolio4')
        .setWidth(400)
        .setHeight(400);
    SpreadsheetApp.getUi()
        .showModalDialog(html, 'Диверсификация по секторам экономики');
}

function newPortfolioLast(data, economy_sectors){
    updateObjectsDiversification(data, economy_sectors);
}

function createNewPortfolio(data){
    var portfolioTS = new TableSheet("Портфели", 3);
    var options = {
        "Дата создания": new Date(),
        "Название": data['name'],
        "Цель (Накопить)": data['goal'],
        "Для чего портфель": data['desc'],
        "Срок цели": data['term'],
        "Ожидаемая доходность": data['profit'],
        "Возраст распаковщика": data['age'],
        "Первый платеж": data['start_capital'],
        "Валюта портфеля": data['currency'],
        "Периодичность внесения": data['period'],
        "Брокер": data['broker'],
    };

    if (portfolioTS.getLastRow() == 2)
        options['ID'] = 1
    else 
        options['ID'] = "=MAX(A3:A"+String(portfolioTS.getLastRow())+")+1"
    
    portfolioTS.appendRow(options);
}

function updateObjectsDiversification(data, object){
    var portfolioTS = new TableSheet("Портфели", 3);
    var columns = Object.keys(portfolioTS.columns);
    var options = {};
    for (var i in object){
        var st = object[i];
        if (columns.indexOf(st['name']) >-1){
            options[st['name']] = data[st['id']];
        }
    }

    portfolioTS.updateRow(options, portfolioTS.getLastRow());
}