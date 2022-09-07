//------------------------VARIABLES---------------------------------------//

const WHEEL_OUTER_CIRCLE = document.querySelector('#wheel-outer-circle');


const ADD_HABIT_FORM = document.querySelector('#add-habit-form');
const HABIT_NAME = document.querySelector('#habit-name');
const START_TIME_HOUR = document.querySelector('#start-time-hour');
const START_TIME_MIN = document.querySelector('#start-time-min');
const END_TIME_HOUR = document.querySelector('#end-time-hour');
const END_TIME_MIN = document.querySelector('#end-time-min');

const ALL_HABITS_ARRAY = [];

const SAVE_HABITS_BUTTON = document.querySelector('#save-habits-button');
const LOAD_HABITS_BUTTON = document.querySelector('#load-habits-button');
const CLEAR_MEMORY_BUTTON = document.querySelector('#clear-memory-button');
const REMOVE_HABIT_BUTTON = document.querySelector('#remove-habit-button');

const CREATE_HABIT_BUTTON = document.querySelector('#create-habit-button');
const ADD_HABIT_FORM_WRAPPER = document.querySelector('#add-habit-form-wrapper');
const CREATE_HABIT_FORM_CLOSE = document.querySelector('#create-habit-form-close');

const HOUR_HAND = document.querySelector('#hour-hand');

//--------------------CREATE HABIT--------------------------------------------//

function timeToRotation(hour, min){
    let time = hour*1+min/60;
    return time*15-90;
}

function createHabitContainer(){
    let habitContainer = document.createElement('div');
    habitContainer.setAttribute('class', 'habit-container');
    return habitContainer;
}

function createLine(name, hour, min){
    let rotation = timeToRotation(hour, min);
    let line = document.createElement('div');
    line.setAttribute('class', 'habit-line');
    // line.setAttribute('id', `${name}`+'-'+'start-line')
    line.setAttribute('style', 'transform: rotate('+rotation+'deg)');
    return line;
}

function createHabitName(name, startHour, startMin, endHour, endMin){
    let habitNameWrapper = document.createElement('div');
    let habitName = document.createElement('span');
    let startRot = timeToRotation(startHour, startMin);
    let endRot = timeToRotation(endHour, endMin);
    habitName.innerText = `${name}`;
    //habitNameWrapper.setAttribute('id', '')
    habitNameWrapper.setAttribute('class', 'habit-name');
    habitNameWrapper.setAttribute('style', 'transform: rotate('+((startRot+endRot)/2)+'deg)');
    // WHEEL_OUTER_CIRCLE.append(habitNameWrapper);
    habitNameWrapper.append(habitName);
    if(startHour >= 12 && endHour >= 12){
        habitName.setAttribute('style', 'transform: rotate(180deg); display: inline-block;');
    } else if(startHour >= 12 && endHour < 12) {
        habitNameWrapper.setAttribute('style', 'transform: rotate('+((startRot+endRot)/2+180)+'deg)');
    }
    return habitNameWrapper;
}

function createHabit(name, startHour, startMin, endHour, endMin){
    createHabitContainer();
    let habitContainer = createHabitContainer();
    let startLine = createLine(name, startHour, startMin);
    let endLine = createLine(name, endHour, endMin);
    let habitName = createHabitName(name, startHour, startMin, endHour, endMin);
    habitContainer.append(startLine);
    habitContainer.append(endLine);
    habitContainer.append(habitName);
    WHEEL_OUTER_CIRCLE.append(habitContainer);
}

class Habit {
    constructor(name, startHour, startMin, endHour, endMin){
        this.name = name;
        this.startHour = startHour;
        this.startMin = startMin;
        this.endHour = endHour;
        this.endMin = endMin;
    }
}

ADD_HABIT_FORM.addEventListener('submit', e => {
    e.preventDefault();
    createHabit(HABIT_NAME.value, START_TIME_HOUR.value, START_TIME_MIN.value, END_TIME_HOUR.value, END_TIME_MIN.value);
    let newHabit = new Habit(HABIT_NAME.value, START_TIME_HOUR.value, START_TIME_MIN.value, END_TIME_HOUR.value, END_TIME_MIN.value);
    ALL_HABITS_ARRAY.push(newHabit);
    ADD_HABIT_FORM_WRAPPER.style.display = 'none';
})

//-------------------------CREATE HABIT POPUP----------------------//

CREATE_HABIT_BUTTON.addEventListener('click', () => {
    ADD_HABIT_FORM_WRAPPER.style.display = 'block';
})

CREATE_HABIT_FORM_CLOSE.addEventListener('click', () => {
    ADD_HABIT_FORM_WRAPPER.style.display = 'none';
})

//------------------------SAVE AND LOAD HABITS----------------------------------//

function saveHabits(){ 
    for(i=0; i < ALL_HABITS_ARRAY.length; i++){
        localStorage.setItem('habit'+''+i, JSON.stringify(ALL_HABITS_ARRAY[i]));
        }
    }

function loadHabits(){
    for(i=0; i < localStorage.length; i++){
        let habit = JSON.parse(localStorage.getItem('habit'+''+i));
        createHabit(habit.name, habit.startHour, habit.startMin, habit.endHour, habit.endMin);
    }
}

SAVE_HABITS_BUTTON.addEventListener('click', () => {
    saveHabits();
    buttonColorCheck();
})

LOAD_HABITS_BUTTON.addEventListener('click', () => {
    loadHabits();
    buttonColorCheck();
})

loadHabits();

//-----------------------CLEAR MEMORY AND REMOVE LAST HABIT----------------------//

CLEAR_MEMORY_BUTTON.addEventListener('click', () => {
    localStorage.clear();
    buttonColorCheck();
})

REMOVE_HABIT_BUTTON.addEventListener('click', () => {
    WHEEL_OUTER_CIRCLE.removeChild(WHEEL_OUTER_CIRCLE.lastChild);
    ALL_HABITS_ARRAY.pop();
})

//-----------------------HOUR HAND---------------------------------//

const clock = () => {
    const now = new Date();
    const hours = now.getHours();
    const min = now.getMinutes();
    let timeRot = timeToRotation(hours, min);
    HOUR_HAND.setAttribute('style', 'transform: rotate('+`${timeRot}`+'deg);'); 
} 
setInterval(clock, 1000);

//---------------------BUTTON COLOR CHECK---------------------------//

function buttonColorCheck(){
    if(localStorage.length === 0){
    SAVE_HABITS_BUTTON.setAttribute('class', 'btn btn-success');
    LOAD_HABITS_BUTTON.setAttribute('class', 'btn btn-secondary');
    CLEAR_MEMORY_BUTTON.setAttribute('class', 'btn btn-secondary');
} else if(localStorage.length > 0){
    SAVE_HABITS_BUTTON.setAttribute('class', 'btn btn-secondary');
    LOAD_HABITS_BUTTON.setAttribute('class', 'btn btn-primary');
    CLEAR_MEMORY_BUTTON.setAttribute('class', 'btn btn-danger');
}
}
buttonColorCheck();