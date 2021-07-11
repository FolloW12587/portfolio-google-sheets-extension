

class BackendAPI{
    constructor(){
        this.url = `${BACKENDHOST}/quotes/`;  
    }

    getSymbolsByTicker(ticker){
        var endpoint = "symbol";
        var data = "ticker=" + encodeURIComponent(ticker);

        var response = this.makeRequest(endpoint, data);
        if (response.getResponseCode() !== 200){
            errorHandler("Can't connect to server", response.getContentText());
            return;
        }

        return JSON.parse(response.getContentText());
    }

    getSymbolBySymbolId(symbol_id){
        var endpoint = "symbol";
        var data = "symbolId=" + encodeURIComponent(symbol_id);

        var response = this.makeRequest(endpoint, data);
        if (response.getResponseCode() !== 200){
            errorHandler("Can't connect to server", response.getContentText());
            return;
        }

        return JSON.parse(response.getContentText());
    }

    getCurrencyRateByCode(code){
        var endpoint = "currency";
        var data = "code=" + encodeURIComponent(code);

        var response = this.makeRequest(endpoint, data);
        if (response.getResponseCode() !== 200){
            errorHandler("Can't connect to server", response.getContentText());
            return;
        }

        return JSON.parse(response.getContentText());
    }

    getSymbolTypes(){
        var endpoint = "portfolio_symbol_type";

        var response = this.makeRequest(endpoint);
        if (response.getResponseCode() !== 200){
            errorHandler("Can't connect to server", response.getContentText());
            return;
        }

        return JSON.parse(response.getContentText());
    }

    getCountries(){
        var endpoint = "country";

        var response = this.makeRequest(endpoint);
        if (response.getResponseCode() !== 200){
            errorHandler("Can't connect to server", response.getContentText());
            return;
        }

        return JSON.parse(response.getContentText());
    }

    getEconomySectors(){
        var endpoint = "economy_sector";

        var response = this.makeRequest(endpoint);
        if (response.getResponseCode() !== 200){
            errorHandler("Can't connect to server", response.getContentText());
            return;
        }

        return JSON.parse(response.getContentText());
    }

    getSymbolTypesDiversifications(){
        var endpoint = "symbol_type_diversification";

        var response = this.makeRequest(endpoint);
        if (response.getResponseCode() !== 200){
            errorHandler("Can't connect to server", response.getContentText());
            return;
        }

        return JSON.parse(response.getContentText());
    }

    getCountryDiversifications(){
        var endpoint = "country_diversification";

        var response = this.makeRequest(endpoint);
        if (response.getResponseCode() !== 200){
            errorHandler("Can't connect to server", response.getContentText());
            return;
        }

        return JSON.parse(response.getContentText());
    }

    getEconomySectorDiversifications(){
        var endpoint = "economy_sector_diversification";

        var response = this.makeRequest(endpoint);
        if (response.getResponseCode() !== 200){
            errorHandler("Can't connect to server", response.getContentText());
            return;
        }

        return JSON.parse(response.getContentText());
    }

    makeRequest(endpoint, data=null, method="GET"){
        var options = {
            "method": method,
            "contentType": "application/json",
            "muteHttpExceptions": true
        };

        var url = this.url + endpoint;
        if (data != null && method == "POST")
            options["payload"] = JSON.stringify(data)
        else if (data != null && method == "GET"){
            url += '?' + data
        }

        return UrlFetchApp.fetch(url, options);
    }
}