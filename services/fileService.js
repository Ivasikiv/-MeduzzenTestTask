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

    const columns = worksheet.getRow(5).values;

    // Перевірка структури таблиці
    validationUtils.validateTableStructure(columns);

    const data = [];
    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex > 1) {
        const rowData = {};
        row.eachCell((cell, colIndex) => {
          const columnName = columns[colIndex];
          rowData[columnName] = cell.value;
        });
        data.push(rowData);
      }
    });
    //console.log("data", data);
    return data;
  } catch (error) {
    throw error;
  }
}

module.exports = { parseAndValidateFile };
