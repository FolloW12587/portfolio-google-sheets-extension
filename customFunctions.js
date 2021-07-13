/**
 * Get the price of symbol by its id.
 *
 * @param {string} symbol_id The symbol id that you want to get the price of.
 * @return The price of symbol.
 * @customfunction
 */
 function YARDOFFSYMBOL(symbol_id){
    var backendAPI = new BackendAPI();

    var symbols = backendAPI.getSymbolBySymbolId(symbol_id);
    if (symbols.length < 1){
        errorHandler("Ошибка актива", "Указанного актива \""+symbol_id+"\" не существует!");
        return 0;
    }
    var symbol = symbols[0];
    return parseFloat(symbol["price"]);
}

/**
 * Get the price of symbol by its id.
 *
 * @param {string} codes String of the currency codes divided by /. First shows what currency you want to convert, second - what currency to get.
 * @return Float - currency rate first to second.
 * @customfunction
 */
 function YARDOFFCURRENCYRATE(codes){
    const codesArray = codes.split("/");
    if (codesArray.length != 2){
        errorHandler("Ошибка ввода", "Неверно указан входной параметр фукции конвертации валют! Необходимо ввести два кода валют, разделенных /");
        return 0;
    }
    
    var rates = [];
    for (var i in codesArray){
        rates.push(getCurrencyRateToDollar_(codesArray[i]));
    }
    
    var rate = rates[0] / rates[1];
    return rate;
}

function getCurrencyRateToDollar_(code){
    if (code == "USD")
        return 1;
    var backendAPI = new BackendAPI();
    
    var rate = backendAPI.getCurrencyRateByCode(code);
    if (rate.length < 1){
        errorHandler("Ошибка в получении валюты", "Указанную валюту \""+code+"\" не получается найти! Попробуйте проверить корректность написания");
        return 1;
    }
    return rate[0]['rateToDollar'];
}