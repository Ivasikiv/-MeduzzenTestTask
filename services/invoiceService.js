async function processInvoices(data) {
  try {
    const currencyRates = {
      USD: data[0]["USD Rate"],
      EUR: data[0]["EUR Rate"],
      GBP: data[0]["GBP Rate"],
    };

    data.shift();

    const invoicesData = [];
    data.forEach((row) => {
      const invoice = {};

      if (row["Status"] !== "Ready" && !row["Invoice #"]) {
        return;
      }

      Object.keys(row).forEach((key) => {
        invoice[key] = row[key];
      });

      const totalPrice = parseFloat(row["Total Price"]);
      const invoiceCurrency = row["Invoice Currency"];
      const currencyRate = currencyRates[invoiceCurrency];

      const invoiceTotal = totalPrice * currencyRate;
      invoice["Invoice Total"] = invoiceTotal;

      // Валідація рахунку
      const validationErrors = validateInvoice(row);
      invoice["validationErrors"] = validationErrors;

      invoicesData.push(invoice);
    });

    const invoicingMonth = data[0]["InvoicingMonth"];

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

  // В процесі

  return validationErrors;
}

module.exports = { processInvoices };
