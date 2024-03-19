async function printPDF(cart, name, phoneNumber) {
  const { PDFDocument, rgb } = PDFLib;

  const doc = await PDFDocument.create();
  const page = doc.addPage();

  // Print product details with clearer labels and formatting
  let yOffset = page.getHeight() - 90; // Adjust for header content

  page.drawText("Product Details:", {
    x: 50,
    y: yOffset,
    size: 14,
    bold: true,
  });

  yOffset -= 20;

  let totalItemsPrice = 0;

  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.price * item.quantity;
    totalItemsPrice += itemTotalPrice;

    page.drawText(
      `- ${item.name} (${item.quantity} x $${item.price.toFixed(2)})`,
      {
        x: 70,
        y: yOffset,
        size: 12,
      }
    );
    page.drawText(`$${itemTotalPrice.toFixed(2)}`, {
      x: page.getWidth() - 100, // Align price to the right
      y: yOffset,
      size: 12,
      alignment: "right",
    });

    yOffset -= 15;
  }

  // Print total price with a clear label
  page.drawText("Total Price:", {
    x: 50,
    y: yOffset,
    size: 14,
  });
  page.drawText(`$${totalItemsPrice.toFixed(2)}`, {
    x: page.getWidth() - 100, // Align price to the right
    y: yOffset,
    size: 14,
    bold: true,
    alignment: "right",
  });

  // Print customer information
  page.drawText(`Name: ${name}`, {
    x: 50,
    y: yOffset - 40,
    size: 12,
  });

  page.drawText(`Phone Number: ${phoneNumber}`, {
    x: 50,
    y: yOffset - 60,
    size: 12,
  });

  // Save and download the PDF document
  const pdfBytes = await doc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "shopping_receipt.pdf";
  link.click();
}
