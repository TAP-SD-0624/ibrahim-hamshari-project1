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
        console.log(isDark)
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
        console.log(isDark)


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
        const ratings = Math.round(data.ratings*2)/2;
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