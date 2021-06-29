function buySymbols(){
    if (!checkExcistingTables()){
        return;
    }

    var html = HtmlService.createHtmlOutputFromFile('buySymbol')
        .setWidth(400)
        .setHeight(400);
    SpreadsheetApp.getUi()
        .showModalDialog(html, 'Купить актив');
}

function applySymbols(data){
    const portfolios = getExistingPortfolios();
    const selected_portfolio = portfolios.filter((portfolio) => portfolio['id'] == data['portfolio_id'])[0];
   
    addDeal(data, selected_portfolio);
    addSymbol(data, selected_portfolio);
}

function addDeal(data, portfolio){
    const dealsTS = new TableSheet("Сделки");

    var options = {
        "Дата": new Date(),
        "Портфель": portfolio['name'],
        "Тикер": data['symbol']['ticker'],
        "Тип сделки": "Покупка",
        "Цена покупки": data['price'],
        "Валюта сделки": data['symbol']['currency']['code'],
        "Количество": data['count'],
        "Сумма": data['price'] * data['count']
    };
    dealsTS.appendRow(options);
}

function addSymbol(data, portfolio){
    const portfolioTS = new PortfolioSheet(portfolio['name']);

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