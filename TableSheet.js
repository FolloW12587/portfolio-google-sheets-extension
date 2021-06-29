TEMPLATE_URL = "https://docs.google.com/spreadsheets/d/1BOdtjztnjySzfZYL8TCwv7_JfFRpXauq37Yru5dJtl0/edit#gid=953649761";

class TableSheet{
    constructor(name, data_starts=2, header_at=1){
        this.name = name;
        this.sheet = this.getSheet();
        this.header_at = header_at;
        this.data_starts = data_starts;
        this.columns = {};
        this.getColumns();
    }
}

TableSheet.prototype.getSheet = function(){
    var sheet = SpreadsheetApp.getActive().getSheetByName(this.name);
    if (sheet != null){
        return sheet;
    } else {
        return this.createSheet(this.name);
    }
}

TableSheet.prototype.createSheet = function(name){
    var ss = SpreadsheetApp.openByUrl(TEMPLATE_URL);
    var templateSheet = ss.getSheetByName(this.name);
    var sheet = templateSheet.copyTo(SpreadsheetApp.getActive());
    sheet.setName(name);
    return sheet;
}

TableSheet.prototype.rename = function(new_name){
    this.name = new_name;
    this.sheet.setName(this.name);
}

TableSheet.prototype.getColumns = function(){
    var col_count = this.sheet.getLastColumn();
    var names = this.sheet.getSheetValues(this.header_at, 1, 1, col_count)[0];
    for (var i = 0; i < names.length; i ++){
        this.columns[names[i]] = i;
    }
}

TableSheet.prototype.getData = function() {  
    var rows_count = this.getLastRow();
    var columns_count = this.sheet.getLastColumn();
    return this.sheet.getRange(this.data_starts, 1, rows_count, columns_count).getValues();
}

TableSheet.prototype.setValue = function(row_i, col_i, value, note=undefined){
    var range = this.sheet.getRange(row_i, col_i);
    range.setValue(value);
    if (note !== undefined)
        range.setNote(note);
}

TableSheet.prototype.appendRow = function(data){
    var last_row = this.getLastRow() + 1;
    this.updateRow(data, last_row);
    return last_row;
}

TableSheet.prototype.updateRow = function(data, row_i){
    for (var column_name in data){
        var index = this.columns[column_name] + 1;
        this.setValue(row_i, index, data[column_name]);
    }
}

TableSheet.prototype.getLastRow = function(){
    var last_row = this.sheet.getLastRow();
    if (last_row < this.data_starts){
        return this.data_starts - 1;
    } else {
        return last_row;
    }
}


class PortfolioSheet extends TableSheet{
    constructor(name, data_starts=51, header_at=49){
        super(name, data_starts, header_at);
    }
}

PortfolioSheet.prototype.getLastRow = function(){
    const strToFind = "Деньги";
    const cell = this.sheet.createTextFinder(strToFind).findNext();
    return cell.getRow() - 2;
}

PortfolioSheet.prototype.getData = function() {  
    const rows_count = this.getLastRow() - this.data_starts + 1;
    if (rows_count = 0)
        return [];
    const columns_count = this.sheet.getLastColumn();
    return this.sheet.getRange(this.data_starts, 1, rows_count, columns_count).getValues();
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
    
    const columns = ["Доля", "Инвестировано", "Текущая стоимость", "P/L текущий, $", "P/L текущий, %"];
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
        "Доля": "=R[0]C[5]/(R50C11+R53C11)",
        "Инвестировано": "=R[0]C[1]*R[0]C[2]", 
        "Текущая стоимость": "=R[0]C[-3]*R[0]C[-1]", 
        "P/L текущий, $": "=R[0]C[-1]-R[0]C[-5]", 
        "P/L текущий, %": "=R[0]C[-2]/R[0]C[-6]-1"
    };
    this.updateRow(data, this.data_starts);
}

PortfolioSheet.prototype.createHeaderFormulas = function(){
    var data = {
        "Доля": "=SUM(R[1]C[0]:R[8]C[0])",
        "Инвестировано": "=SUM(R[1]C[0]:R[2]C[0])", 
        "Текущая стоимость": "=SUM(R[1]C[0]:R[2]C[0])", 
        "P/L текущий, $": "=SUM(R[1]C[0])", 
        "P/L текущий, %": "=R[0]C[-2]/R[0]C[-6]-1",
        "Прибыль закрытия": "=SUM(R[1]C[0]:R[2]C[0])",
        "Объем закрытых": "=SUM(R[1]C[0]:R[2]C[0])"
    };
    this.updateRow(data, this.data_starts-1);
}

PortfolioSheet.prototype.createDiversificationFormulas = function(){
    var formulas = [
        ["=sumproduct(R51C[5]:R52C[5];(R[0]C[-2]=R51C[13]:R52C[13]))"], 
        ["=sumproduct(R51C[5]:R52C[5];(R[0]C[-2]=R51C[13]:R52C[13]))"], 
        ["=sumproduct(R51C[5]:R52C[5];(R[0]C[-2]=R51C[13]:R52C[13]))"], 
        ["=sumproduct(R51C[5]:R52C[5];(R[0]C[-2]=R51C[13]:R52C[13]))"], 
        ["=sumproduct(R51C[5]:R52C[5];(R[0]C[-2]=R51C[14]:R52C[14]))"], 
        ["=sumproduct(R51C[5]:R52C[5];(R[0]C[-2]=R51C[14]:R52C[14]))"], 
        ["=sumproduct(R51C[5]:R52C[5];(R[0]C[-2]=R51C[15]:R52C[15]))"], 
        ["=sumproduct(R51C[5]:R52C[5];(R[0]C[-2]=R51C[15]:R52C[15]))"], 
        ["=sumproduct(R51C[5]:R52C[5];(R[0]C[-2]=R51C[15]:R52C[15]))"], 
        ["=sumproduct(R51C[5]:R52C[5];(R[0]C[-2]=R51C[15]:R52C[15]))"]
    ];

    var range = this.sheet.getRange("F33:F42");
    range.setValues(formulas);
}