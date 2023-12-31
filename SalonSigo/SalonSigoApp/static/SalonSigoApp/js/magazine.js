const masterName = document.querySelector("#masterName");

const listMonth = ["Января","Февраля","Марта","Апреля","Мая","Июня","Июля","Августа","Сентября","Октября","Ноября","Декабря"]

const listMasterButton = document.querySelectorAll(".masterSelect");
const formMaster = document.querySelector(".select-master");

let dateScreen = document.querySelector("#dateScreen");

const today = new Date();
const dateSrc = today.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' });
let todayDate = dateSrc.split(".")[2] + "-" + dateSrc.split(".")[1] + "-" + dateSrc.split(".")[0]
let inputDate = document.querySelector("#inputDate");
let indexDate = 0

inputDate.value = todayDate;

function setDate() {
    var days = [
        'Вc',
        'Пн',
        'Вт',
        'Ср',
        'Чт',
        'Пт',
        'Сб'
      ];
    

    let newDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + indexDate
    );
    var n = newDate.getDay();
    

    let date = newDate.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' });
    date = date.split(".")[2] + "-" + date.split(".")[1] + "-" + date.split(".")[0]
    inputDate.value = date

    if (date.split("-")[1][0] == "0"){
        if (date.split("-")[2][0] == "0"){
            dateScreen.textContent = String(days[n]) + ", " + date.split("-")[2][1] + " " + listMonth[date.split("-")[1][1] - 1]
        }
        else{
            dateScreen.textContent = String(days[n]) + ", " + date.split("-")[2] + " " + listMonth[date.split("-")[1][1] - 1]
        }
    }
    else{
        if (date.split("-")[2][0] == "0"){
            dateScreen.textContent = String(days[n]) + ", " + date.split("-")[2][1] + " " + listMonth[date.split("-")[1] - 1]
        }
        else{
            dateScreen.textContent = String(days[n]) + ", " +  date.split("-")[2] + " " + listMonth[date.split("-")[1] - 1];
        }
    }
    
    $.ajax({
        type: "POST",
        url: formMaster.getAttribute("action"),
        data: {
            csrfmiddlewaretoken: formMaster.querySelectorAll("input")[0].value,
            "master_name":"None",
            "date":inputDate.value,
            "del":"F"
        },
        success: function(response){
            
            main = document.querySelector("main");
            main.innerHTML = response.html_sign_list

            
            itemDel()
        }
        
    });
}

setDate()


const listArrows = document.querySelectorAll(".arrow");

listArrows.forEach(function(arrow){
    arrow.addEventListener("click",function(event) {
        if ("leftArrow" == arrow.classList[1]){
            indexDate -= 1
            setDate()
        }
        if ("righttArrow" == arrow.classList[1]){
            indexDate += 1
            setDate()
        }
    });
});


listMasterButton.forEach(function(masterButton){
    
    if (masterButton.closest("div").querySelector("label").textContent == masterName.value){
        masterButton.checked = true
    }

    masterButton.addEventListener("click",function(event) {
        $.ajax({
            type: "POST",
            url: formMaster.getAttribute("action"),
            data: {
                csrfmiddlewaretoken: formMaster.querySelectorAll("input")[0].value,
                "master_name":masterButton.closest("div").querySelector("label").textContent,
                "date":inputDate.value,
                "del":"F"
            },
            success: function(response){

                main = document.querySelector("main");
                main.innerHTML = response.html_sign_list

                itemDel()
            }
            
        });
    })
})


inputDate.addEventListener("input",function(event){
    let startDate = new Date(String(inputDate.value));
    let timeDiff = today.getTime() - startDate.getTime(); 
    indexDate = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) * -1; 
    setDate()
})




const sellectArrow = document.querySelector(".sellect-arrow");
let sellectArrowChecked = false

sellectArrow.addEventListener("click",function(event){
    let modalWindow = document.querySelector(".select-master");
    if (sellectArrowChecked == false){
        sellectArrowChecked = true;
        modalWindow.style.top = "60px";

        sellectArrow.src = sellectArrow.src.split("select-arrow.png")[0] + "select-arrow-checked.png";
    }
    else if (sellectArrowChecked == true){
        sellectArrowChecked = false;
        modalWindow.style.top = "-180px";

        sellectArrow.src = sellectArrow.src.split("select-arrow-checked.png")[0] + "select-arrow.png";
    }
})



const selectDate= document.querySelector(".select-date");

selectDate.addEventListener("click",function(event) {
    let modalDate = document.querySelector(".modal-date");
    let coverDiv = document.createElement('div'); 
    coverDiv.classList.add('cover-div'); 
    document.body.append(coverDiv);
    modalDate.style.display = "flex";
    setTimeout(() =>  modalDate.style.opacity = 1, 1)
    setTimeout(() =>  coverDiv.style.opacity = 1, 1)

    coverDiv.addEventListener("click",function(event){
        coverDiv.style.opacity = 0
        setTimeout(function(){
            let coverdiv = document.querySelector('.cover-div');
            coverdiv.remove();
        }, 500)
        modalDate.style.opacity = 0;
        setTimeout(() => modalDate.style.display = "none", 500)
    })
})

function itemDel(){
    let listItem = document.querySelectorAll(".item");
    const is_aunt = document.querySelector(".is_aunt");
    
    if (is_aunt.value == "True"){
        listItem.forEach(function(item){
            item.addEventListener("dblclick",function(event){
                let modal = document.querySelector(".delete-item");
                let coverDiv = document.createElement('div'); 
                coverDiv.classList.add('cover-div'); 
                document.body.append(coverDiv);
                
                modal.style.display = "flex";
                setTimeout(() =>  modal.style.opacity = 1, 1)
                setTimeout(() =>  coverDiv.style.opacity = 1, 1)
    
                let no = modal.querySelector("#no")
                let yes = modal.querySelector("#yes")
                
                no.addEventListener("click",function(event){
                    coverDiv.style.opacity = 0
                    setTimeout(function(){
                        coverDiv.remove();
                    }, 500)
                    modal.style.opacity = 0;
                    setTimeout(() => modal.style.display = "none", 500)
                })
    
                yes.addEventListener("click",function(event){
                    coverDiv.style.opacity = 0
                    setTimeout(function(){
                        coverDiv.remove();

                        item.remove()
                        $.ajax({
                            type: "POST",
                            url: formMaster.getAttribute("action"),
                            data: {
                                csrfmiddlewaretoken: formMaster.querySelectorAll("input")[0].value,
                                "del":"T",
                                "sign_id":item.querySelector(".sign-id").value
                            }
                        })

                    }, 500)
                    modal.style.opacity = 0;
                    setTimeout(() => modal.style.display = "none", 500)
                })
            })
        })
    }
}

