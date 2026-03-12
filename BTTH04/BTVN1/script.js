// Sử dụng thuần js
// ==========================================
// 1. CÁC HÀM TIỆN ÍCH (UTILITIES)
// ==========================================

// Hàm hiển thị lỗi
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(fieldId + "-error");
    
    // Nếu là input thông thường (không phải radio/checkbox)
    if (input) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
    }
    
    if (errorSpan) {
        errorSpan.innerText = message;
    }
}

// Hàm xóa lỗi (khi người dùng bắt đầu nhập lại hoặc nhập đúng)
function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(fieldId + "-error");
    
    if (input) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid"); // Hiển thị viền xanh thành công
    }
    
    if (errorSpan) {
        errorSpan.innerText = "";
    }
}

// ==========================================
// 2. CÁC HÀM VALIDATE TỪNG TRƯỜNG
// ==========================================

function validateFullname() {
    const fullname = document.getElementById("fullname").value.trim();
    const regex = /^[a-zA-ZÀ-ỹ\s]+$/;
    
    if (fullname === "") {
        showError("fullname", "Họ và tên không được để trống.");
        return false;
    } else if (fullname.length < 3) {
        showError("fullname", "Họ và tên phải có ít nhất 3 ký tự.");
        return false;
    } else if (!regex.test(fullname)) {
        showError("fullname", "Họ và tên chỉ được chứa chữ cái và khoảng trắng.");
        return false;
    }
    
    clearError("fullname");
    return true;
}

function validateEmail() {
    const email = document.getElementById("email").value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email === "") {
        showError("email", "Email không được để trống.");
        return false;
    } else if (!regex.test(email)) {
        showError("email", "Email không đúng định dạng (VD: name@domain.com).");
        return false;
    }
    
    clearError("email");
    return true;
}

function validatePhone() {
    const phone = document.getElementById("phone").value.trim();
    const regex = /^0[0-9]{9}$/;
    
    if (phone === "") {
        showError("phone", "Số điện thoại không được để trống.");
        return false;
    } else if (!regex.test(phone)) {
        showError("phone", "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0.");
        return false;
    }
    
    clearError("phone");
    return true;
}

function validatePassword() {
    const password = document.getElementById("password").value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    if (password === "") {
        showError("password", "Mật khẩu không được để trống.");
        return false;
    } else if (!regex.test(password)) {
        showError("password", "Mật khẩu phải từ 8 ký tự, gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 số.");
        return false;
    }
    
    clearError("password");
    
    // Nếu mật khẩu thay đổi, cần validate lại trường xác nhận mật khẩu (nếu đã nhập)
    const confirmVal = document.getElementById("confirm_password").value;
    if (confirmVal !== "") validateConfirmPassword();
    
    return true;
}

function validateConfirmPassword() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;
    
    if (confirmPassword === "") {
        showError("confirm_password", "Vui lòng xác nhận mật khẩu.");
        return false;
    } else if (confirmPassword !== password) {
        showError("confirm_password", "Mật khẩu xác nhận không khớp.");
        return false;
    }
    
    clearError("confirm_password");
    return true;
}

function validateGender() {
    const genderMale = document.getElementById("genderMale").checked;
    const genderFemale = document.getElementById("genderFemale").checked;
    
    if (!genderMale && !genderFemale) {
        // Với radio, ta truyền id của nhóm chung (tùy biến theo HTML đã setup)
        document.getElementById("gender-error").innerText = "Vui lòng chọn giới tính.";
        return false;
    }
    
    document.getElementById("gender-error").innerText = "";
    return true;
}

function validateTerms() {
    const terms = document.getElementById("terms").checked;
    
    if (!terms) {
        showError("terms", "Bạn phải đồng ý với điều khoản để tiếp tục.");
        return false;
    }
    
    clearError("terms");
    return true;
}

// ==========================================
// 3. GẮN SỰ KIỆN LẮNG NGHE (EVENT LISTENERS)
// ==========================================

// Gắn sự kiện blur (rời khỏi ô) và input (đang gõ) cho các trường text/password
const fields = [
    { id: "fullname", validator: validateFullname },
    { id: "email", validator: validateEmail },
    { id: "phone", validator: validatePhone },
    { id: "password", validator: validatePassword },
    { id: "confirm_password", validator: validateConfirmPassword }
];

fields.forEach(field => {
    const inputEl = document.getElementById(field.id);
    // Khi rời khỏi trường -> chạy hàm kiểm tra
    inputEl.addEventListener("blur", field.validator);
    // Khi đang gõ -> xóa lỗi ngay lập tức
    inputEl.addEventListener("input", () => clearError(field.id));
});

// Sự kiện cho Radio và Checkbox (dùng 'change' thay vì 'blur'/'input')
document.getElementById("genderMale").addEventListener("change", validateGender);
document.getElementById("genderFemale").addEventListener("change", validateGender);
document.getElementById("terms").addEventListener("change", validateTerms);

// Xử lý khi Submit form
document.getElementById("registerForm").addEventListener("submit", function(event) {
    // 1. Ngăn chặn hành vi gửi form mặc định
    event.preventDefault();
    
    // 2. Gọi tất cả các hàm validate. 
    // Dùng toán tử bitwise '&' để ép tất cả các hàm phải thực thi. 
    // Nếu dùng '&&', JS sẽ dừng lại ở hàm đầu tiên trả về false (Short-circuit evaluation),
    // khiến các trường lỗi phía sau không được hiển thị lỗi.
    const isValid = validateFullname() 
                  & validateEmail() 
                  & validatePhone() 
                  & validatePassword() 
                  & validateConfirmPassword() 
                  & validateGender() 
                  & validateTerms();
                  
    // 3. Xử lý kết quả
    if (isValid) { // isValid sẽ là 1 (true) nếu tất cả đều true, là 0 (false) nếu có 1 lỗi
        // Ẩn form
        document.getElementById("formContainer").classList.add("d-none");
        
        // Hiện thông báo thành công và chèn tên
        const name = document.getElementById("fullname").value;
        document.getElementById("registeredName").innerText = name;
        document.getElementById("successMessage").classList.remove("d-none");
    }
});
// ==========================================
// TÍNH NĂNG NÂNG CẤP (BÀI TẬP VỀ NHÀ 1)
// ==========================================

// 1. Đếm ký tự realtime cho ô Họ và Tên
document.getElementById("fullname").addEventListener("input", function() {
    const currentLength = this.value.length;
    document.getElementById("nameCharCount").innerText = `${currentLength}/50`;
});

// 2. Hiển thị/Ẩn mật khẩu (Toggle Password)
document.getElementById("togglePassword").addEventListener("click", function() {
    const pwdInput = document.getElementById("password");
    
    // Kiểm tra type hiện tại: nếu là password thì đổi thành text, và ngược lại
    if (pwdInput.type === "password") {
        pwdInput.type = "text";
        this.innerText = "🙈"; // Đổi icon sang nhắm mắt
    } else {
        pwdInput.type = "password";
        this.innerText = "👁️"; // Đổi icon sang mở mắt
    }
});

// 3. Đánh giá mức độ mạnh yếu của mật khẩu
document.getElementById("password").addEventListener("input", function() {
    const val = this.value;
    const bar = document.getElementById("passwordStrengthBar");
    const text = document.getElementById("passwordStrengthText");
    
    // Thuật toán tính điểm đơn giản (Tối đa 4 điểm)
    let score = 0;
    if (val.length > 0) score += 1; // Có nhập dữ liệu
    if (val.length >= 8) score += 1; // Độ dài an toàn
    if (/[A-Z]/.test(val) && /[a-z]/.test(val) && /[0-9]/.test(val)) score += 1; // Đủ hoa, thường, số
    if (/[^A-Za-z0-9]/.test(val)) score += 1; // Có ký tự đặc biệt (!@#$%^&*)

    // Reset lại class màu sắc của thanh bar và text
    bar.className = "progress-bar"; 
    text.className = "small fw-bold mt-1";

    if (val.length === 0) {
        bar.style.width = "0%";
        text.innerText = "";
    } else if (score <= 2) {
        // Mức độ Yếu
        bar.style.width = "33%";
        bar.classList.add("bg-danger");
        text.classList.add("text-danger");
        text.innerText = "Yếu";
    } else if (score === 3) {
        // Mức độ Trung bình
        bar.style.width = "66%";
        bar.classList.add("bg-warning");
        text.classList.add("text-warning");
        text.innerText = "Trung bình";
    } else if (score === 4) {
        // Mức độ Mạnh
        bar.style.width = "100%";
        bar.classList.add("bg-success");
        text.classList.add("text-success");
        text.innerText = "Mạnh";
    }
});
// Toggle cho ô Xác nhận mật khẩu
document.getElementById("toggleConfirmPassword").addEventListener("click", function() {
    const confirmPwdInput = document.getElementById("confirm_password");
    if (confirmPwdInput.type === "password") {
        confirmPwdInput.type = "text";
        this.innerText = "🙈";
    } else {
        confirmPwdInput.type = "password";
        this.innerText = "👁️";
    }
});