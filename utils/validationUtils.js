function validateTableStructure(columns) {
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
    if (!columns.includes(field)) {
      throw new Error(`Missing mandatory field: ${field}`);
    }
  });
}

module.exports = { validateTableStructure };
