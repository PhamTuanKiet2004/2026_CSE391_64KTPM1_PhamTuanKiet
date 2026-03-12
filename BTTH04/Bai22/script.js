// ==========================================
// CẤU HÌNH DỮ LIỆU VÀ TIỆN ÍCH
// ==========================================
const prices = {
    "ao_thun": 150000,
    "quan_jean": 250000,
    "giay_the_thao": 500000
};

function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(fieldId + "-error");
    if (input) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
    }
    if (errorSpan) errorSpan.innerText = message;
}

function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(fieldId + "-error");
    if (input) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
    }
    if (errorSpan) errorSpan.innerText = "";
}

// ==========================================
// CÁC HÀM VALIDATE
// ==========================================

function validateProduct() {
    const product = document.getElementById("product").value;
    if (product === "") {
        showError("product", "Vui lòng chọn sản phẩm.");
        return false;
    }
    clearError("product");
    return true;
}

function validateQuantity() {
    const qtyInput = document.getElementById("quantity").value;
    const qty = Number(qtyInput);
    
    if (qtyInput === "") {
        showError("quantity", "Vui lòng nhập số lượng.");
        return false;
    } else if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
        showError("quantity", "Số lượng phải là số nguyên từ 1 đến 99.");
        return false;
    }
    clearError("quantity");
    return true;
}

function validateDate() {
    const dateInput = document.getElementById("delivery_date").value;
    if (dateInput === "") {
        showError("delivery_date", "Vui lòng chọn ngày giao hàng.");
        return false;
    }

    // Xử lý ngày tháng để so sánh
    const selectedDate = new Date(dateInput);
    selectedDate.setHours(0, 0, 0, 0); // Đưa về 0h để so sánh chính xác ngày

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30); // Ngày tối đa là hôm nay + 30 ngày

    if (selectedDate.getTime() < today.getTime()) {
        showError("delivery_date", "Ngày giao hàng không được ở trong quá khứ.");
        return false;
    } else if (selectedDate.getTime() > maxDate.getTime()) {
        showError("delivery_date", "Chỉ hỗ trợ giao hàng trong vòng 30 ngày tới.");
        return false;
    }

    clearError("delivery_date");
    return true;
}

function validateAddress() {
    const address = document.getElementById("address").value.trim();
    if (address === "") {
        showError("address", "Vui lòng nhập địa chỉ giao hàng.");
        return false;
    } else if (address.length < 10) {
        showError("address", "Địa chỉ quá ngắn (cần ít nhất 10 ký tự).");
        return false;
    }
    clearError("address");
    return true;
}

function validatePayment() {
    const paymentOptions = document.getElementsByName("payment");
    let isChecked = false;
    for (let radio of paymentOptions) {
        if (radio.checked) {
            isChecked = true;
            break;
        }
    }
    if (!isChecked) {
        document.getElementById("payment-error").innerText = "Vui lòng chọn phương thức thanh toán.";
        return false;
    }
    document.getElementById("payment-error").innerText = "";
    return true;
}

function validateNotes() {
    const notes = document.getElementById("notes").value;
    if (notes.length > 200) {
        showError("notes", "Ghi chú không được vượt quá 200 ký tự.");
        return false;
    }
    // Ghi chú không bắt buộc, nên nếu < 200 ký tự là hợp lệ
    clearError("notes"); 
    return true;
}

// ==========================================
// XỬ LÝ TÍNH TOÁN & ĐẾM KÝ TỰ REALTIME
// ==========================================

function calculateTotal() {
    const productVal = document.getElementById("product").value;
    const qtyVal = Number(document.getElementById("quantity").value);
    const display = document.getElementById("totalPriceDisplay");

    if (productVal && prices[productVal] && qtyVal > 0 && qtyVal <= 99) {
        const total = prices[productVal] * qtyVal;
        // Dùng toLocaleString để format tiền tệ (VD: 150000 -> 150.000)
        display.innerText = total.toLocaleString("vi-VN") + " VNĐ";
    } else {
        display.innerText = "0 VNĐ";
    }
}

// Lắng nghe sự kiện để tính tiền ngay lập tức
document.getElementById("product").addEventListener("change", function() {
    validateProduct();
    calculateTotal();
});

document.getElementById("quantity").addEventListener("input", function() {
    clearError("quantity");
    calculateTotal();
});
document.getElementById("quantity").addEventListener("blur", validateQuantity);

// Đếm ký tự cho ghi chú
document.getElementById("notes").addEventListener("input", function() {
    const currentLength = this.value.length;
    const charCountSpan = document.getElementById("charCount");
    charCountSpan.innerText = `${currentLength}/200`;

    if (currentLength > 200) {
        charCountSpan.classList.remove("text-muted");
        charCountSpan.classList.add("text-danger");
        validateNotes(); // Hiển thị lỗi ngay lập tức
    } else {
        charCountSpan.classList.remove("text-danger");
        charCountSpan.classList.add("text-muted");
        clearError("notes");
    }
});

// Gắn sự kiện blur/input cho các trường còn lại
const fields = [
    { id: "delivery_date", validator: validateDate },
    { id: "address", validator: validateAddress }
];
fields.forEach(f => {
    const el = document.getElementById(f.id);
    el.addEventListener("blur", f.validator);
    el.addEventListener("input", () => clearError(f.id));
});

// Radio button thanh toán đổi trạng thái
const paymentRadios = document.getElementsByName("payment");
paymentRadios.forEach(radio => radio.addEventListener("change", validatePayment));


// ==========================================
// XỬ LÝ SUBMIT & CHUYỂN ĐỔI GIAO DIỆN
// ==========================================

document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Dùng toán tử bitwise & để gọi tất cả validate cùng lúc
    const isValid = validateProduct() 
                  & validateQuantity() 
                  & validateDate() 
                  & validateAddress() 
                  & validateNotes() 
                  & validatePayment();

    if (isValid) {
        // Đưa dữ liệu sang bảng Confirm
        const selectEl = document.getElementById("product");
        const productName = selectEl.options[selectEl.selectedIndex].text;
        
        document.getElementById("confProduct").innerText = productName;
        document.getElementById("confQty").innerText = document.getElementById("quantity").value;
        
        // Format lại ngày theo chuẩn DD/MM/YYYY cho đẹp
        const dateRaw = new Date(document.getElementById("delivery_date").value);
        document.getElementById("confDate").innerText = dateRaw.toLocaleDateString("vi-VN");
        
        document.getElementById("confTotal").innerText = document.getElementById("totalPriceDisplay").innerText;

        // Ẩn Form, Hiện Confirm
        document.getElementById("formContainer").classList.add("d-none");
        document.getElementById("confirmContainer").classList.remove("d-none");
    }
});

// Nút Quay lại
document.getElementById("btnCancel").addEventListener("click", function() {
    document.getElementById("confirmContainer").classList.add("d-none");
    document.getElementById("formContainer").classList.remove("d-none");
});

// Nút Xác nhận cuối cùng
document.getElementById("btnConfirm").addEventListener("click", function() {
    document.getElementById("confirmContainer").classList.add("d-none");
    document.getElementById("successMessage").classList.remove("d-none");
});