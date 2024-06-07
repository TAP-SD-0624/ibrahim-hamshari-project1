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


const darkButton = document.getElementById("dark-mode");
const favButton = document.getElementById("fav");
darkButton.addEventListener("click", () => {
    const isDark = localStorage.getItem("dark");
    let brandPrimary 
    let brandSecondary
    let bgDefault
    let bgBody
    let linesColor
    let bodyText
    let heartColor
    if(isDark === "true"){
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
    else{
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