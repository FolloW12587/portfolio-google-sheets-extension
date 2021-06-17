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
    const dealsTS = new TableSheet("Сделки");
    const portfolios = getExistingPortgolios();
    const selected_portfolio = portfolios.filter((portgolio) => portgolio['id'] == data['portfolio_id'])[0];

    var options = {
        "Дата": new Date(),
        "Портфель": selected_portfolio['name'],
        "Тикер": data['symbol']['ticker'],
        "Тип сделки": "Покупка",
        "Цена покупки": data['price'],
        "Валюта сделки": data['symbol']['currency'],
        "Количество": data['count'],
        "Сумма": data['price'] * data['count']
    };
    dealsTS.appendRow(options);
}