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
    var row_index = addPortfolioRow(data);
    addPortfolioSheet(data, row_index);
}

function addPortfolioRow(data){
    var portfoliosListTS = new TableSheet("Портфели", 3);
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

    if (portfoliosListTS.getLastRow() == 2)
        options['ID'] = 1
    else 
        options['ID'] = "=MAX(A3:A"+String(portfoliosListTS.getLastRow())+")+1"
    
    return portfoliosListTS.appendRow(options);
}

function addPortfolioSheet(data, row_index){
    var portfolioTS = new TableSheet("P.Консервативный");
    portfolioTS.rename(data['name']);
    updateFormulas(portfolioTS, row_index);
}

function updateFormulas(portfolioTS, row_index){
    updateTypeFormulas(portfolioTS, row_index);
    updateCountryFormulas(portfolioTS, row_index);
    updateObjFormulas(portfolioTS, row_index);
}

function updateTypeFormulas(portfolioTS, row_index){
    var index = 6;
    var value_char = "H";
    var range = portfolioTS.sheet.getRange("G6:G10");
    updateObjFormulas(portfolioTS, range.getValues(), value_char, index, row_index);
}

function updateCountryFormulas(portfolioTS, row_index){
    var index = 6;
    var value_char = "L";
    var range = portfolioTS.sheet.getRange("K6:K9");
    updateObjFormulas(portfolioTS, range.getValues(), value_char, index, row_index);
}

function updateEconomyFormulas(portfolioTS, row_index){
    var index = 6;
    var value_char = "J";
    var range = portfolioTS.sheet.getRange("I6:I9");
    updateObjFormulas(portfolioTS, range.getValues(), value_char, index, row_index);
}

function updateObjFormulas(portfolioTS, values, value_char, index, row_index){
    var portfoliosListTS = new TableSheet("Портфели", 3);
    for (var i in values){
        var name = values[i][0];

        var range = portfoliosListTS.sheet.getRange(row_index, portfoliosListTS.columns[name] + 1);
        var range_str = range.getA1Notation();

        var pRange = portfolioTS.sheet.getRange(value_char + (index + parseInt(i)));
        pRange.setValue("=Портфели!"+range_str+"/100");
    }
}

function updateObjectsDiversification(data, object){
    var portfoliosListTS = new TableSheet("Портфели", 3);
    var columns = Object.keys(portfoliosListTS.columns);
    var options = {};
    for (var i in object){
        var st = object[i];
        if (columns.indexOf(st['name']) >-1){
            options[st['name']] = data[st['id']];
        }
    }

    portfoliosListTS.updateRow(options, portfoliosListTS.getLastRow());
}