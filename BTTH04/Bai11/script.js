let duLieu = [];
let editIndex = -1;
function HienThi(){
   const tbody = document.getElementById("tableBody");
   const rows = Array.from(tbody.querySelectorAll("tr"));
   const preserved = rows.length > 0? rows[0].cloneNode(true):null; 
   tbody.innerHTML = "";
   if(preserved){
    tbody.appendChild(preserved);
   }
   const offset = preserved? 1:0;
    duLieu.forEach((item, index) =>{
        const tr = document.createElement("tr");
        if (item.score < 5){
            tr.classList.add("table-warning");
        }
        tr.innerHTML= `<td>${index + 1 + offset}</td>
                       <td>${item.name}</td>
                       <td>${item.score}</td>
                       <td>${item.rank}</td>
                       <td><button class="btn btn-warning rounded-3 btn-edit" data-index="${index}">Sửa</button> <button class="btn btn-danger rounded-3 btn-delete" data-index="${index}">Xóa</button></td>`;
        tbody.appendChild(tr);
        ;
    });
}
function luuDuLieu(){
    const name = document.getElementById("nameInput");
    const nameValue = name.value.trim();
    const score = document.getElementById("scoreInput");
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
    if(scoreEL >= 8.5){
        rank = "Giỏi";
    }else if(scoreEL >= 7){
        rank = "Khá";
    }else if(scoreEL >= 5){
        rank = "Trung bình";
    }else{
        rank = "Yếu";
    }
    if (editIndex === -1) {
        duLieu.push({name: nameValue, score: scoreValue, rank: rank});
    } else {
        duLieu[editIndex] = {name: nameValue, score: scoreValue, rank: rank};
        editIndex = -1;
    }
    HienThi();
    name.value = "";
    score.value = "";
    name.focus();
}
document.getElementById("tableBody").addEventListener("click", function(event){
    const target = event.target;
    if (target.classList.contains("btn-delete")) {
        const index = target.getAttribute("data-index");
        Delete(index);
    }
    
    if (target.classList.contains("btn-edit")) {
        const index = target.getAttribute("data-index");
        Update(index);
    }
})
function Update(index){
    const name = document.getElementById("nameInput");
    name.value = duLieu[index].name;
    const score = document.getElementById("scoreInput");
    score.value = duLieu[index].score;
    editIndex = index;
}
function Delete(index){
    let confirmDelete = confirm("Bạn có chắc chắn muốn xóa không?");
    if (confirmDelete){
        duLieu.splice(index, 1);
        if (editIndex == index) {
            document.getElementById("nameInput").value = "";
            document.getElementById("scoreInput").value = "";
            editIndex = -1;
        }
        HienThi();
    }
}
