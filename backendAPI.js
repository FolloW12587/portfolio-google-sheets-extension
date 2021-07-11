

class BackendAPI{
    constructor(){
        this.url = `${BACKENDHOST}/quotes/`;  
    }

    getSymbolsByTicker(ticker){
        var endpoint = "symbol";
        var data = "ticker=" + encodeURIComponent(ticker);

        var response = this.makeRequest(endpoint, data);
        if (response.getResponseCode() !== 200){
            errorHandler("Can't connect to server", response.getContextText());
            return;
        }

        return JSON.parse(response.getContextText());
    }

    getSymbolBySymbolId(symbol_id){
        var endpoint = "symbol";
        var data = "symbolId=" + encodeURIComponent(symbol_id);

        var response = this.makeRequest(endpoint, data);
        if (response.getResponseCode() !== 200){
            errorHandler("Can't connect to server", response.getContextText());
            return;
        }

        return JSON.parse(response.getContextText());
    }

    getCurrencyRateByCode(code){
        var endpoint = "currency";
        var data = "code=" + encodeURIComponent(code);

        var response = this.makeRequest(endpoint, data);
        if (response.getResponseCode() !== 200){
            errorHandler("Can't connect to server", response.getContextText());
            return;
        }

        return JSON.parse(response.getContextText());
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