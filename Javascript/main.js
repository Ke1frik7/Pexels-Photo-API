window.addEventListener("DOMContentLoaded", () => {
    let text = renderELement(".text")
    let header = renderELement("header")
    let text_2 = renderELement(".text_2")
    let locals_div_btn = renderELement(".locals-div-btn")
    const locals_div = renderELement(".locals-div")
    let timerOut = setTimeout(() => {
        header.classList.add("block")
    }, 4000)
    window.addEventListener("scroll", () => {
        header.classList.toggle("block", window.scrollY> 0, clearInterval(timerOut))
    })
    const API_KEY = "563492ad6f91700001000001f4b0fc580baf40f6b72fd2ce593d467d"
    let input = renderELement(".input")
    let template = renderELement("template").content
    let parentCards = renderELement(".cards")
    let array ;
    ;(function(){
        let url = axios({
            method: "GET",
            url: "https://api.pexels.com/v1/curated",
            headers: {
                Accept: "application/json",
                Authorization: API_KEY
            }
        })      
        .then((response) => {
            array = response.data.photos
            renders(response.data.photos)
        })   
        .catch((error) => {
            if(error.name = "AxiosError"){
                console.log("ishladi")
                text_2.classList.add("text_2_block")
            }
        })
    }())
    const handleSub = (event) => {
        event.preventDefault()
        let inputValue = input.value
        let filterArray = []
        let rejex = new RegExp(inputValue, "gi")
        if(inputValue == "all"){
            filterArray = array
        }else if(inputValue !== "all"){
            filterArray = array.filter((item) => item.photographer.match(rejex))
        }
        if(filterArray.length === 0){
            console.log("ishladi")
            text.classList.add("text_block")
            
        }else{
            text.classList.remove("text_block")
        }
        renders(filterArray)
    }
    let form = renderELement(".form")
    form.addEventListener("submit", handleSub)
    async function requests(){
        let fetchs = await fetch("https://api.pexels.com/v1/curated", {
            method: "GET", 
            headers: {
                Accept: "application/json",
                Authorization: API_KEY
            }            
        })
        let response = await fetchs.json()
        renders(response.photos)
    }
    let object = {
        name: null
    }
    let allArray = []
    const cardClick = (e) => {
        if(e.target.classList.contains("locals_btn")){
            let id = e.target.dataset.id            
            for(let i = 0; i<array.length; i++){
                if(id == array[i].id){
                    if(!allArray.includes(array[i])){
                        allArray = [...allArray, array[i]]
                        window.localStorage.setItem("Pexels", JSON.stringify(allArray))
                        let parses = JSON.parse(window.localStorage.getItem("Pexels"))
                        for(let i = 0; i<parses.length; i++){
                            let h2 = createTag("h2")
                            h2.appendChild(textNode(parses[i].photographer))
                            locals_div.appendChild(h2)
                        }
                    }
                }
            }  
        }
    }  
    let dowload = renderELement(".dowload_ankers")
    function renders(arr){
        parentCards.innerHTML = null
        console.log(arr)
        for(let i = 0; i<arr.length; i++){
            let images = arr[i].src
            let clone = template.cloneNode(true)
            let card = clone.querySelector(".card")
            card.addEventListener("click", cardClick)
            let img = clone.querySelector(".card-img-top")
            img.src = images.medium
            dowload.download = images.medium
            let name = clone.querySelector(".photograf")
            name.textContent = arr[i].photographer
            let btn = clone.querySelector(".locals_btn")
            btn.dataset.id = arr[i].id
            parentCards.appendChild(clone)
        }
    }
    const handleLocals = () => {
        locals_div.classList.toggle("locals-div_block")
    }
    locals_div_btn.addEventListener("click", handleLocals)
    let parses = JSON.parse(window.localStorage.getItem("Pexels"))
    for(let i = 0; i<parses.length; i++){
        let h2 = createTag("h2")
        h2.appendChild(textNode(parses[i].photographer))
        locals_div.appendChild(h2)
    }
})