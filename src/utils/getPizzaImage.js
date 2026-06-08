import margheritaImg from '../assets/images/margherita.png';
import farmhouseImg from '../assets/images/farmhouse.png';
import veggieDelightImg from '../assets/images/veggie_delight.png';
import mexicanGreenWaveImg from '../assets/images/mexican_green_wave.png';
import deluxeVeggieImg from '../assets/images/deluxe_veggie.png';
import indiTandooriPaneerImg from '../assets/images/indi_tandoori_paneer.png';
import cheeseNCornImg from '../assets/images/cheese_n_corn.png';
import freshVeggieImg from '../assets/images/fresh_veggie.png';
import paneerMakhaniImg from '../assets/images/paneer_makhani.png';
import margheritaSpecialImg from '../assets/images/margherita_special.png';
import veggieParadiseImg from '../assets/images/veggie_paradise.png';
import veggieSupremeImg from '../assets/images/veggie_supreme.png';

import pepperoniImg from '../assets/images/pepperoni.png';
import bbqChickenImg from '../assets/images/bbq_chicken.png';
import chickenSausageImg from '../assets/images/chicken_sausage.png';
import meatzaaImg from '../assets/images/meatzaa.png';
import keemaDoPyazaImg from '../assets/images/keema_do_pyaza.png';

// NEW ADDITIONAL PIZZAS
import peppyPaneerImg from '../assets/images/peppy_paneer.png';
import vegExtravaganzaImg from '../assets/images/veg_extravaganza.png';
import chickenGoldenDelightImg from '../assets/images/chicken_golden_delight.png';
import nonVegSupremeImg from '../assets/images/non_veg_supreme.png';
import fourCheeseSupremeImg from '../assets/images/four_cheese_supreme.png';
import bbqChickenClassicImg from '../assets/images/bbq_chicken_classic.png';
import chickenDominatorImg from '../assets/images/chicken_dominator.png';
import nonVegExtravaganzaImg from '../assets/images/non_veg_extravaganza.png';
import italianPepperoniImg from '../assets/images/italian_pepperoni.png';

// THE FINAL 4 PIZZAS
import chickenFiestaImg from '../assets/images/chicken_fiesta.png';
import doubleCheeseMargheritaImg from '../assets/images/double_cheese_margherita.png';
import spicyChickenImg from '../assets/images/spicy_chicken.png';
import mushroomFeastImg from '../assets/images/mushroom_feast.png';

const pizzaImageMap = {
  // VEG PIZZAS
  "margherita pizza": margheritaImg,
  "farmhouse pizza": farmhouseImg,
  "veggie delight pizza": veggieDelightImg,
  "mexican green wave": mexicanGreenWaveImg,
  "deluxe veggie": deluxeVeggieImg,
  "indi tandoori paneer": indiTandooriPaneerImg,
  "cheese n corn pizza": cheeseNCornImg,
  "fresh veggie": freshVeggieImg,
  "paneer makhani": paneerMakhaniImg,
  "margherita special": margheritaSpecialImg,
  "veggie paradise": veggieParadiseImg,
  "veggie supreme": veggieSupremeImg,
  "peppy paneer": peppyPaneerImg,
  "veg extravaganza": vegExtravaganzaImg,
  "four cheese supreme": cheeseNCornImg, // Replaced coffee stand with cheese pizza
  "double cheese margherita": doubleCheeseMargheritaImg,
  "mushroom feast": deluxeVeggieImg, // Veg

  // NON-VEG PIZZAS
  "pepperoni pizza": pepperoniImg,
  "bbq chicken pizza": bbqChickenImg,
  "chicken sausage pizza": chickenSausageImg,
  "meatzaa pizza": meatzaaImg,
  "keema do pyaza": keemaDoPyazaImg,
  "chicken dominator": chickenDominatorImg,
  "non veg extravaganza": nonVegExtravaganzaImg,
  "italian pepperoni": pepperoniImg, // AI
  "chicken golden delight": chickenGoldenDelightImg,
  "non veg supreme": nonVegSupremeImg,
  "bbq chicken classic": bbqChickenClassicImg,
  "chicken fiesta pizza": keemaDoPyazaImg, // Replaced meatballs with Indian meat pizza
  "spicy chicken pizza": chickenSausageImg // Replaced spaghetti with chicken pizza
};

export function getPizzaImage(pizza) {
  const name = pizza?.name?.toLowerCase().trim() || "";

  if (pizzaImageMap[name]) {
    return pizzaImageMap[name];
  }

  const isNonVeg = ["chicken", "meat", "pepperoni", "beef", "pork", "bacon", "keema", "non veg", "bbq", "sausage", "extravaganza"].some(kw => name.includes(kw));
  
  if (isNonVeg) {
    return meatzaaImg; // Safe generic meat fallback
  } else {
    return veggieDelightImg; // Safe generic veg fallback
  }
}
