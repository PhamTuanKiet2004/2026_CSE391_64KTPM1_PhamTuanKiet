// Sử dụng jQuery
$(document).ready(function() {
    let currentStep = 1;
    const totalSteps = 3;

    // --- CÁC HÀM TIỆN ÍCH ---
    function updateProgress() {
        let percent = (currentStep / totalSteps) * 100;
        $('#progressBar').css('width', percent + '%').text('Bước ' + currentStep + ' / ' + totalSteps);
    }

    function showError(fieldId, message) {
        $('#' + fieldId).addClass('is-invalid').removeClass('is-valid');
        $('#' + fieldId + '-error').text(message);
    }

    function clearError(fieldId) {
        $('#' + fieldId).removeClass('is-invalid').addClass('is-valid');
        $('#' + fieldId + '-error').text('');
    }

    // --- VALIDATE BƯỚC 1 ---
    function validateStep1() {
        let isValid = true;
        let fullname = $('#fullname').val().trim();
        let dob = $('#dob').val();
        let gender = $('input[name="gender"]:checked').val(); // Lấy value của radio đang được check

        if (fullname.length < 3) {
            showError('fullname', 'Họ tên phải có ít nhất 3 ký tự.');
            isValid = false;
        } else { clearError('fullname'); }

        if (dob === "") {
            showError('dob', 'Vui lòng chọn ngày sinh.');
            isValid = false;
        } else { clearError('dob'); }

        if (!gender) {
            $('#gender-error').text('Vui lòng chọn giới tính.');
            isValid = false;
        } else { $('#gender-error').text(''); }

        return isValid;
    }

    // --- VALIDATE BƯỚC 2 ---
    function validateStep2() {
        let isValid = true;
        let email = $('#email').val().trim();
        let password = $('#password').val();
        let confirm_password = $('#confirm_password').val();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            showError('email', 'Email không đúng định dạng.');
            isValid = false;
        } else { clearError('email'); }

        if (password.length < 8) {
            showError('password', 'Mật khẩu phải từ 8 ký tự trở lên.');
            isValid = false;
        } else { clearError('password'); }

        if (confirm_password === "" || confirm_password !== password) {
            showError('confirm_password', 'Mật khẩu xác nhận không khớp.');
            isValid = false;
        } else { clearError('confirm_password'); }

        return isValid;
    }

    // --- ĐỔI DỮ LIỆU SANG BƯỚC 3 ---
    function populateSummary() {
        $('#sum_fullname').text($('#fullname').val());
        // Chuyển định dạng ngày YYYY-MM-DD sang DD/MM/YYYY cho thân thiện
        let dobRaw = new Date($('#dob').val());
        $('#sum_dob').text(dobRaw.toLocaleDateString("vi-VN"));
        
        $('#sum_gender').text($('input[name="gender"]:checked').val());
        $('#sum_email').text($('#email').val());
    }

    // --- SỰ KIỆN CLICK NÚT "TIẾP THEO" ---
    $('.btn-next').click(function() {
        if (currentStep === 1) {
            if (validateStep1()) {
                $('#step1').hide();
                $('#step2').fadeIn(); // Hiệu ứng mờ dần hiện ra
                currentStep++;
                updateProgress();
            }
        } else if (currentStep === 2) {
            if (validateStep2()) {
                populateSummary(); // Điền dữ liệu trước khi sang bước 3
                $('#step2').hide();
                $('#step3').fadeIn();
                currentStep++;
                updateProgress();
            }
        }
    });

    // --- SỰ KIỆN CLICK NÚT "QUAY LẠI" ---
    $('.btn-back').click(function() {
        if (currentStep === 2) {
            $('#step2').hide();
            $('#step1').fadeIn();
            currentStep--;
            updateProgress();
        } else if (currentStep === 3) {
            $('#step3').hide();
            $('#step2').fadeIn();
            currentStep--;
            updateProgress();
        }
    });

    // --- SỰ KIỆN XÓA LỖI REALTIME KHI ĐANG NHẬP ---
    // jQuery cho phép gán sự kiện cho nhiều ô input cùng lúc bằng bộ chọn (selector)
    $('input').on('input change', function() {
        if ($(this).attr('type') !== 'radio') {
            $(this).removeClass('is-invalid');
            $('#' + $(this).attr('id') + '-error').text('');
        } else {
            $('#gender-error').text('');
        }
    });

    // --- XỬ LÝ KHI GỬI FORM ---
    $('#multiStepForm').submit(function(e) {
        e.preventDefault();
        alert("🎉 Chúc mừng! Bạn đã đăng ký thành công.");
    });
});