TEMPLATE_URL = "https://docs.google.com/spreadsheets/d/1BOdtjztnjySzfZYL8TCwv7_JfFRpXauq37Yru5dJtl0/edit#gid=953649761";

class TableSheet{
    constructor(name){
        this.name = name;
        this.sheet = this.getSheet();
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

TableSheet.prototype.getColumns = function(){
    var col_count = this.sheet.getLastColumn();
    var names = this.sheet.getSheetValues(2, 1, 1, col_count)[0];
    for (var i = 0; i < names.length; i ++){
        this.columns[names[i]] = i;
    }
}

TableSheet.prototype.getData = function () {  
    var rows_count = this.sheet.getLastRow();
    var columns_count = this.sheet.getLastColumn();
    return this.sheet.getRange(3, 1, rows_count, columns_count).getValues();
}

TableSheet.prototype.setValue = function(row_i, col_i, value, note=undefined){
    var range = this.sheet.getRange(row_i, col_i);
    range.setValue(value);
    if (note !== undefined)
        range.setNote(note);
}

TableSheet.prototype.appendRow = function(data){
    var last_row = this.sheet.getLastRow() + 1;
    this.updateRow(data, last_row);
    return last_row;
}

TableSheet.prototype.updateRow = function(data, row_i){
    for (var column_name in data){
        var index = this.columns[column_name] + 1;
        this.setValue(row_i, index, data[column_name]);
    }
}


// class PortfolioSheet extends TableSheet{
//     constructor(name){
//         super(name);
//     }
// }

// PortfolioSheet.prototype.createSheet = function(){

// }