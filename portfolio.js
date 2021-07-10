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
        .showModalDialog(html, 'Диверсификация по классам активов');
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
    var portfolios = getExistingPortfolios();
    var portfolio = portfolios[portfolios.length - 1];
    var portfolioTS = new PortfolioSheet(portfolio['name']);
    portfolioTS.createCharts();
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
        "Периодический платеж": data['period_topup'],
        "Первый платеж": data['start_capital'],
        "Валюта портфеля": data['currency'],
        "Периодичность внесения": data['period'],
        "Даты платежей": data['period_dates'],
        "Брокер": data['broker'],
    };

    if (portfoliosListTS.getLastRow() == 2)
        options['ID'] = 1
    else 
        options['ID'] = "=MAX(A3:A"+String(portfoliosListTS.getLastRow())+")+1"
    
    return portfoliosListTS.appendRow(options);
}

function addPortfolioSheet(data, row_index){
    var portfolioTS = new PortfolioSheet("Портфель_шаблон");
    portfolioTS.rename(data['name']);
    portfolioTS.setCurrency(data);

    var options = {
        "currency": data['currency'],
        "amount": data['start_capital']
    };
    portfolioTS.topUp(options);

    var refillTS = new TableSheet("График.Платежей_шаблон", data_starts=3, header_at=2);
    refillTS.rename("График.Платежей."+data['name']);
    Logger.log(data);
    fillRefillTS(refillTS, data);
}

function updateObjectsDiversification(data, object){
    var portfoliosListTS = new TableSheet("Портфели", 3);
    var columns = Object.keys(portfoliosListTS.columns);
    var options = {};
    for (var i in object){
        var st = object[i];
        if (columns.indexOf(st['name']) >-1){
            options[st['name']] = parseFloat(data[st['id']]) / 100;
        }
    }

    portfoliosListTS.updateRow(options, portfoliosListTS.getLastRow());
}

function getExistingPortfolios(){
    var portfoliosListTS = new TableSheet("Портфели", 3);

    var data = portfoliosListTS.getData();
    var output = [];
    for (var i in data){
        var temp = {
            "id": data[i][portfoliosListTS.columns["ID"]],
            "name": data[i][portfoliosListTS.columns["Название"]],
            "currency": data[i][portfoliosListTS.columns["Валюта портфеля"]],
            "periodical_topup": data[i][portfoliosListTS.columns["Периодический платеж"]],
        }
        if (temp['id'] == ''){
            continue;
        }
        output.push(temp);
    }
    return output;
}

function topUp(){
    if (!checkExcistingTables()){
        return;
    }

    var html = HtmlService.createHtmlOutputFromFile('topUp')
        .setWidth(450)
        .setHeight(200);
    SpreadsheetApp.getUi()
        .showModalDialog(html, 'Пополнение портфеля');

}

function applyTopUp(data){
    const portfolioTS = getPortfolioTS(data['portfolio_id']);
    portfolioTS.topUp(data);
}

function getPortfolioAmount(portfolio_id){
    const portfolioTS = getPortfolioTS(portfolio_id);
    return {
        "portfolio_id": portfolio_id,
        "amount": portfolioTS.getPortfolioAmount()
    };
}

function getPortfolioSymbols(portfolio_id){
    const portfolioTS = getPortfolioTS(portfolio_id);
    var array = [];

    const data = portfolioTS.getData();
    for (var i in data){
        const symbol = data[i];
        const temp = {
            "ticker": symbol[portfolioTS.columns['Тикер']],
            "name": symbol[portfolioTS.columns['Наименование']],
            "symbolId": symbol[portfolioTS.columns['ID Символа']],
            "price": symbol[portfolioTS.columns['Цена рыночная']],
            "count": symbol[portfolioTS.columns['Кол-во акций']],
            "currency": symbol[portfolioTS.columns['Валюта']],
        };
        array.push(temp);
    }
    var output = {
        "portfolio_id": portfolio_id,
        "symbols": array
    };
    return output;
}

function getPortfolioTS(portfolio_id){
    const portfolios = getExistingPortfolios();
    const selected_portfolio = portfolios.filter((portfolio) => portfolio['id'] == portfolio_id)[0];

    return new PortfolioSheet(selected_portfolio['name']);
}

function fillRefillTS(refillTS, data){
    var d = new Date();
    d.setFullYear(d.getFullYear() - data['age']);
    var options = {
        "Прирост План": data['profit'] / 100,
        "Возраст": d 
    };
    refillTS.updateRow(options, 1);
    fillFirstRowRefillTS(refillTS, data);
    fillNextRowsRefillTS(refillTS, data);
}

function fillFirstRowRefillTS(refillTS, data){
    var options = {
        "Дата": new Date(),
        "Возраст":`=ROUNDDOWN((R[0]C${refillTS.columns['Дата'] + 1}-R1C[0])/365,25+0,01)`,
        "Доход":`=R1C${refillTS.columns['Прирост План']+1}`,
        "Пополнение План":data['start_capital'],
        "Внесете План":`=R[0]C${refillTS.columns['Пополнение План'] + 1}`,
        "Прирост План":`=R[0]C${refillTS.columns['Пополнение План'] + 1}`,
        "Пополнение Факт":data['start_capital'],
        "Баланс Факт":data['start_capital']
    };

    if(data['period'] == "Раз в месяц"){
        options['Доход'] += "/12";
    } else {
        options['Доход'] += "/52,1429";
    }
    refillTS.appendRow(options);
}

function fillNextRowsRefillTS(refillTS, data){
    var list = [];
    var start_date = new Date();
    var options = {
        "Дата": new Date(),
        "Возраст":`=ROUNDDOWN((R[0]C${refillTS.columns['Дата'] + 1}-R1C[0])/365,25+0,01)`,
        "Доход":`=R1C${refillTS.columns['Прирост План']+1}`,
        "Пополнение План":data['period_topup'],
        "Внесете План":`=R[0]C${refillTS.columns['Пополнение План'] + 1}+R[-1]C[0]`,
        "Прирост План":`=R[0]C${refillTS.columns['Пополнение План'] + 1}+R[-1]C[0]+R[-1]C[0]*R[-1]C${refillTS.columns['Доход'] + 1}`,
        "Пополнение Факт":0,
        "Баланс Факт":`=R[0]C${refillTS.columns['Пополнение Факт'] + 1}+R[-1]C[0]`
    };
    
    if(data['period'] == "Раз в месяц"){
        var dateFunc = getNextDateByDay;
        options['Доход'] += "/12";
    } else {
        var dateFunc = getNextWeekdayOfDate;
        options['Доход'] += "/52,1429";
    }
    options['Дата'] = dateFunc(options['Дата'], data['period_dates']);
    var columns = refillTS.sheet.getRange(refillTS.header_at, 1, 1, refillTS.sheet.getLastColumn()).getValues()[0];
    var endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + data['term']);
    while(options['Дата'] <= endDate){
        var copy = JSON.parse(JSON.stringify(options));
        var temp = [];
        for (var i in columns){
            if (copy[columns[i]] !== undefined){
                if (columns[i] == "Дата")
                    temp.push(new Date(copy[columns[i]]));
                else 
                    temp.push(copy[columns[i]]);
            } else {
                temp.push("");
            }
        }
        list.push(temp);
        options['Дата'] = dateFunc(options['Дата'], data['period_dates']);
    }
    Logger.log(((new Date()).getTime() - start_date.getTime()) / 1000);
    start_date = new Date();
    refillTS.sheet.getRange(refillTS.sheet.getLastRow()+1, 1, list.length, refillTS.sheet.getLastColumn()).setValues(list);
    Logger.log(((new Date()).getTime() - start_date.getTime())/1000);
}