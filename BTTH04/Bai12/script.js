// Khởi tạo mảng với 1 dữ liệu mẫu (thay thế cho dòng HTML cứng)
let duLieu = [
    { name: "Phạm Tuấn Kiệt", score: 9, rank: "Giỏi" }
];
let filteredData = []; 
let editIndex = -1;
let sortDirection = 'none'; 

// Hàm xử lý Lọc + Tìm kiếm + Sắp xếp
function applyFilters() {
    const keyword = document.getElementById("searchInput").value.toLowerCase().trim();
    const rank = document.getElementById("rankFilter").value;

    filteredData = duLieu.filter(item => {
        const matchName = item.name.toLowerCase().includes(keyword);
        const matchRank = (rank === "Tất cả" || item.rank === rank);
        return matchName && matchRank; 
    });

    if (sortDirection === 'asc') {
        filteredData.sort((a, b) => a.score - b.score); 
    } else if (sortDirection === 'desc') {
        filteredData.sort((a, b) => b.score - a.score); 
    }

    HienThi();
}

// Hàm render bảng
function HienThi() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    if (filteredData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Không có kết quả nào phù hợp</td></tr>`;
        return;
    }

    filteredData.forEach((item, index) => {
        const tr = document.createElement("tr");
        if (item.score < 5) tr.classList.add("table-warning");
        
        // Tìm index thật trong mảng gốc để Sửa/Xóa chính xác
        const originalIndex = duLieu.indexOf(item);

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.score}</td>
            <td>${item.rank}</td>
            <td>
                <button class="btn btn-warning rounded-3 btn-edit btn-sm" data-index="${originalIndex}">Sửa</button> 
                <button class="btn btn-danger rounded-3 btn-delete btn-sm" data-index="${originalIndex}">Xóa</button>
            </td>`;
        tbody.appendChild(tr);
    });
}

// Hàm Thêm/Lưu dữ liệu
function luuDuLieu() {
    const name = document.getElementById("nameInput");
    const score = document.getElementById("scoreInput");
    const nameValue = name.value.trim();
    const scoreValue = score.value.trim();
    let scoreEL = Number(scoreValue);
    
    if(nameValue === "" || scoreValue === ""){
        alert("Vui lòng nhập đầy đủ thông tin");
        return;  
    }
    else if(scoreEL < 0 || scoreEL > 10){
        alert("Điểm số phải nằm trong khoảng từ 0 đến 10");
        return;
    }
    
    let rank = "";
    if(scoreEL >= 8.5){ rank = "Giỏi"; }
    else if(scoreEL >= 7){ rank = "Khá"; }
    else if(scoreEL >= 5){ rank = "Trung bình"; }
    else{ rank = "Yếu"; }

    if (editIndex === -1) {
        duLieu.push({name: nameValue, score: scoreEL, rank: rank});
    } else {
        duLieu[editIndex] = {name: nameValue, score: scoreEL, rank: rank};
        editIndex = -1;
        document.getElementById("btnSave").innerText = "Thêm"; // Đổi lại text nút
    }

    applyFilters(); // Cập nhật lại UI thông qua bộ lọc
    
    name.value = "";
    score.value = "";
    name.focus();
}

// Hàm lấy dữ liệu lên form để Sửa
function Update(index) {
    const name = document.getElementById("nameInput");
    const score = document.getElementById("scoreInput");
    
    name.value = duLieu[index].name;
    score.value = duLieu[index].score;
    editIndex = index;
    
    document.getElementById("btnSave").innerText = "Cập nhật"; // Đổi chữ nút cho trực quan
    name.focus();
}

// Hàm Xóa
function Delete(index) {
    let confirmDelete = confirm("Bạn có chắc chắn muốn xóa không?");
    if (confirmDelete) {
        duLieu.splice(index, 1);
        if (editIndex == index) {
            document.getElementById("nameInput").value = "";
            document.getElementById("scoreInput").value = "";
            editIndex = -1;
            document.getElementById("btnSave").innerText = "Thêm";
        }
        applyFilters(); 
    }
}

// --- GẮN CÁC SỰ KIỆN LẮNG NGHE (EVENT LISTENERS) ---

// 1. Event delegation cho nút Sửa/Xóa
document.getElementById("tableBody").addEventListener("click", function(event){
    const target = event.target;
    if (target.classList.contains("btn-delete")) {
        const index = target.getAttribute("data-index");
        Delete(parseInt(index));
    }
    if (target.classList.contains("btn-edit")) {
        const index = target.getAttribute("data-index");
        Update(parseInt(index));
    }
});

// 2. Sự kiện Tìm kiếm & Lọc
document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("rankFilter").addEventListener("change", applyFilters);

// 3. Sự kiện Sắp xếp theo Điểm
document.getElementById("scoreHeader").addEventListener("click", function() {
    const icon = document.getElementById("sortIcon");
    
    if (sortDirection === 'none' || sortDirection === 'desc') {
        sortDirection = 'asc';
        icon.innerText = ' ▲';
    } else {
        sortDirection = 'desc';
        icon.innerText = ' ▼';
    }
    applyFilters();
});

// Gọi applyFilters lần đầu tiên khi trang vừa load xong để hiển thị dữ liệu mẫu
applyFilters();