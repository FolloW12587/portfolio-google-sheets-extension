function onOpen(){
    var ui = SpreadsheetApp.getUi();
    ui.createAddonMenu()
        .addItem("Загрузить шаблон", "startWorking")
        .addItem("Создать портфель", "newPortfolio")
        .addSeparator()
        .addItem("Пополнить портфель", "topUp")
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

NECESSARY_TABLES = ["Портфели", "Сделки"];
WEEK_DAYS = {
    "Понедельник": 1,
    "Вторник": 2,
    "Среда": 3,
    "Четверг": 4,
    "Пятница": 5,
    "Суббота": 6,
    "Воскресенье": 0
};


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

function getNextWeekdayOfDate(date, weekday){
    // 6 for monday, 5 for tuesday ...
    var day = date.getDate() - (date.getDay() + 7 - WEEK_DAYS[weekday]) % 7;
    date.setDate(day + 7);

    return date;
}

function getNextDateByDay(date, day){
    var copy = new Date(date.getTime());
    copy.setDate(day);
    if (copy <= date){
        var d = new Date(copy.getFullYear(), copy.getMonth() + 1, day);
        return d;
    } else {
        return copy;
    }
}

function errorHandler(error_type, message){
    SpreadsheetApp.getUi().alert(error_type + ": " + message);
}

function Test(){
    var data = {
      profit:20, 
      start_capital:20000, 
      age:24, 
      period_dates:"25", 
      broker:"БКС", 
      currency:"RUB", 
      desc:"Тест графиков пополнений", 
      goal:1000000, 
      period:"Раз в месяц", 
      term:10, 
      period_topup:10000, 
      name:"Графики"
    };
    newPortfolio2(data);
  }

function Test2(){
    var portfolioTS = new PortfolioSheet("Графики");

    var refillTS = new TableSheet(`График.Платежей.${portfolioTS.name}`, 3, 2);

    portfolioTS.createLineChart(
        [
          `'График.Платежей.${portfolioTS.name}'!B2:B${refillTS.sheet.getLastRow()}`,
          `'График.Платежей.${portfolioTS.name}'!F2:F${refillTS.sheet.getLastRow()}`,
          `'График.Платежей.${portfolioTS.name}'!G2:G${refillTS.sheet.getLastRow()}`,
          `'График.Платежей.${portfolioTS.name}'!I2:I${refillTS.sheet.getLastRow()}`
        ],
        "План роста капитала",
        false,
        Charts.ChartMergeStrategy.MERGE_COLUMNS,
        42,
        8,
        600,
        400
    );
}