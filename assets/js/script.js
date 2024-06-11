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
        let dataArray = JSON.parse(localStorage.getItem('favorites'));
        const favoritesContainer = document.createElement('div');
        favoritesContainer.classList.add('favorites-container', 'position-fixed', 'bottom-0', 'left-0', 'right-0', 'padding-2');

        const flexColContainer = document.createElement('div');
        flexColContainer.classList.add('flex-col', 'container', 'margin-auto', 'gap-4');

        const heading = document.createElement('h3');
        heading.classList.add('font-weight-3', 'font-medium');
        heading.textContent = `${dataArray?.length > 0 ? "My Favorite Topics" : "No Favorites Topics"}`;

        const favoritesDiv = document.createElement('div');
        favoritesDiv.id = 'favorites';
        favoritesDiv.classList.add('flex-row');

        for (let i = 0; i < dataArray?.length; i++) {
            const data = dataArray[i];
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
            const ratings = Math.round(data.rating * 2) / 2;
            for (let i = 0; i < ratings; i++) {
                ratingsDiv.appendChild(createStarImg('./assets/img/star.svg', 'checked_star'));
            }
            if (ratings - Math.floor(ratings) !== 0) {
                ratingsDiv.appendChild(createStarImg('./assets/img/star-half.svg', 'half_star'));
            }
            for (let i = 0; i < 5 - Math.ceil(ratings); i++) {
                ratingsDiv.appendChild(createStarImg('./assets/img/star-outline.svg', 'unchecked_star'));
            }

            favBody.appendChild(cardDescription);
            favBody.appendChild(ratingsDiv);
            favCard.appendChild(img);
            favCard.appendChild(favBody);
            favoritesDiv.appendChild(favCard);

        }
        flexColContainer.appendChild(heading);
        flexColContainer.appendChild(favoritesDiv);
        favoritesContainer.appendChild(flexColContainer);
        document.body.appendChild(favoritesContainer);
        favAppear = !favAppear
    }
})

document.addEventListener("DOMContentLoaded", async () => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const queryParams = url.searchParams;
    const id = queryParams.get("id");
    if (!id) {
        let data = await fetch(`${baseURL}/api/courses`);
        data = await data.json();
        const div = document.querySelector(".cards-body");
        div.innerHTML = "";
        div.classList.remove("spinner_container");
        await createCards(data);

        let searchInput = document.querySelector(".search-input");
        searchInput.addEventListener("input", async () => {
            if (typeof currentTimeOut === "number") {
                clearTimeout(currentTimeOut);
            }

            currentTimeOut = setTimeout(async () => {
                search();
            }, 500)
        })
        let cardsBody = document.querySelector(".cards-body");
        cardsBody.addEventListener("click", (e) => {
            const item = e.target.closest(".card");
            if (item && cardsBody.contains(item)) {
                const id = item.getAttribute("data-key");
                window.location.href = `./details.html?id=${id}`
            }

        })
        return;
    }

    let data = await fetch(`${baseURL}/api/courses/${id}`);
    data = await data.json();
    const div = document.querySelector(".cards-body");
    div.innerHTML = "";
    div.classList.remove("spinner_container");
    await createDetails(data);
})

document.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;

    if (typeof currentTimeOut === "number") {
        clearTimeout(currentTimeOut);
    }

    search()
})

async function search() {
    const input = document.querySelector(".search-input");
    const name = input.value;
    const filter = "";
    const orderSelect = document.querySelector("#sort");
    const order = orderSelect.value;
    const orderAnd = ((name && order) ? "&" : "");
    const filterAnd = (name || order) && filter ? "&" : ""
    let data = await fetch(`${baseURL}/api/courses${(name || order || filter) ? "?" : ""}${name ? `q=${name}` : ""}${orderAnd}${order ? `order=${order}` : ""}${filterAnd}${filter ? `filter=${filter}` : ""}`);
    data = await data.json();
    createCards(data);
}


function createCards(data) {
    const cardsTitle = document.querySelector(".cards-head");
    cardsTitle.textContent = `"${data ? data.length : 0}" Web Topics Found`
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

    const ratingsNum = Math.round(data.rating * 2) / 2;
    for (let i = 0; i < ratingsNum; i++) {
        stars.push({ src: './assets/img/star.svg', alt: 'checked_star' });
    }
    if (ratingsNum - Math.floor(ratingsNum) !== 0) {
        stars.push({ src: './assets/img/star-half.svg', alt: 'half_star' });
    }
    for (let i = 0; i < 5 - Math.ceil(ratingsNum); i++) {
        stars.push({ src: './assets/img/star-outline.svg', alt: 'unchecked_star' });
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
    card.setAttribute("data-key", data.id)
    card.appendChild(cardContent);
    document.querySelector(".cards-body").appendChild(card);
}

function createDetails(data) {
    console.log(data);

    const detailsHeader = document.createElement('div');
    detailsHeader.className = 'details_header flex-row justify-center';

    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'details_container flex-row position-relative';

    const detailsDetails = document.createElement('div');
    detailsDetails.className = 'details_details flex-col padding-3 gap-4';

    const detailsDetailsHeader = document.createElement('div');
    detailsDetailsHeader.className = 'details_details_header';

    const category = document.createElement('h5');
    category.className = 'category';
    category.textContent = `${data.category}`;

    const topic = document.createElement('h2');
    topic.className = 'topic';
    topic.textContent = `${data.topic}`;

    const ratings = document.createElement('div');
    ratings.className = 'ratings';

    const stars = [];

    const ratingsNum = Math.round(data.rating * 2) / 2;
    for (let i = 0; i < ratingsNum; i++) {
        stars.push({ src: './assets/img/star.svg', alt: 'checked_star' });
    }
    if (ratingsNum - Math.floor(ratingsNum) !== 0) {
        stars.push({ src: './assets/img/star-half.svg', alt: 'half_star' });
    }
    for (let i = 0; i < 5 - Math.ceil(ratingsNum); i++) {
        stars.push({ src: './assets/img/star-outline.svg', alt: 'unchecked_star' });
    }

    stars.forEach(starData => {
        const star = document.createElement('img');
        star.className = 'star';
        star.src = starData.src;
        star.alt = starData.alt;
        ratings.appendChild(star);
    });

    detailsDetailsHeader.append(category, topic, ratings);

    const description = document.createElement('div');
    description.className = 'description';
    description.textContent = `${data.description}`;

    detailsDetails.append(detailsDetailsHeader, description);

    const detailsImgContainer = document.createElement('div');
    detailsImgContainer.className = 'details_img_container flex-grow-1 position-absolute right_300 top-25';

    const detailsImg = document.createElement('img');
    detailsImg.className = 'details_img';
    detailsImg.src = `./assets/img/${data.image}`;
    detailsImg.alt = `${data.topic}`;

    const detailsImgBody = document.createElement('div');
    detailsImgBody.className = 'details_img_body font-weight-2 font-small padding-1';

    const detailsImgText = document.createElement('p');
    detailsImgText.className = 'margin-bottom-1 font-weight-3';
    detailsImgText.innerHTML = 'HTML by <span class="details_author">Sarah Smith</span>';

    const addToFavContainer = document.createElement('div');
    addToFavContainer.className = 'add_to_fav_container padding-1 flex-col align-center';

    const favText = document.createElement('p');
    favText.className = 'align-self-flex-start';
    favText.textContent = 'interested about this topic?';

    const favButton = document.createElement('button');
    favButton.className = 'details_fav_buttons flex-row align-center gap-2';
    favButton.innerHTML = '<span>Add to Favorites</span><img class="details_fav_icon" src="./assets/img/favourites.svg" alt="fav">';

    const unlimitedCredits = document.createElement('span');
    unlimitedCredits.className = 'details_unlimited';
    unlimitedCredits.textContent = 'Unlimited credits';

    addToFavContainer.append(favText, favButton, unlimitedCredits);
    detailsImgBody.append(detailsImgText, addToFavContainer);
    detailsImgContainer.append(detailsImg, detailsImgBody);

    detailsContainer.append(detailsDetails, detailsImgContainer);
    detailsHeader.appendChild(detailsContainer);

    const detailsTopics = document.createElement('div');
    detailsTopics.className = 'details_topics flex-row justify-center';

    const detailsTopicsContainer = document.createElement('div');
    detailsTopicsContainer.className = 'details_topics_container padding-3';

    const detailsTopicsBody = document.createElement('div');
    detailsTopicsBody.className = 'details_topics_body';

    const detailsTopicsHeader = document.createElement('div');
    detailsTopicsHeader.className = 'details_topics_header border-bottom-1 padding-2 font-weight-3 font-large';
    detailsTopicsHeader.textContent = `${data.topic} Sub Topics`;

    const subTopicsContainer = document.createElement('div');
    subTopicsContainer.className = 'details_topics_body';

    for (let i = 0; i < data.subtopics.length; i++) {
        const subTopic = document.createElement('div');
        subTopic.className = 'details_sub_topics border-bottom-1 padding-1 flex-row gap-2';
        subTopic.innerHTML = `<img class="check" src="./assets/img/checkmark-circle.svg" alt="checked"><span>${data.subtopics[i]}</span>`;
        subTopicsContainer.appendChild(subTopic);
    }

    detailsTopicsBody.append(detailsTopicsHeader, subTopicsContainer);
    detailsTopicsContainer.appendChild(detailsTopicsBody);
    detailsTopics.appendChild(detailsTopicsContainer);

    const mainContainer = document.getElementsByTagName('main');
    mainContainer[0].append(detailsHeader, detailsTopics);


}