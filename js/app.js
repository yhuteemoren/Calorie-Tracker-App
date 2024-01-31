class CalorieTracker {
  constructor() {
    this._calorieLimit = 2000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];

    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaliesProgress()
  }
  // public methods
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    this._render();
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
    caloriesRemainingEL.innerHTML = remaining;
  }

_displayCaliesProgress(){
  const progresEL = document.getElementById("calorie-progress")
const percentage = (this._totalCalories / this._calorieLimit ) * 100;
const width = Math.min(percentage, 100)
progresEL.style.width = `${width}%`
}


  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaliesProgress()
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

const tracker = new CalorieTracker();

const breakfast = new Meal("Breakfast", 400);
const lunch = new Meal("Lunch", 350);

tracker.addMeal(lunch);
tracker.addMeal(breakfast);

const run = new Workout("Morning Run", 320);
tracker.addWorkout(run);

console.log(tracker._meals);
console.log(tracker._workouts);
console.log(tracker._totalCalories);
