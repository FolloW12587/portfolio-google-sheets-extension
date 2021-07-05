function buyCurrency(){
    if (!checkExcistingTables()){
        return;
    }

    var html = HtmlService.createHtmlOutputFromFile('buyCurrency')
        .setWidth(550)
        .setHeight(550);
    SpreadsheetApp.getUi()
        .showModalDialog(html, 'Купить Валюту');
}

function sellCurrency(){
    if (!checkExcistingTables()){
        return;
    }

    var html = HtmlService.createHtmlOutputFromFile('sellCurrency')
        .setWidth(500)
        .setHeight(550);
    SpreadsheetApp.getUi()
        .showModalDialog(html, 'Продать Валюту');
}


function applyCurrency(data, type){
    const portfolios = getExistingPortfolios();
    const selected_portfolio = portfolios.filter((portfolio) => portfolio['id'] == data['portfolio_id'])[0];
    var portfolioTS = new PortfolioSheet(selected_portfolio['name']);

    var main_currency_options = {
        "currency": selected_portfolio['currency'],
        "amount": data['count'] * data['price']
    };
    var second_currency_options = {
        "currency": data['currency'],
        "amount": data['count'],
        "price": data['price']
    };

    addCurrencyDeal(data, selected_portfolio, type);
    if (type == "Покупка"){
        portfolioTS.topUp(second_currency_options);
        portfolioTS.debit(main_currency_options);
    }
    else {
        portfolioTS.topUp(main_currency_options);
        portfolioTS.debit(second_currency_options);
    }
}

function addCurrencyDeal(data, selected_portfolio, type){
    const dealsTS = new TableSheet("Сделки");

    var options = {
        "Дата": new Date(),
        "Портфель": selected_portfolio['name'],
        "Тикер": data['currency'],
        "Тип сделки": type,
        "Цена покупки": data['price'],
        "Валюта сделки": selected_portfolio['currency'],
        "Количество": data['count'],
        "Сумма": data['price'] * data['count']
    };
    dealsTS.appendRow(options);
}