const ExcelJS = require("exceljs");
const validationUtils = require("../utils/validationUtils");

async function parseAndValidateFile(file, invoicingMonth) {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.data);

    const worksheet = workbook.worksheets[0];

    // Перевірка на відповідність місяця вказаному invoicingMonth
    const firstCell = worksheet.getCell("A1");
    const fileInvoicingMonth = firstCell.value;

    if (fileInvoicingMonth !== invoicingMonth) {
      throw new Error("Invoicing month mismatch");
    }

    validationUtils.validateTableStructure(columns);

    const currencyRates = {};
    columnsRow.eachCell({ includeEmpty: true }, function (cell, colNumber) {
      const columnName = columns[colNumber];
      if (columnName.endsWith("Rate")) {
        const currency = columnName.split(" ")[0]; // Валюта в заголовку
        currencyRates[currency] = cell.value;
      }
    });

    const data = [];
    let emptyCustomerCellsCount = 0;

    let rowIndex = 6;
    while (emptyCustomerCellsCount < 3) {
      const row = worksheet.getRow(rowIndex);
      const rowData = {};
      let isRowEmpty = true;
      row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
        const columnName = columns[colNumber];
        if (columnName) {
          rowData[columnName] = cell.value;
          if (columnName === "Customer" && cell.value) {
            isRowEmpty = false;
            emptyCustomerCellsCount = 0;
          }
        }
      });

      if (isRowEmpty) {
        emptyCustomerCellsCount += 1;
      } else if (!isRowEmpty && Object.keys(rowData).length > 0) {
        data.push(rowData);
      }

      rowIndex++;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

module.exports = { parseAndValidateFile };
