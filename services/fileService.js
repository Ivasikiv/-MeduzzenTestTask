const ExcelJS = require("exceljs");
const validationUtils = require("../utils/validationUtils");

function findCurrencyRates(worksheet) {
  const currencyRates = {};

  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
    const currenciesRow = worksheet.getRow(rowNumber);
    const currenciesCount = currenciesRow.actualCellCount;

    for (let colNumber = 2; colNumber <= currenciesCount; colNumber++) {
      const cellValue = currenciesRow.getCell(colNumber).value;
      const prevCellValue = currenciesRow.getCell(colNumber - 1).value;

      if (
        !isNaN(cellValue) &&
        prevCellValue &&
        prevCellValue.includes("Rate")
      ) {
        const currency = prevCellValue.split(" ")[0];
        currencyRates[currency] = cellValue;
      } else {
        break;
      }
    }
  }

  return currencyRates;
}

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

    const columnsRow = worksheet.getRow(5);
    const columns = [];
    columnsRow.eachCell({ includeEmpty: true }, function (cell, colNumber) {
      columns[colNumber] = cell.value;
    });

    validationUtils.validateTableStructure(columns);

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

    const currencyRates = findCurrencyRates(worksheet);
    return { data, currencyRates };
  } catch (error) {
    throw error;
  }
}

module.exports = { parseAndValidateFile };
