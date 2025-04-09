const foodTypes = ['cerveza', 'cafe', 'magdalena', 'croassant', 'churros', 'donut', 'patatas', 'huevos', 'tortilla', 
    'perrito', 'quesadilla', 'sandwich', 'croquetas', 'kebap', 'hamburguesa', 'menu'];

    let score = 0;
    let GAME_WIDTH = 800;
let GAME_HEIGHT = 600;
let BASE_FRUIT_SIZE = 40;
const COLLISION_THRESHOLD = 5; 
const FLOOR_HEIGHT_RATIO = 0.95;
const SIZE_INCREASE_RATIO = 1.25;
const BASE_FOOD_WEIGHT = 1; 
const WEIGHT_INCREASE_RATIO = 1.17;

function updateGameDimensions(width, height) {
    GAME_WIDTH = width;
    GAME_HEIGHT = height;
    BASE_FRUIT_SIZE = Math.min(GAME_WIDTH, GAME_HEIGHT) * 0.07;
}