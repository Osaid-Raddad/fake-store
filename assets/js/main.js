const getCategories = async () => {

    const { data } = await axios.get('https://dummyjson.com/product/category-list');
    console.log(data);

    return data

};

const displayCategories = async () => {

    const loader = document.querySelector(" .loader-container ");
    loader.classList.add("active");

    try {
        const categories = await getCategories();
        const result = categories.map(category => `
                <div class="category">
                    <h2> ${category} </h2>
                    <a href="categoryDetails.html?category=${category}"> Details </a>
                </div>
            `).join('');

        document.querySelector(".categories .row").innerHTML = result;
        loader.classList.remove("active");
    } catch (err) {

        document.querySelector(".categories .row").innerHTML = `<p> Error Loading</p>`;
        loader.classList.remove("active");
    } finally {
        loader.classList.remove("active");
    }

};

const getProducts = async (page) => {

    const skip = (page - 1) * 30;
    const { data } = await axios.get(`https://dummyjson.com/products?limit=30&skip=${skip}`);
    return data;
};


const displayProducts = async (page = 1) => {

    const loader = document.querySelector(" .loader-container ");
    loader.classList.add("active");

    try {
        const data = await getProducts(page);
        console.log(data);
        const numberOfPages = Math.ceil(data.total / 30);
        console.log(page);
        const result = data.products.map((product) => {
            return `
                <div class="product">
                  <img src="${product.thumbnail}" alt="${product.description}" class="images"/>
                    <h3>${product.title}</h3>
                    <span>${product.price}</span>
                </div>
                `
        }).join('');


        let paginationLinks =``;
 
        if (page == 1){

            paginationLinks+= `<li class="page-item"><button class="page-link" >&laquo;</button></li>`; // do not request
        }
        else {

            paginationLinks+= `<li class="page-item"><button onclick=displayProducts('${page - 1}') class="page-link"">&laquo;</button></li>`;

        }


        for( let i = 1; i<=numberOfPages; i++ ) {
            paginationLinks+=`<li class="page-item"><button onclick=displayProducts('${i}') class="page-link" ">${i}</button></li>`;
        }

        if (page == numberOfPages) {

            paginationLinks+= `<li class="page-item"><button class="page-link"">&raquo;</button></li>`; // do not request
        }
        else {
            paginationLinks+= `<li class="page-item"><button onclick=displayProducts('${parseInt(page) + 1}') class="page-link" ">&raquo;</button></li>`;
        }
        document.querySelector(".pagination ").innerHTML = paginationLinks;
        document.querySelector(".row1 ").innerHTML = result;
        loader.classList.remove("active");


        modal();

    } catch (err) {
        document.querySelector(".categories .row").innerHTML = `<p> Error Loading</p>`;
        loader.classList.remove("active");
    } finally {
        loader.classList.remove("active");
    }

}
displayCategories();
displayProducts();


window.onscroll = () => {
    const nav = document.querySelector(".header");
    const categories = document.querySelector(".categories");
    if(window.scrollY > categories.scrollTop ) {
        nav.classList.add("scrollnavbar");
    }
    else{
        nav.classList.remove("scrollnavbar");
    }
}


const countDown = () => {
    const countDownDate = new Date("2025-03-01T00:00:00").getTime();
    const now = new Date().getTime();
    const distance = countDownDate - now;

    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.querySelector("#days").textContent = days;
    document.querySelector("#hours").textContent = hours;
    document.querySelector("#minutes").textContent = minutes;
    document.querySelector("#seconds").textContent = seconds;
};

setInterval(() => {
    countDown();
}, 1000);


function modal(){

    const modal = document.querySelector(".my-modal");
    const closeBtn = document.querySelector(".close-btn");
    const rightBtn = document.querySelector(".right-btn");
    const leftBtn = document.querySelector(".left-btn");
    const images = Array.from(document.querySelectorAll(".images"));
    let currentIndex = 0;
 
    images.forEach(function(img){

        img.addEventListener("click",function(e){
            modal.classList.remove("d-none");
            const currentImg = e.target;
            currentIndex = images.indexOf(currentImg);
            modal.querySelector("img").setAttribute("src",e.target.src);
        })
    })
    
    //close modal

    closeBtn.addEventListener("click",function(){

        modal.classList.add("d-none");

    })

    //right button
    rightBtn.addEventListener("click",function(){
        currentIndex++;
        if(currentIndex == images.length){
            currentIndex = 0;
        }
        const nextImg = images[currentIndex].src;
        modal.querySelector("img").setAttribute("src",nextImg);   
    });
    //left button
    leftBtn.addEventListener("click",function(){
        currentIndex--;
        if(currentIndex <= 0){
            currentIndex = images.length - 1;
        }
        const PrevImg = images[currentIndex].src;
        modal.querySelector("img").setAttribute("src",PrevImg);   
    });

    document.addEventListener("keydown",function(e){
        console.log(e.code);
        if (e.code == 'ArrowRight')
            {
            currentIndex++;
            if(currentIndex == images.length){
                currentIndex = 0;
            }
            const nextImg = images[currentIndex].src;
            modal.querySelector("img").setAttribute("src",nextImg);
        } else if(e.code == 'ArrowLeft')
        {
            currentIndex--;
            if(currentIndex <= 0){
                currentIndex = images.length - 1;
            }
            const PrevImg = images[currentIndex].src;
            modal.querySelector("img").setAttribute("src",PrevImg);  
        }else if(e.code == 'Escape')
        {
            modal.classList.add("d-none");
        }
    });
}