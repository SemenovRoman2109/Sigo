const today = new Date();
const dateSrc = today.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' });
let todayDate = dateSrc.split(".")[2] + "-" + dateSrc.split(".")[1] + "-" + dateSrc.split(".")[0]
let inputDate = document.querySelector("#dateChoice");

inputDate.value = todayDate;


const form = document.querySelector("form");

form.addEventListener("submit",function(event){
    event.preventDefault();
    const inputs = form.querySelectorAll("input");
    let error = false
    inputs.forEach(function(input){
        if (! error){
            if (input.value == ""){
                error = true
            }
        }
        
    })

    if (! error){
        let errorOption = false
        let options = document.querySelector("#procedureList").querySelectorAll("option");
        options.forEach(function(option){
            if (option.textContent == document.querySelector("#procedureChoice").value){
                errorOption = true
            }
        })

        if (!errorOption){
            error = true
            let modalWindow = document.querySelector(".modal-window");
            let text = modalWindow.querySelector(".modal-text");
            text.textContent = "Выбирите процедуру из списка"
        }
    }

    if (error){
        let modalWindow = document.querySelector(".modal-window");
        let coverDiv = document.createElement('div'); 
        coverDiv.classList.add('cover-div'); 
        document.body.append(coverDiv);
        modalWindow.style.display = "flex";
        setTimeout(() =>  modalWindow.style.opacity = 1, 1)
        setTimeout(() =>  coverDiv.style.opacity = 1, 1)
        
        setTimeout(function() {
            coverDiv.style.opacity = 0
            setTimeout(function(){
                let coverdiv = document.querySelector('.cover-div');
                coverdiv.remove();
                let text = modalWindow.querySelector(".modal-text");
                text.textContent = "Заполните пустое поле"
            }, 500)
            modalWindow.style.opacity = 0;
            setTimeout(() => modalWindow.style.display = "none", 500)
        },2000)
    }
    else{
        data = {
            csrfmiddlewaretoken: form.querySelectorAll("input")[0].value,
            "namePeople":form.querySelector("#namePeopleChoice").value,
            "procedure":form.querySelector("#procedureChoice").value,
            "date":form.querySelector("#dateChoice").value,
            "time":form.querySelector("#timeChoice").value,
        }
        console.log(data);
        $.ajax({
            type: "POST",
            url: form.getAttribute("action"),
            data:data,
            success: function(response){
                console.log(response);
                let modalWindow = document.querySelector(".modal-window");
                let coverDiv = document.createElement('div'); 

                let text = modalWindow.querySelector(".modal-text");
                let title = modalWindow.querySelector(".modal-title");

                title.textContent = "Успешно созданая запись"
                text.style.display = "none";

                coverDiv.classList.add('cover-div'); 
                document.body.append(coverDiv);
                modalWindow.style.display = "flex";
                setTimeout(() =>  modalWindow.style.opacity = 1, 1)
                setTimeout(() =>  coverDiv.style.opacity = 1, 1)

                setTimeout(function() {
                    coverDiv.style.opacity = 0
                    setTimeout(function(){
                        let coverdiv = document.querySelector('.cover-div');
                        coverdiv.remove();
                        title.textContent = "Неверный ввод данных"
                        text.style.display = "block";
                        document.location.reload()
                    }, 500)
                    modalWindow.style.opacity = 0;
                    setTimeout(() => modalWindow.style.display = "none", 500)
                },2000)
            }
            
        });
    }
})
