async function processInvoices(data, currencyRates) {
  try {
    const invoicesData = [];
    data.forEach((row, index) => {
      const invoice = {};

      if (row["Status"] !== "Ready" && !row["Invoice #"]) {
        return;
      }

      Object.keys(row).forEach((key) => {
        invoice[key] = row[key];
      });

      const totalPrice = parseFloat(row["Total Price"]);
      if (!isNaN(totalPrice)) {
        const invoiceCurrency = row["Invoice Currency"];
        const currencyRate = currencyRates[invoiceCurrency];

        const invoiceTotal = totalPrice * currencyRate;
        invoice["Invoice Total"] = invoiceTotal.toFixed(2);
      } else {
        invoice["Invoice Total"] = null;
      }

      const validationErrors = validateInvoice(row);
      invoice["validationErrors"] = validationErrors;

      invoicesData.push(invoice);
    });

    const invoicingMonth = data[1]["InvoicingMonth"];

    return {
      InvoicingMonth: invoicingMonth,
      currencyRates: currencyRates,
      invoicesData: invoicesData,
    };
  } catch (error) {
    throw error;
  }
}

function validateInvoice(invoice) {
  const validationErrors = [];

  const mandatoryFields = [
    "Customer",
    "Cust No'",
    "Project Type",
    "Quantity",
    "Price Per Item",
    "Item Price Currency",
    "Total Price",
    "Invoice Currency",
    "Status",
  ];
  mandatoryFields.forEach((field) => {
    if (!invoice[field]) {
      validationErrors.push(`Missing mandatory field: ${field}`);
    }
  });

  if (typeof invoice["Quantity"] !== "number" || invoice["Quantity"] <= 0) {
    validationErrors.push("Quantity must be a positive number");
  }
  if (
    typeof invoice["Price Per Item"] !== "number" ||
    invoice["Price Per Item"] <= 0
  ) {
    validationErrors.push("Price Per Item must be a positive number");
  }
  if (
    typeof invoice["Total Price"] !== "number" ||
    invoice["Total Price"] < 0
  ) {
    validationErrors.push("Total Price must be a non-negative number");
  }

  return validationErrors;
}

module.exports = { processInvoices };
