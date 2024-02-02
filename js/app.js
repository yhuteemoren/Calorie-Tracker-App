class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();

    document.getElementById("limit").value == this._calorieLimit;
  }
  // public methods
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeal(meal);
    this._displayNewMeal(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._displayNewWorkout(workout);
    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);
    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._meals.splice(index, 1);
      Storage.removeMeal(id);
      this._render();
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);
    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._workouts.splice(index, 1);
      Storage.removeWorkout(id);
      this._render();
    }
  }
  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
    this._render();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this._displayCaloriesLimit();
    this._render();
  }

  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }

  // private Methods //

  _displayCaloriesTotal() {
    const totalCaloriesEL = document.getElementById("calories-total");
    totalCaloriesEL.innerHTML = this._totalCalories;
  }
  _displayCaloriesLimit() {
    const calorieLimitEL = document.getElementById("calories-limit");
    calorieLimitEL.innerHTML = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedEL = document.getElementById("calories-consumed");
    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    caloriesConsumedEL.innerHTML = consumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEL = document.getElementById("calories-burned");
    const burned = this._workouts.reduce(
      (total, workouts) => total + workouts.calories,
      0
    );
    caloriesBurnedEL.innerHTML = burned;
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingEL = document.getElementById("calories-remaining");
    const remaining = this._calorieLimit - this._totalCalories;
    const progressEL = document.getElementById("calorie-progress");
    caloriesRemainingEL.innerHTML = remaining;
    if (remaining <= 0) {
      caloriesRemainingEL.parentElement.parentElement.classList.remove(
        "bg-light"
      );
      caloriesRemainingEL.parentElement.parentElement.classList.add(
        "bg-danger"
      );
      progressEL.classList.remove("bg-success");
      progressEL.classList.add("bg-danger");
    } else {
      caloriesRemainingEL.parentElement.parentElement.classList.add("bg-light");
      caloriesRemainingEL.parentElement.parentElement.classList.remove(
        "bg-danger"
      );
      progressEL.classList.add("bg-success");
      progressEL.classList.remove("bg-danger");
    }
  }

  _displayCaloriesProgress() {
    const progressEL = document.getElementById("calorie-progress");
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    progressEL.style.width = `${width}%`;
  }

  _displayNewMeal(meal) {
    const mealsEL = document.getElementById("meal-items");
    const mealEl = document.createElement("div");
    mealEl.classList.add("card", "my-2");
    mealEl.setAttribute("data-id", meal.id);
    mealEl.innerHTML = `
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>`;
    mealsEL.appendChild(mealEl);
  }

  _displayNewWorkout(workout) {
    const workoutsEL = document.getElementById("workout-items");
    const workoutEl = document.createElement("div");
    workoutEl.classList.add("card", "my-2");
    workoutEl.setAttribute("data-id", workout.id);
    workoutEl.innerHTML = `
    <div class="card-body">
    <div class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${workout.name}</h4>
      <div
        class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
      >
       ${workout.calories}
      </div>
      <button class="delete btn btn-danger btn-sm mx-2">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>`;
    workoutsEL.appendChild(workoutEl);
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem("calorieLimit") === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem("calorieLimit");
    }
    return calorieLimit;
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem("calorieLimit", calorieLimit);
  }
  static getTotalCalories(defaultCalories = 0) {
    let totalCalories;
    if (localStorage.getItem("totalCalories") === null) {
      totalCalories = defaultCalories;
    } else {
      totalCalories = +localStorage.getItem("totalCalories");
    }
    return totalCalories;
  }

  static updateTotalCalories(calories) {
    localStorage.setItem("totalCalories", calories);
  }

  static getMeals() {
    let meals;
    if (localStorage.getItem("meals") === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem("meals"));
    }
    return meals;
  }
  static saveMeal(meal) {
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  static removeMeal() {
    const meals = Storage.getMeals();
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1);
      }
    });
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  static getWorkouts() {
    let workouts;
    if (localStorage.getItem("workouts") === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem("workouts"));
    }
    return workouts;
  }
  static saveWorkout(workout) {
    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static removework() {
    const workouts = Storage.getWorkouts();
    workouts.forEach((workout, index) => {
      if (workout.id === id) {
        workouts.splice(index, 1);
      }
    });
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static clearAll() {
    // if you want to remove items indidually but keep the limit
    localStorage.removeItem("totalCalories");
    localStorage.removeItem("meals");
    localStorage.removeItem("workouts");

    // if you want to clear the limit
    // localStorage.clear()
  }
}

/*const tracker = new CalorieTracker();

const breakfast = new Meal("Breakfast", 400);
const lunch = new Meal("Lunch", 390);

tracker.addMeal(lunch);
tracker.addMeal(breakfast);

const run = new Workout("Morning Run", 320);
tracker.addWorkout(run);

console.log(tracker._meals);
console.log(tracker._workouts);
console.log(tracker._totalCalories);

 LONG METHOD

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newMeal.bind(this));

    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newWOrkout.bind(this));
  }
  _newMeal(e) {
    e.preventDefault();

    const name = document.getElementById("meal-name");
    const calories = document.getElementById("meal-calories");
    //validate input.

    if (name.value === " " || calories.value === " ") {
      alert("Please fill in all fields");
      return;
    }
    const meal = new Meal(name.value, +calories.value);
    this._tracker.addMeal(meal);
    name.value = " ";
    calories.value = " ";

    const collapseMeal = document.getElementById("collapse-meal");
    const bsCollapse = new bootstrap.Collapse(collapseMeal, { toggle: true });
  }

  _newWOrkout(e) {
    e.preventDefault();

    const name = document.getElementById("workout-name");
    const calories = document.getElementById("workout-calories");
    //validate input.

    if (name.value === " " || calories.value === " ") {
      alert("Please fill in all fields");
      return;
    }

    const workout = new Workout(name.value, +calories.value);
    this._tracker.addWorkout(workout);
    name.value = " ";
    calories.value = " ";

    const collapseWorkout = document.getElementById("collapse-workout");
    const bsCollapse = new bootstrap.Collapse(collapseWorkout, {
      toggle: true,
    });
  }
}

const app = new App(); */

// REFACTORING THE NEW MEAL AND NEW WORKOUT VARIABLES IN THE APP CLASS
class App {
  constructor() {
    this._tracker = new CalorieTracker();

    this._loadEventListeners();
    this._tracker.loadItems();
  }
  _loadEventListeners() {
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newItem.bind(this, "meal"));

    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newItem.bind(this, "workout"));

    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItem.bind(this, "meal"));

    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItem.bind(this, "workout"));

    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"));
    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"));

    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));

    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();

    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    //validate input.

    if (name.value === " " || calories.value === " ") {
      alert("Please fill in all fields");
      return;
    }
    if (type === "meal") {
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
    }

    name.value = "";
    calories.value = "";

    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(collapseItem, { toggle: true });
  }

  _removeItem(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      if (confirm("Are you sure")) {
        const id = e.target.closest(".card").getAttribute("data-id");
        type === "meal"
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);

        e.target.closest(".card").remove();
      }
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    console.log(text);
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;
      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  _reset() {
    this._tracker.reset();
    document.getElementById("meal-items").innerHTML = "";
    document.getElementById("workout-items").innerHTML = "";
    document.getElementById("filter-meals").value = "";
    document.getElementById("filter-workouts").value = "";
  }

  _setLimit(e) {
    e.preventDefault();

    const limit = document.getElementById("limit");

    if (limit.value === "") {
      alert("please add a limit");
      return;
    }

    this._tracker.setLimit(+limit.value);
    limit.value = "";

    const modalEL = document.getElementById("limit-modal");
    const modal = bootstrap.Modal.getInstance(modalEL);
    modal.hide();
  }
}

const app = new App();
