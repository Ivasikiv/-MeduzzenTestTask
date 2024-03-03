const fileService = require("../services/fileService");
const invoiceService = require("../services/invoiceService");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file;
    const invoicingMonth = req.body.invoicingMonth;

    const { data, currencyRates } = await fileService.parseAndValidateFile(
      file,
      invoicingMonth
    );

    const result = await invoiceService.processInvoices(data, currencyRates);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
