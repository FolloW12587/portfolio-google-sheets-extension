function buySymbols(){
    if (!checkExcistingTables()){
        return;
    }

    var html = HtmlService.createHtmlOutputFromFile('buySymbol')
        .setWidth(500)
        .setHeight(550);
    SpreadsheetApp.getUi()
        .showModalDialog(html, 'Купить актив');
}

function sellSymbols(){
    if (!checkExcistingTables()){
        return;
    }

    var html = HtmlService.createHtmlOutputFromFile('sellSymbol')
        .setWidth(400)
        .setHeight(400);
    SpreadsheetApp.getUi()
        .showModalDialog(html, 'Продать актив');
}

function applySymbols(data, type){
    var portfolioTS = getPortfolioTS(data['portfolio_id']);

    var option = {
        "currency": data['symbol']['currency']['code'],
        "amount": data['count'] * data['price']
    };
    addDeal(data, portfolioTS.name, type);
    if (type == "Покупка"){
        portfolioTS.debit(option);
        addSymbol(data, portfolioTS);
    }
    else {
        portfolioTS.topUp(option);
        subSymbol(data, portfolioTS);
    }
}

function addDeal(data, portfolio, type){
    const dealsTS = new TableSheet("Сделки");

    var options = {
        "Дата": new Date(),
        "Портфель": portfolio,
        "Тикер": data['symbol']['ticker'],
        "Тип сделки": type,
        "Цена покупки": data['price'],
        "Валюта сделки": data['symbol']['currency']['code'],
        "Количество": data['count'],
        "Сумма": data['price'] * data['count']
    };
    dealsTS.appendRow(options);
}

function addSymbol(data, portfolioTS){
    var options = {
        "Тикер": data['symbol']['ticker'],
        "ID Символа": data['symbol']['symbolId'],
        "Дата открытия": new Date(),
        "Наименование": data['symbol']['name'],
        "Валюта": data['currency']['code'],
        "Кол-во акций": data['count'],
        "Цена входа": data['price'],
        "Цена рыночная": "=YARDOFFSYMBOL(R[0]C"+(portfolioTS.columns["ID Символа"]+1)+")",
        "Тип": data['type'],
        "Страна": data['country'],
        "Сектор": data['economy_sector'],
        "Кол-во закрытых": 0,
        "Цена Закрытия": 0,
    };
    portfolioTS.addSymbol(options);
}

function subSymbol(data, portfolioTS){
    var options = {
        "ID Символа": data['symbol']['symbolId'],
        "Дата закрытия": new Date(),
        "Кол-во закрытых": data['count'],
        "Цена Закрытия": data['price'],
        "Валюта": data['currency']['code'],
    };
}