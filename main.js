const inputBtn = document.getElementById('submit-btn').addEventListener('click',
    (e) => {
        // clean UI in every search
        document.getElementById('error-message').innerHTML = '';
        document.getElementById('meal-items').innerHTML = '';
        document.getElementById('product-info').innerHTML = "";
        // to prevent the default load for 'form' tag we will use this
        e.preventDefault();
        const inputValue = document.getElementById('input-value').value;
        document.getElementById('error-message').innerHTML = '';
        if (inputValue.length > 0) {
            // document.getElementById('spinner').style.display='block'//avabe block korle spin hoi na kenooo??
            document.getElementById('spinner').classList.remove('d-none');
            loadData(inputValue);
        } else {
            const showError = document.getElementById('error-message');
            showError.innerHTML = `<div class="bg-danger bg-danger-gradient text-center p-3 m-3 rouded-2">
        <P class="fw-bold fs-2">Please give a meal name</p>`
        }

    })
// use input value
const loadData = (input) => {
    if (input.length == 1) {
        displayMeals(`https://www.themealdb.com/api/json/v1/1/search.php?f=${input}`)
    } else {
        displayMeals(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`)
    }
}
// get data using dynamic url
const fetchData = async (url) => {
    const res = await fetch(url);
    const data = await res.json()
    return data;

}
// display meals by getting them with dynamic api link
const displayMeals = (url) => {
    fetchData(url)
        .then(data => {
            // turn of the spinner again
            document.getElementById('spinner').classList.add('d-none');
            document.getElementById('spinner').style.display = 'none';
            const mealContainer = document.getElementById('meal-items');
            // get all food items one by one
            data.meals.forEach(element => {
                const { strMealThumb, strMeal, strInstructions, idMeal } = element;
                // console.log(element)
                const mealDiv = document.createElement('div');
                mealDiv.classList.add('col')
                mealDiv.innerHTML = `<div class="card">
           <img src="${strMealThumb}" width="300px"height="180px"class="card-img-top" alt="...">
    <div class="card-body py-3">
        <h5 class="card-title">${strMeal}</h5>
        <p class="card-text">${strInstructions.slice(0, 120)}</p>
        <button onclick="getDetails('${strMeal}')" class="btn btn-primary w-100 my-0" >Show Details</button>
    </div>
    </div>`;
                mealContainer.appendChild(mealDiv);
            });

        })
        .catch(err => {
            errorMessage();
        })
}



//show  details

const getDetails = (name) => {

    window.scroll(0, 40);
    // aita kivabe kah kore clear na/////////
    const detailsContainer = document.getElementById('product-info');
    fetchData(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`).then(data => {
        const selectedFood = data.meals[0];
        // console.log(selectedFood)
        const { strMeal, strMealThumb, idMeal } = selectedFood;
        detailsContainer.innerHTML = `
        <div class="card mx-auto" style="width: 25rem;">
       <img src="${strMealThumb}" class="card-img-top img-fluid" alt="...">
      <div class="card-body">
    <h5 class="fw-bold fs-1 card-title text-secondary">${strMeal}</h5>
      <p class="fw-bold fs-2 text-center mb-0 text-danger">Ingredients</p>
     </div>
      <ul class="list-group list-group-flush text-center fs-4 fw-bold" id="ingredient-list">
    </ul>
    <div class="card-body d-flex justify-content-center align-items-center">
    <button onclick="addToCart('${idMeal}')" class="btn btn-outline-primary btn-sm" >Add To Cart</button>
   </div>
</div>`

        // get ingredients
        const ingredientContainer = document.getElementById('ingredient-list');
        for (i = 1; i <= 20; i++) {
            const ingredientKey = 'strIngredient' + i;
            // akhane dot dia property access kora jabe na..jehteo agula direct property  na
            const ingredientName = selectedFood[ingredientKey];
            const ingredientQuantity = 'strMeasure' + i;
            const totalQuantity = selectedFood[ingredientQuantity];
            const listItem = `${ingredientName} ${totalQuantity}`;
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerText = listItem;
            if (listItem.indexOf('null null' == -1) && (listItem.length > 2)) {
                // akono null value astaca keno?????
                ingredientContainer.appendChild(li);
                ingredientContainer.style.listStyle = 'none';
            }
        }
    }
    )


}
// how to upgrade shopping cart and quantiy there



// error message handling
const errorMessage = () => {
    const inputValue = document.getElementById('input-value').value;
    const errorContainer = document.getElementById('error-message');
    errorContainer.innerHTML = ` <div class="card m-auto p-5 bg-danger bg-danger-gradient" style="width: 18rem">
          <h5 class="card-title">Dear User,</h5>
          <p class="card-text">
            Your search --<b>${inputValue}</b>-- did not match any of our set meal. Please enter a
            correct name.
          </p>
        </div>`;
}

