function onOpen(){
    var ui = SpreadsheetApp.getUi();
    ui.createAddonMenu()
        .addItem("Добавить портфель", "newPortfolio")
        .addToUi()
}


function newPortfolio(){
    var html = HtmlService.createHtmlOutputFromFile('createPortfolio')
        .setWidth(400)
        .setHeight(300);
    SpreadsheetApp.getUi()
        .showModalDialog(html, 'Создать портфель');
}

function errorHandler(error_type, message){
    alert(error_type + ": " + message);
}