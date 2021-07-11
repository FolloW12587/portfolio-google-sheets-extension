function getSymbols(ticker){
    var backendAPI = new BackendAPI();
    return backendAPI.getSymbolsByTicker(ticker);
}

function getSymbolTypes(){
    var backendAPI = new BackendAPI();
    return backendAPI.getSymbolTypes();
}

function getCountries(){
    var backendAPI = new BackendAPI();
    return backendAPI.getCountries();
}

function getEconomySectors(){
    var backendAPI = new BackendAPI();
    return backendAPI.getEconomySectors();
}

function getSymbolTypesDiversifications(){
    var backendAPI = new BackendAPI();
    return backendAPI.getSymbolTypesDiversifications();
}

function getCountryDiversifications(){
    var backendAPI = new BackendAPI();
    return backendAPI.getCountryDiversifications();
}

function getEconomySectorDiversifications(){
    var backendAPI = new BackendAPI();
    return backendAPI.getEconomySectorDiversifications();
}