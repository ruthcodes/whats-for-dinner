
let apiKey = //your_key
let apiId = //your_id

document.addEventListener("DOMContentLoaded", function() {

  const ingredients = document.querySelector('#ingredients')
  const exclusions = document.querySelector('#exclude')
  const ingredientList = document.querySelector('#ingredientList')
  const exclusionList = document.querySelector('#exclusionList')
  const form = document.querySelector('#formInputs')
  const addIngredient = document.querySelector('#addIngredient')
  const addExclusion = document.querySelector('#addExclusion')

  ingredients.addEventListener('change', updateList)
  exclusions.addEventListener('change', updateList)


  function updateList(e){
    e.preventDefault()
    if(this.value != ''){
      //create html to be inserted based on submitted values
      const html = `<li><span class="ingr">${this.value}<button class="btn btn-danger" onclick="deleteItem(this)">x</button></span></li>`
      if (this.name === "ingredients"){
        let item = document.getElementById("noIng");
        // if the word none is displayed, remove it
        if (item){
          ingredientList.removeChild(item);
        }
        ingredientList.innerHTML += html
      } else {
        let item = document.getElementById("noExc");
        if (item){
          exclusionList.removeChild(item);
        }
        exclusionList.innerHTML += html
      }
      form.reset();
      return
    }
  }
})

function deleteItem(e){
  // remove parent's parent of button (button -> span -> li)
  e.parentNode.parentNode.remove()
  //if all items have been deleted, add back in "none" li
  if(document.getElementById('ingredientList').getElementsByTagName('li').length <= 0){
    ingredientList.innerHTML += '<li id="noIng">None</li>'
  }
  if(document.getElementById('exclusionList').getElementsByTagName('li').length <= 0){
    exclusionList.innerHTML += '<li id="noExc">None</li>'
  }
}

function submitSearch(){
  //get ingredients from list
  let list = document.getElementById("ingredientList").getElementsByTagName("li");
  let ingredientsList = [];

  for (let item of list) {
    //strip trailing 'x' from delete button attached to each li
    ingredientsList.push(item.innerText.substring(0,item.innerText.length - 1))
  }
  //get exclusions from list
  let exc = document.getElementById("exclusionList").getElementsByTagName("li");
  let exclusionsList = [];
  for (let item of exc) {
    exclusionsList.push(item.innerText.substring(0,item.innerText.length - 1))
  }
  //check for restrictions
  let vegetarian = document.getElementById('vegetarian').checked;
  let vegan = document.getElementById('vegan').checked;
  let lowFat = document.getElementById('low-fat').checked;
  let health = '';
  let diet = '';

  if (vegetarian && vegan){
    health = "&health=vegetarian&health=vegan"
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
    let resultString = '';
    const resultsList = document.querySelector('#resultsList')
    // if there are no results
    if (json.hits.length === 0){
      //add list item to results stating no results
      resultString += "<div>Uh oh, couldn't find any matches. Please update your search criteria and try again.</div>"
      resultsList.innerHTML = resultString;
      document.querySelector('.res').scrollIntoView({ behavior: 'smooth', block: 'start' })
      return;
    }
    //create li for each result
    let counter = 0;
    for (var key in json) {
      if (json.hasOwnProperty(key) && key === "hits") {
          json[key].map(res => {
            counter++;
            resultString += `<a href=${res.recipe.url} target="_blank"><figure class="res col-sm-6"><img src=${res.recipe.image} alt=${res.recipe.label}><figcaption>${res.recipe.label}</figcaption></figure></a>`
            if(counter % 2 == 0){
              resultString += "<div class='clearfix'></div>"
            }
          })
      }
      resultsList.innerHTML = resultString;
      document.querySelector('.res').scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  request();
}
