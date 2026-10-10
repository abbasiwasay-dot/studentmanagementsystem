let name=document.querySelector("#name");
let age=document.querySelector("#age");
let course=document.querySelector("#course");
let addstudent=document.querySelector("#addBtn");
let studentList=document.querySelector("#studentList");
let count=document.querySelector("#total");
let sortage=document.querySelector("#sortAge");
let sortname=document.querySelector("#sortName");
let filter=document.querySelector("#courseFilter");
let search=document.querySelector("#search");

let editing=null;
let editingId=null;
let list=[];

list=JSON.parse(localStorage.getItem("studentManagementData")) || [];

showList(list);
updateCount();

addstudent.addEventListener("click",function(){

    if(name.value==""  ||  age.value==""  ||  Number(age.value)<=0  ||  course.value==""){
        return;
    }

    let Student={
        id: editing==null ? Date.now() : editingId,
        name:name.value,
        age:age.value,
        course:course.value
    };

    if(editing==null){

        list.push(Student);

    }
    else{

        for(let i=0; i<list.length; i++){
            if(list[i].id==editingId){
                list[i]=Student;
            }
        }

        addstudent.textContent="Add Student";
        editing=null;
        editingId=null;
    }

    localStorage.setItem("studentManagementData",JSON.stringify(list));

    name.value="";
    age.value="";
    course.value="";

    showList(list);
    updateCount();

});


function updateCount(){
    count.textContent=list.length;
}


function showList(arr){

    studentList.innerHTML="";

    if(arr.length==0){
        let empty=document.createElement("div");
        empty.classList.add("empty-state");
        empty.innerHTML="<div class='emoji'>🗂️</div><p>No students found.</p>";
        studentList.appendChild(empty);
        return;
    }

    for(let i=0; i<arr.length; i++){
        create(arr[i]);
    }

}


function create(Student){

    let box=document.createElement("div");
    studentList.appendChild(box);
    box.classList.add("student-card");

    let top=document.createElement("div");
    top.classList.add("card-top");
    box.appendChild(top);

    let avatar=document.createElement("div");
    avatar.classList.add("avatar");
    avatar.textContent=Student.name.charAt(0).toUpperCase();
    top.appendChild(avatar);

    let p_name=document.createElement("h2");
    p_name.textContent=Student.name;
    top.appendChild(p_name);

    let ageRow=document.createElement("div");
    ageRow.classList.add("meta-row");
    ageRow.innerHTML="<span class='meta-label'>Age</span><span>"+Student.age+"</span>";
    box.appendChild(ageRow);

    let courseRow=document.createElement("div");
    courseRow.classList.add("meta-row");
    courseRow.innerHTML="<span class='meta-label'>Course</span><span class='course-badge'>"+Student.course+"</span>";
    box.appendChild(courseRow);

    let actions=document.createElement("div");
    actions.classList.add("actions");
    box.appendChild(actions);

    let editbtn=document.createElement("span");
    editbtn.innerHTML="<i class='fa-solid fa-pen'></i>";
    editbtn.classList.add("edit");
    actions.appendChild(editbtn);

    let deletebtn=document.createElement("span");
    deletebtn.innerHTML="<i class='fa-solid fa-trash'></i>";
    deletebtn.classList.add("delete");
    actions.appendChild(deletebtn);


    editbtn.addEventListener("click",function(){
        name.value=Student.name;
        age.value=Student.age;
        course.value=Student.course;
        addstudent.textContent="Update List";
        editing=true;
        editingId=Student.id;
        name.focus();
    });


    deletebtn.addEventListener("click",function(){

        for(let i=0; i<list.length; i++){
            if(list[i].id==Student.id){
                list.splice(i,1);
                break;
            }
        }

        localStorage.setItem("studentManagementData",JSON.stringify(list));

        if(editingId==Student.id){
            name.value="";
            age.value="";
            course.value="";
            addstudent.textContent="Add Student";
            editing=null;
            editingId=null;
        }

        updateCount();
        showList(list);

    });

}


sortage.addEventListener("click",function(){
    list.sort((a,b)=>a.age-b.age);
    localStorage.setItem("studentManagementData",JSON.stringify(list));
    showList(list);
});


sortname.addEventListener("click",function(){
    list.sort((a,b)=>a.name.localeCompare(b.name));
    localStorage.setItem("studentManagementData",JSON.stringify(list));
    showList(list);
});


filter.addEventListener("change",function(){

    if(filter.value=="All"){
        showList(list);
    }
    else{
        let fill=list.filter(function(Student){
            return Student.course.toLowerCase()==filter.value.toLowerCase();
        });
        showList(fill);
    }

});


search.addEventListener("keyup",function(){

    if(search.value==""){
        showList(list);
        return;
    }

    let searching=list.filter(Student=>Student.name.toLowerCase().includes(search.value.toLowerCase()));
    showList(searching);

});