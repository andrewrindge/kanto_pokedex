/*
 * Name: Andrew Rindge
 * Date: May 2nd, 2020
 * Section: CSE 154 AJ TAs: Tara, Benjamin
 *
 * This is the JS to implement the UI for my Pokedex website. It
 * allows the user to click on each Pokemon, displaying a relevant
 * window of Pokemon information. It fetches data from the PokeApi.
 */
"use strict";

(function() {

  window.addEventListener("load", getAllPokemon);

  /**
   * Fetches the list of 151 Pokemon from PokeApi
   * for processing into cards.
   */
  function getAllPokemon() {
    let url = "https://pokeapi.co/api/v2/pokemon?limit=151";
    fetch(url)
      .then(statusCheck)
      .then(response => response.json())
      .then(processAllPokemon)
      .catch(error => handleError(error));
  }

  /**
   * processAllPokemon fetches individual data of each of the 151 Pokemon
   * @param {JSON} resp is JSON data from PokeApi of 151 Pokemon
   */
  function processAllPokemon(resp) {
    for (const pokemon of resp.results) {
      fetch(pokemon.url)
        .then(statusCheck)
        .then(response => response.json())
        .then(displayPokemon)
        .catch(error => handleError(error));
    }
  }

  /**
   * displayPokemon creates a card for each Pokemon with an image, name
   * and function when clicked.
   * @param {JSON} response is JSON data from PokeApi of one Pokemon
   */
  function displayPokemon(response) {
    let pokemonCard = document.createElement("section");
    pokemonCard.id = response.name;
    id("pokecardcontainer").appendChild(pokemonCard);
    id(response.name).appendChild(getPokemonImage(response));
    let pokemonName = document.createElement("p");
    pokemonName.innerHTML = pokemonCard.id;
    id(response.name).appendChild(pokemonName);
    id(response.name).classList.add("pokecard");
    id(response.name).addEventListener("click", () => {
      pokemonPage(response);
      toggleView();
    });
  }

  /**
   * getPokemonImage creates a HTML image element with Pokemon
   * sprites retrieved from PokeApi
   * @param {JSON} resp is JSON data from PokeApi of one Pokemon
   * @returns {HTMLElement} pokemonImage is an HTML element img
   */
  function getPokemonImage(resp) {
    let pokemonImage = document.createElement("img");
    pokemonImage.src = resp.sprites.front_default;
    pokemonImage.alt = resp.name + " pokemon";
    return pokemonImage;
  }

  /**
   * pokemonPage populates the card of each Pokemon with it's name and
   * image as well as implements a back button.
   * @param {JSON} response is JSON data from PokeApi of one Pokemon
   */
  function pokemonPage(response) {
    id("name").innerText = response.name;
    id("back-btn").addEventListener("click", toggleView);
    id("cardview").replaceChild(getPokemonImage(response), qs("#cardview > img"));
    pokemonTypes(response);
  }

  /**
   * pokemonTypes displays the types of each Pokemon on their respective pages
   * @param {JSON} response is JSON data from PokeApi of one Pokemon
   */
  function pokemonTypes(response) {
    qs(".type").id = response.types[0].type.name;
    qs(".type").innerText = response.types[0].type.name;
    for (let i = 1; i < response.types.length; i++) {
      let addedType = document.createElement("p");
      addedType.innerText = response.types[i].type.name;
      addedType.id = response.types[i].type.name;
      addedType.classList.add("type");
      id("cardview").appendChild(addedType);
    }
  }

  /**
   * toggleView switches the page view from all Pokemon to their individual pages.
   * When returning back to the main page, it scrolls to the top and calls
   * backToMain().
   */
  function toggleView() {
    id("pokemoninfo").classList.toggle("visuallyhidden");
    id("pokecardcontainer").classList.toggle("visuallyhidden");
    id("pokecardcontainer").classList.toggle("flex");
    if (id("pokemoninfo").classList.contains("visuallyhidden")) {
      backToMain();
      document.body.scrollTop = 0;
    }
  }

  /**
   * backToMain removes the added types on individual Pokemon
   * pages if the Pokemon have more than one type, to prevent
   * duplicate types appearing on different individual pages.
   */
  function backToMain() {
    let individualTypes = document.getElementsByClassName("type");
    while (individualTypes.length > 1) {
      individualTypes[1].parentNode.removeChild(individualTypes[1]);
    }
  }

  /**
   * Given CSE 154 function checks that fetch returns an acceptable
   * response (no error).
   * @param {JSON} response is JSON data from PokeApi
   * @throws Will throw an error if fetch response is not correct
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  /**
   * handleError displays a error message to the user on the main page
   * of the site when Pokemon data is not able to be processed from PokeApi
   * @param {Error} err is an error thrown when attempting to fetch
   * data from PokeApi.
   */
  function handleError(err) {
    let userNotification = document.createElement("p");
    userNotification.innerText = "There's been an error in fetching PokeApi data: " + err;
    id("pokemoninfo").appendChild(userNotification);
  }

  /**
   * Given CSE 154 function returns id.
   * @param {elementId} id is an element's id
   * @returns {Element} element that is the first object given the element id
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Given CSE 154 function returns query selector.
   * @param {string} selector is a string selector for page elements
   * @returns {Element} an element selected by selector type
   */
  function qs(selector) {
    return document.querySelector(selector);
  }
})();