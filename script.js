
let apiKey = //your key
let apiId = //your ID

document.addEventListener("DOMContentLoaded", function() {

  const ingredients = document.querySelector('#ingredients')
  const exclusions = document.querySelector('#exclude')
  const ingredientList = document.querySelector('#ingredientList')
  const exclusionList = document.querySelector('#exclusionList')
  const form = document.querySelector('#formInputs')

  ingredients.addEventListener('change', updateList)
  ingredients.addEventListener('keyup', updateList)
  exclusions.addEventListener('change', updateList)
  exclusions.addEventListener('keyup', updateList)

  function updateList(e){
    if(e.keyCode === 13){
      const html = `<li><span class="ingr">${this.value}</span></li>`
      if (this.name === "ingredients"){
        ingredientList.innerHTML += html
      } else {
        exclusionList.innerHTML += html
      }
      form.reset();
      return
    }
  }
})

function submitSearch(){
  //get ingredients from list
  let list = document.getElementById("ingredientList").getElementsByTagName("li");
  let ingredientsList = [];

  for (let item of list) {
    ingredientsList.push(item.innerText)
  }
  //get exclusions from list
  let exc = document.getElementById("exclusionList").getElementsByTagName("li");
  let exclusionsList = [];
  for (let item of exc) {
    exclusionsList.push(item.innerText)
  }
  //check for restrictions
  let vegetarian = document.getElementById('vegetarian').checked;
  let vegan = document.getElementById('vegan').checked;
  let lowFat = document.getElementById('low-fat').checked;
  let health = '';
  let diet = '';

  if (vegetarian && vegan){
    health = "&health=vegetarian,vegan"
  } else if (vegetarian){
    health = "&health=vegetarian"
  } else if (vegan){
    health = "&health=vegan"
  }

  if (lowFat){
    diet = "&diet=low-fat"
  }

  //construct query
  let query = "https://api.edamam.com/search?q=" + ingredientsList + "&app_id=" + apiId + "&app_key=" + apiKey + "&excluded=" + exclusionsList + health + diet

  //make async function fetch request
  const request = async () => {
    const response = await fetch(query);
    const json = await response.json();
    //console.log(json);

    const resultsList = document.querySelector('#resultsList')
    //loop through json and create li for each result
    //json.hits
    let resultString = '';
    for (var key in json) {
      if (json.hasOwnProperty(key) && key === "hits") {
          json[key].map(res => {
            resultString += `<li><span class="res">${res.recipe.label}</span></li>`
            //console.log(res.recipe.label)
          })
          //console.log(key + " -> " + json[key]);
      }
      resultsList.innerHTML = resultString;
    }

    //append li to resultsList innerHTML
    //const insert = `<li><span class="res">${this.value}</span></li>`

  }
  request();


}
