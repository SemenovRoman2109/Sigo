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
            }, 500)
            modalWindow.style.opacity = 0;
            setTimeout(() => modalWindow.style.display = "none", 500)
        },2000)
    }
    else{
        data = {
            csrfmiddlewaretoken: form.querySelectorAll("input")[0].value,
            "name":form.querySelector("#name").value,
            "password":form.querySelector("#passwordChoice").value,
        }
        console.log(data);
        $.ajax({
            type: "POST",
            url: form.getAttribute("action"),
            data:data,
            success: function(response){
                let modalWindow = document.querySelector(".modal-window");
                let coverDiv = document.createElement('div');
                let text = modalWindow.querySelector("h2");
                if (response.result == "true"){
                    text.textContent = "Успешная авторизация"
                }
                else{
                    text.textContent = "Неверный ввод данных"
                }
                

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
                        if (response.result == "true"){
                            document.location = document.location.split("login")[0] + "addSigning"
                        }
                        
                    }, 500)
                    modalWindow.style.opacity = 0;
                    setTimeout(() => modalWindow.style.display = "none", 500)
                },2000)
            }
            
        });
    }
})
