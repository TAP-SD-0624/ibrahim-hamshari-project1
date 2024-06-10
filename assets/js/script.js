const defaultBrandPrimary = "#0768AC";
const defaultBrandSecondary = "#03C180";
const defaultBgDefault = "#FFFFFF";
const defaultBgBody = "#F0F9FF";
const defaultLinesColor = "#DDDDDD";
const defaultBodyText = "#333333";
const defaultHeartColor = "#DC143C";

const darkBrandPrimary = "#0768AC";
const darkBrandSecondary = "#03C180";
const darkBgDefault = "#1A1A1A";
const darkBgBody = "#282828";
const darkLinesColor = "#000000";
const darkBodyText = "#EDEDED";
const darkHeartColor = "#DC143C";

let favAppear = false;
const darkButton = document.getElementById("dark-mode");
const favButton = document.getElementById("fav");

let currentTimeOut;
const baseURL = "http://localhost:3000";

darkButton.addEventListener("click", (e) => {
    const isDark = JSON.parse(localStorage.getItem("dark"));
    let brandPrimary
    let brandSecondary
    let bgDefault
    let bgBody
    let linesColor
    let bodyText
    let heartColor
    if (isDark === true) {
        brandPrimary = defaultBrandPrimary;
        brandSecondary = defaultBrandSecondary;
        bgDefault = defaultBgDefault;
        bgBody = defaultBgBody;
        linesColor = defaultLinesColor;
        bodyText = defaultBodyText;
        heartColor = defaultHeartColor;
        localStorage.setItem("dark", false);

    }
    else {
        brandPrimary = darkBrandPrimary;
        brandSecondary = darkBrandSecondary;
        bgDefault = darkBgDefault;
        bgBody = darkBgBody;
        linesColor = darkLinesColor;
        bodyText = darkBodyText;
        heartColor = darkHeartColor;


        localStorage.setItem("dark", true);
    }
    document.documentElement.style.setProperty('--brand-primary', brandPrimary);
    document.documentElement.style.setProperty('--brand-secondary', brandSecondary);
    document.documentElement.style.setProperty('--bg-default', bgDefault);
    document.documentElement.style.setProperty('--bg-body', bgBody);
    document.documentElement.style.setProperty('--lines-color', linesColor);
    document.documentElement.style.setProperty('--body-text', bodyText);
    document.documentElement.style.setProperty('--heart-color', heartColor);
})


favButton.addEventListener("click", (e) => {
    if (favAppear) {
        document.body.removeChild(document.getElementsByClassName('favorites-container')[0]);
        favAppear = !favAppear
    }
    else {
        const data = JSON.parse(localStorage.getItem('favorites'));
        const favoritesContainer = document.createElement('div');
        favoritesContainer.classList.add('favorites-container', 'position-fixed', 'bottom-0', 'left-0', 'right-0', 'padding-2');

        const flexColContainer = document.createElement('div');
        flexColContainer.classList.add('flex-col', 'container', 'margin-auto', 'gap-4');

        const heading = document.createElement('h3');
        heading.classList.add('font-weight-3', 'font-medium');
        heading.textContent = 'My Favorite Topics';

        const favoritesDiv = document.createElement('div');
        favoritesDiv.id = 'favorites';
        favoritesDiv.classList.add('flex-row');

        const favCard = document.createElement('div');
        favCard.classList.add('fav-card');

        const img = document.createElement('img');
        img.classList.add('fav-img');
        img.src = `./assets/img/${data.image}`;
        img.alt = `${data.topic}`;

        const favBody = document.createElement('div');
        favBody.classList.add('fav-body');

        const cardDescription = document.createElement('h4');
        cardDescription.classList.add('font-medium', 'font-weight-3', 'card-disc');
        cardDescription.textContent = `${data.topic}`;

        const ratingsDiv = document.createElement('div');
        ratingsDiv.classList.add('ratings');

        const createStarImg = (src, alt) => {
            const starImg = document.createElement('img');
            starImg.classList.add('star');
            starImg.src = src;
            starImg.alt = alt;
            return starImg;
        };
        const ratings = Math.round(data.rating*2)/2;
        for(let i = 0 ; i<ratings;i++){
            ratingsDiv.appendChild(createStarImg('./assets/img/star.svg', 'checked_star'));
        }
        if(ratings - Math.floor(ratings) !== 0){
            ratingsDiv.appendChild(createStarImg('./assets/img/star-half.svg', 'half_star'));
        }
        for(let i = 0 ; i<5-Math.ceil(ratings);i++){
            ratingsDiv.appendChild(createStarImg('./assets/img/star-outline.svg', 'unchecked_star'));
        }

        favBody.appendChild(cardDescription);
        favBody.appendChild(ratingsDiv);
        favCard.appendChild(img);
        favCard.appendChild(favBody);
        favoritesDiv.appendChild(favCard);
        flexColContainer.appendChild(heading);
        flexColContainer.appendChild(favoritesDiv);
        favoritesContainer.appendChild(flexColContainer);

        document.body.appendChild(favoritesContainer);
        favAppear = !favAppear
    }
})

document.addEventListener("DOMContentLoaded",async ()=>{
    let data = await fetch(`${baseURL}/api/courses`);
    data = await data.json();
    await createCards(data);
    let searchInput = document.querySelector(".search-input");

    searchInput.addEventListener("input",async (e)=>{
        if(typeof currentTimeOut === "number"){
            clearTimeout(currentTimeOut);
        }

        currentTimeOut = setTimeout(async ()=>{
            await search(e);
    },2000)
    
    
})})

async function search(e){
    const name = e.target.value;
    const filter = "";
    const orderSelect = document.querySelector("#sort");
    const order = orderSelect.value;
    const orderAnd = ((name && order)? "&":"");
    const filterAnd = (name || order) && filter? "&":""
    let data = await fetch(`${baseURL}/api/courses${(name || order || filter )? "?":"" }${name?`q=${name}`:""}${orderAnd}${order?`order=${order}`:""}${filterAnd}${filter?`filter=${filter}`:""}`);
    data = await data.json();
    createCards(data);
}


function createCards(data){
    const div = document.querySelector(".cards-body");
    div.innerHTML = "";
    div.classList.remove("spinner_container");
    for (let i = 0; i < data.length; i++) {
        createCard(data[i]);
    }
}
function createCard(data) {
    const card = document.createElement('div');
    card.className = 'card flex-col';

    const img = document.createElement('img');
    img.className = 'topic-img';
    img.src = `./assets/img/${data.image}`;
    img.alt = `${data.topic}`;
    card.appendChild(img);

    const cardContent = document.createElement('div');
    cardContent.className = 'card-content flex-col justify-between flex-grow-1';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardDisc = document.createElement('p');
    cardDisc.className = 'font-weight-2 font-small card-disc';
    cardDisc.textContent = `${data.category}`;
    cardBody.appendChild(cardDisc);

    const cardTitle = document.createElement('h2');
    cardTitle.className = 'font-medium font-weight-3';
    cardTitle.textContent = `${data.topic}`;
    cardBody.appendChild(cardTitle);

    cardContent.appendChild(cardBody);

    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer';

    const ratings = document.createElement('div');
    ratings.className = 'ratings';

    const stars = [];

    const ratingsNum = Math.round(data.rating*2)/2;
    for(let i = 0 ; i<ratingsNum;i++){
        stars.push({src:'./assets/img/star.svg',alt: 'checked_star'});
    }
    if(ratingsNum - Math.floor(ratingsNum) !== 0){
        stars.push({src:'./assets/img/star-half.svg',alt: 'half_star'});
    }
    for(let i = 0 ; i<5-Math.ceil(ratingsNum);i++){
        stars.push({src:'./assets/img/star-outline.svg',alt: 'unchecked_star'});
    }
    
    stars.forEach(starData => {
        const star = document.createElement('img');
        star.className = 'star';
        star.src = starData.src;
        star.alt = starData.alt;
        ratings.appendChild(star);
    });

    cardFooter.appendChild(ratings);

    const author = document.createElement('address');
    author.className = 'author font-small';
    author.textContent = 'Author: Daniel Brown';
    cardFooter.appendChild(author);

    cardContent.appendChild(cardFooter);

    card.appendChild(cardContent);

    document.querySelector(".cards-body").appendChild(card);
}

