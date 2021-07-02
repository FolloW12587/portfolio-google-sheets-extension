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

}

function applySymbols(data, type){
    const portfolios = getExistingPortfolios();
    const selected_portfolio = portfolios.filter((portfolio) => portfolio['id'] == data['portfolio_id'])[0];
    var portfolioTS = PortfolioSheet(selected_portfolio['name']);

    var option = {
        "currency": data['symbol']['currency']['code'],
        "amount": data['count'] * data['price']
    };
    addDeal(data, selected_portfolio, type);
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
        "Портфель": portfolio['name'],
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
        "Кол-во акций": data['count'],
        "Цена входа": data['price'],
        "Цена рыночная": "=YARDOFFSYMBOL(R[0]C"+(portfolioTS.columns["ID Символа"]+1)+")",
        "Тип": data['type'],
        "Страна": data['country'],
        "Сектор": data['economy_sector']
    };
    portfolioTS.appendRow(options);
}

function subSymbol(data, portfolioTS){

}