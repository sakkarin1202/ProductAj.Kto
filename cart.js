document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const cartIcon = document.getElementById("cart-icon");
  const cartItemsList = document.getElementById("cart-items");
  const cartModal = document.getElementById("cart-modal");
  const closeModalBtn = document.querySelector(".close");
  let cartTotalPrice = 0;
  const cartItems = {}; // จัดเก็บรายการตามรหัสผลิตภัณฑ์

  // อัปเดตจํานวนตะกร้า
  function updateCartCount(count) {
    cartIcon.setAttribute("data-count", count);
  }

  // อัพเดทราคา
  function updateTotalPrice(price) {
    cartTotalPrice += price;
  }

  // เพิ่มหรืออัปเดตรายการในตะกร้า
  function addItemToCart(product, price) {
    if (cartItems[product]) {
      cartItems[product].price += price;
      cartItems[product].quantity++;
    } else {
      cartItems[product] = {
        name: product,
        price,
        quantity: 1,
      };
    }

    // อัปเดตรายการในตะกร้าและราคารวม
    updateTotalPrice(price);
    displayCartItems();
  }

  function removeItemFromCart(productId, event) {
    if (cartItems[productId] && event.target.classList.contains("remove")) {
      let removedItem = cartItems[productId];
      let removedPrice = removedItem.price * removedItem.quantity;

      // ลบรายการออกจากตะกร้า
      delete cartItems[productId];

      // อัปเดตรายการในตะกร้าและราคารวม
      updateTotalPrice(-removedPrice);
      displayCartItems();
    }
  }
  // แสดงรายการสินค้าและราคารวมใหม่ในตะกร้า
  function displayCartItems() {
    cartItemsList.innerHTML = ""; // Clear existing items
    let total = 0;
    for (const [productId, item] of Object.entries(cartItems)) {
      const itemTotalPrice = item.price * item.quantity;
      total += itemTotalPrice;

      const listItem = document.createElement("li");
      listItem.textContent = `${item.name}: ${
        item.quantity
      } x $${item.price.toFixed(2)} = $${itemTotalPrice.toFixed(2)}`;
      listItem.setAttribute("data-product-id", productId);

      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.classList.add("remove");

      removeButton.addEventListener("click", function (event) {
        removeItemFromCart(productId, event);
      });

      listItem.appendChild(removeButton);
      cartItemsList.appendChild(listItem);
    }

    // แสดงราคารวมใหม่
    const totalPriceElement = document.createElement("h3");
    totalPriceElement.textContent = `Total Price of Items: $${total.toFixed(
      2
    )}`;
    cartItemsList.appendChild(totalPriceElement);
  }

  // พิมพ์ใบเสร็จเมื่อคลิกปุ่มพิมพ์
  document.addEventListener("click", function (event) {
    if (
      Object.keys(cartItems).length > 0 &&
      event.target.classList.contains("print-receipt")
    ) {
      let customerName = prompt("Please enter your name:");
      let customerPhoneNumber = prompt("Please enter your phone number:");

      // ตรวจสอบอินพุต
      while (!customerName || !customerPhoneNumber) {
        alert("Please enter valid name and phone number.");
        customerName = prompt("Please enter your name:");
        customerPhoneNumber = prompt("Please enter your phone number:");
      }

      printPDF(cartItems, customerName, customerPhoneNumber);
    }
  });

  // เพิ่มการตรวจจับเหตุการณ์ (event listener) ลงในทุกๆ ปุ่ม "Add to Cart"
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // เพิ่มจำนวนรายการสินค้าในตะกร้าสินค้า
      let currentCount = parseInt(cartIcon.getAttribute("data-count"));
      currentCount++;
      updateCartCount(currentCount);

      //ดึงข้อมูลเกี่ยวกับสินค้าที่ผู้ใช้เลือกหรือเพิ่มเข้าไปในตะกร้าสินค้า
      const product = button.parentElement.querySelector("h3").textContent;
      const price = parseFloat(
        button.parentElement.querySelector(".price").textContent
      );

      // เพิ่มไอเทมไปที่ตะกร้า
      addItemToCart(product, price);
      updateTotalPrice(price);
      displayCartItems();

      // โชว์ว่าเพิ่มสำเร็จแล้ว
      alert("Product added to cart successfully!");
    });
  });

  // แสดงตัวโมดัลหรือหน้าต่างขึ้นมาเมื่อผู้ใช้คลิกที่ไอคอนของตะกร้าสินค้า
  cartIcon.addEventListener("click", function () {
    cartModal.style.display = "block";
  });

  // ปิดหรือซ่อนโมดัลหรือหน้าต่างที่ถูกแสดงขึ้นมาเมื่อผู้ใช้คลิกที่ปุ่มปิด
  closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
  });

  // การสั่งพิมพ์ใบเสร็จเมื่อผู้ใช้คลิกที่ปุ่มพิมพ์
  document.addEventListener("click", function (event) {
    if (
      Object.keys(cartItems).length > 0 &&
      event.target.classList.contains("print-receipt")
    ) {
      let customerName = prompt("Please enter your name:");
      let customerPhoneNumber = prompt("Please enter your phone number:");

      //ตรวจสอบข้อมูลที่ผู้ใช้ป้อนเข้ามาเพื่อให้แน่ใจว่าข้อมูลนั้นถูกต้องตามเงื่อนไขที่กำหนดไว้

      while (!customerName || !customerPhoneNumber) {
        alert("Please enter valid name and phone number.");
        customerName = prompt("Please enter your name:");
        customerPhoneNumber = prompt("Please enter your phone number:");
      }

      printPDF(cartItems, customerName, customerPhoneNumber);
    }
  });
});
