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