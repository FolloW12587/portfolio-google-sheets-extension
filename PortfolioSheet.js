
class PortfolioSheet extends TableSheet{
    constructor(name, data_starts=7, header_at=5){
        super(name, data_starts, header_at);
    }
}

PortfolioSheet.prototype.getLastRow = function(){
    const strToFind = "Деньги";
    const cell = this.sheet.createTextFinder(strToFind).findNext();
    return cell.getRow() - 2;
}

PortfolioSheet.prototype.getAmountStarts = function(){
    return this.getLastRow() + 3;
}

PortfolioSheet.prototype.getData = function() {  
    const rows_count = this.getLastRow() - this.data_starts + 1;
    if (rows_count == 0)
        return [];
    const columns_count = this.sheet.getLastColumn();
    return this.sheet.getRange(this.data_starts, 1, rows_count, columns_count).getValues();
}

PortfolioSheet.prototype.getAmountData = function() {  
    const amounts_starts = this.getAmountStarts();

    const columns_count = this.sheet.getLastColumn();
    return this.sheet.getRange(amounts_starts, 1, 3, columns_count).getValues();
}

PortfolioSheet.prototype.appendRow = function(data){
    const last_row = this.getLastRow();
    this.sheet.insertRowBefore(last_row+1);
    data[''] = last_row - this.data_starts + 2;
    this.updateRow(data, last_row + 1);
    this.updateFormulas(last_row + 1);
    return last_row + 1;
}

PortfolioSheet.prototype.updateFormulas = function(row_index){
    if (row_index == this.data_starts){
        this.createFormulas();
        return;
    }
    
    const columns = ["Доля", "Инвестировано", "Текущая стоимость", "P/L текущий, $", "P/L текущий, %", "Прибыль закрытия", "Объем закрытых"];
    for (var i in columns){
        const column = columns[i];
        const sourceRange = this.sheet.getRange(this.data_starts, this.columns[column] + 1, row_index - this.data_starts);
        const newRange = this.sheet.getRange(this.data_starts, this.columns[column] + 1, row_index - this.data_starts + 1);
        sourceRange.autoFill(newRange, SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);
    }
}

PortfolioSheet.prototype.createFormulas = function(){
    this.createRowFormulas();
    this.createHeaderFormulas();
    this.createDiversificationFormulas();
}

PortfolioSheet.prototype.createRowFormulas = function(){
    var data = {
        "Доля": "=R[0]C"+(this.columns['Текущая стоимость']+1)+"/(R"+(this.data_starts-1)+"C"+(this.columns['Текущая стоимость']+1)+"+R"+(this.data_starts+2)+"C"+(this.columns['Текущая стоимость']+1)+")",
        "Инвестировано": "=R[0]C"+(this.columns['Кол-во акций']+1)+"*R[0]C"+(this.columns['Цена входа']+1), 
        "Текущая стоимость": "=R[0]C"+(this.columns['Кол-во акций']+1)+"*R[0]C"+(this.columns['Цена рыночная']+1), 
        "P/L текущий, $": "=R[0]C"+(this.columns['Текущая стоимость']+1)+"-R[0]C"+(this.columns['Инвестировано']+1), 
        "P/L текущий, %": "=R[0]C"+(this.columns['Текущая стоимость']+1)+"/R[0]C"+(this.columns['Инвестировано']+1)+"-1",
        "Прибыль закрытия": "=R[0]C"+(this.columns['Кол-во закрытых']+1)+"*(R[0]C"+(this.columns['Цена Закрытия']+1)+"-R[0]C"+(this.columns['Цена входа']+1)+")",
        "Объем закрытых": "=R[0]C"+(this.columns['Цена Закрытия']+1)+"*R[0]C"+(this.columns['Кол-во закрытых']+1)
    };
    this.updateRow(data, this.data_starts);
}

PortfolioSheet.prototype.createHeaderFormulas = function(){
    var data = {
        "Доля": "=SUM(R[1]C[0]:R[7]C[0])",
        "Инвестировано": "=SUM(R[1]C[0]:R[2]C[0])", 
        "Текущая стоимость": "=SUM(R[1]C[0]:R[2]C[0])", 
        "P/L текущий, $": "=SUM(R[1]C[0])", 
        "P/L текущий, %": "=R[0]C"+(this.columns['Текущая стоимость']+1)+"/R[0]C"+(this.columns['Инвестировано']+1)+"-1",
        "Прибыль закрытия": "=SUM(R[1]C[0]:R[2]C[0])",
        "Объем закрытых": "=SUM(R[1]C[0]:R[2]C[0])"
    };
    this.updateRow(data, this.header_at+1);
}

PortfolioSheet.prototype.createDiversificationFormulas = function(){
    var formulas = [
        ["=sumproduct(R"+this.data_starts+"C"+(this.columns['Текущая стоимость']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Текущая стоимость']+1)+";(R[0]C[-2]=R"+this.data_starts+"C"+(this.columns['Тип']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Тип']+1)+"))"], 
        ["=sumproduct(R"+this.data_starts+"C"+(this.columns['Текущая стоимость']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Текущая стоимость']+1)+";(R[0]C[-2]=R"+this.data_starts+"C"+(this.columns['Тип']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Тип']+1)+"))"], 
        ["=sumproduct(R"+this.data_starts+"C"+(this.columns['Текущая стоимость']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Текущая стоимость']+1)+";(R[0]C[-2]=R"+this.data_starts+"C"+(this.columns['Тип']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Тип']+1)+"))"], 
        ["=sumproduct(R"+this.data_starts+"C"+(this.columns['Текущая стоимость']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Текущая стоимость']+1)+";(R[0]C[-2]=R"+this.data_starts+"C"+(this.columns['Тип']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Тип']+1)+"))"], 
        ["=sumproduct(R"+this.data_starts+"C"+(this.columns['Текущая стоимость']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Текущая стоимость']+1)+";(R[0]C[-2]=R"+this.data_starts+"C"+(this.columns['Страна']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Страна']+1)+"))"], 
        ["=sumproduct(R"+this.data_starts+"C"+(this.columns['Текущая стоимость']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Текущая стоимость']+1)+";(R[0]C[-2]=R"+this.data_starts+"C"+(this.columns['Страна']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Страна']+1)+"))"], 
        ["=sumproduct(R"+this.data_starts+"C"+(this.columns['Текущая стоимость']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Текущая стоимость']+1)+";(R[0]C[-2]=R"+this.data_starts+"C"+(this.columns['Сектор']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Сектор']+1)+"))"], 
        ["=sumproduct(R"+this.data_starts+"C"+(this.columns['Текущая стоимость']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Текущая стоимость']+1)+";(R[0]C[-2]=R"+this.data_starts+"C"+(this.columns['Сектор']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Сектор']+1)+"))"], 
        ["=sumproduct(R"+this.data_starts+"C"+(this.columns['Текущая стоимость']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Текущая стоимость']+1)+";(R[0]C[-2]=R"+this.data_starts+"C"+(this.columns['Сектор']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Сектор']+1)+"))"], 
        ["=sumproduct(R"+this.data_starts+"C"+(this.columns['Текущая стоимость']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Текущая стоимость']+1)+";(R[0]C[-2]=R"+this.data_starts+"C"+(this.columns['Сектор']+1)+":R"+(this.data_starts+1)+"C"+(this.columns['Сектор']+1)+"))"]
    ];

    var range = this.sheet.getRange("F29:F38");
    range.setValues(formulas);
}

PortfolioSheet.prototype.getPortfolioAmount = function(){
    var data = this.getAmountData();

    var output = [];
    for (var i in data){
        var currencyRow = data[i];
        var currencyData = {
            "code": currencyRow[this.columns["Тикер"]],
            "name": currencyRow[this.columns["Наименование"]],
            "sum": currencyRow[this.columns["Кол-во акций"]],
            "rate": currencyRow[this.columns["Цена рыночная"]],
        };
        output.push(currencyData);
    }
    return output;
}

PortfolioSheet.prototype.topUp = function(data){
    var amountData = this.getAmountData();

    for (var i in amountData){
        if (amountData[i][this.columns["Тикер"]] != data["currency"])
            continue;
        
        var options = {
            "Кол-во акций": amountData[i][this.columns["Кол-во акций"]] + data['amount'],
        };

        if (data['price'] !== undefined){
            options["Цена входа"] = (data['amount']*data['price'] + amountData[i][this.columns['Кол-во акций']]*amountData[i][this.columns['Цена входа']]) / (data['amount'] + amountData[i][this.columns['Кол-во акций']]);
        }
        Logger.log(options);
        Logger.log(this.columns);
        Logger.log(amountData);
        Logger.log(data);
        this.updateRow(options, this.getAmountStarts() + parseInt(i));
        return;
    }
}

PortfolioSheet.prototype.debit = function(data){
    var amountData = this.getAmountData();

    for (var i in amountData){
        if (amountData[i][this.columns["Тикер"]] != data["currency"])
            continue;
        
        var options = {
            "Кол-во акций": amountData[i][this.columns["Кол-во акций"]] - data['amount']
        };

        this.updateRow(options, this.getAmountStarts() + parseInt(i));
        return;
    }
}

PortfolioSheet.prototype.addSymbol = function(data){
    var amountData = this.getAmountData();
    for (var i in amountData){
        if (amountData[i][this.columns["Тикер"]] != data["Валюта"])
            continue;
        
        data['Цена входа'] = data['Цена входа'] * amountData[i][this.columns["Цена рыночная"]];
        data['Цена рыночная'] = `${data['Цена рыночная']}*R${(this.getAmountStarts() + parseInt(i) + 1)}C${(this.columns["Цена рыночная"]+1)}`;
        break;
    }
    
    var tableData = this.getData();
    for (var i in tableData){
        var row = tableData[i];
        if (row[this.columns['ID Символа']] == data['ID Символа']){
            var options = {
                "Кол-во акций": data['Кол-во акций'] + row[this.columns['Кол-во акций']],
                "Цена входа": (data['Кол-во акций']*data['Цена входа'] + row[this.columns['Кол-во акций']]*row[this.columns['Цена входа']]) / (data['Кол-во акций'] + row[this.columns['Кол-во акций']])
            };
            this.updateRow(options, this.data_starts + parseInt(i));
            return;
        }
    }

    this.appendRow(data);
}

PortfolioSheet.prototype.subSymbol = function(data){
    var amountData = this.getAmountData();
    for (var i in amountData){
        if (amountData[i][this.columns["Тикер"]] != data["Валюта"])
            continue;
        
        data['Цена Закрытия'] = data['Цена Закрытия'] * amountData[i][this.columns["Цена рыночная"]];
        break;
    }

    var tableData = this.getData();
    for (var i in tableData){
        var row = tableData[i];
        if (row[this.columns['ID Символа']] == data['ID Символа']){
            var options = {
                "Дата закрытия": new Date(),
                "Кол-во закрытых": data['Кол-во закрытых'] + row[this.columns['Кол-во закрытых']],
                "Цена Закрытия": (data['Кол-во закрытых']*data['Цена Закрытия'] + row[this.columns['Кол-во закрытых']]*row[this.columns['Цена Закрытия']]) / (data['Кол-во закрытых'] + row[this.columns['Кол-во закрытых']]),
                "Кол-во акций": row[this.columns['Кол-во акций']] - data['Кол-во закрытых'],
            };
            this.updateRow(options, this.data_starts + parseInt(i));
            return;
        }
    }
}