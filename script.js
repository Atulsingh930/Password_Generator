const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generaterButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~-`!@#$%^&*()_—+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;  //It reflect the password in UI.
let checkCount = 1;
handleSlider();
setIndicator("#ccc");



function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    console.log((Math.floor((passwordLength - min)*100/(max - min))) + "% 100%");
    inputSlider.style.backgroundSize = (passwordLength - min)*100/(max - min)+ "% 100%";
}

function setIndicator(color){     //It show the strength of password.
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = color+" 0px 0px 12px 1px";
}

function getradInterger(min, max){
    return Math.floor(Math.random() *  (max - min)) + min; 
}

function generateRandomNumber(){
    return getradInterger(0, 9);
}

function generateLowerCase(){
    return String.fromCharCode(getradInterger(97, 123));
}

function generateUpperCase(){
    return String.fromCharCode(getradInterger(65, 91));
}

function generateSymbol(){
    return symbols.charAt(getradInterger(0, symbols.length));
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let haSymbols = false;

    if(upppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) haSymbols = true;

    if(hasUpper && hasLower && (hasNumber || haSymbols) && passwordLength>=8){
        setIndicator("#0f0");
    }else if((hasLower || hasUpper) && (hasNumber || haSymbols) && passwordLength>=6){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied"
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(shufflePassword){
    for(let i = shufflePassword.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        let temp = shufflePassword[i];
        shufflePassword[i] = shufflePassword[j];
        shufflePassword[j] = temp;
    }
    let str = "";
    shufflePassword.forEach((arr)=>{
        str+=arr;
    });
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckBoxChange)
});

inputSlider.addEventListener("input", (e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener("click", ()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});

generateBtn.addEventListener('click', ()=>{
    if(checkCount<=0) return;

    if(checkCount>passwordLength){
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funcArr = [];
    if(upppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    for(let i = 0; i<funcArr.length; i++){
        password+=funcArr[i]();
    }

    for(let i = 0; i<passwordLength-funcArr.length; i++){
        let randIndex = getradInterger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(password.split(''));

    passwordDisplay.value = password;

    calcStrength();
})