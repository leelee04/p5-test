// récupérer le panier (l’array) via localStorage.
let productInLocalStorage = JSON.parse(localStorage.getItem("basket"));
console.log(productInLocalStorage);
let totalQuantity = 0;
let totalPrice = 0; // on fixe la prix total à 0 de base
//Affichage des éléments du panier
for (let i = 0; i < productInLocalStorage.length; i++) {

  let idproduct = productInLocalStorage[i].id;
  console.log(idproduct);
  fetch(`http://localhost:3000/api/products/${idproduct}`)

    .then(function (reponse) {
      if (reponse.ok) {
        return reponse.json(); // Retour de la réponse au format json
      }
    })
    .then(function (product) { // REMPLIR ICI DYNAMIQUEMENT LE DOM PRODUCT.HTML
      let cartItems = document.getElementById("cart__items");

      // on ajoute l'element article


      //créé chaque élement séparément sans apenchild 

      // on ajoute l'element article
      let cartArticles = document.createElement("article");

      cartArticles.setAttribute("data-id", productInLocalStorage[i].id);
      cartArticles.setAttribute("data-color", productInLocalStorage[i].color)
      cartArticles.className = "cart__item";
      cartItems.appendChild(cartArticles);

      // on ajoute l'element div cart__item__img
      let cartdiv_img = document.createElement("div");
      cartdiv_img.className = "cart__item__img";
      cartArticles.appendChild(cartdiv_img);
      // on ajoute l'element img seul
      let imgCard = document.createElement("img");
      imgCard.setAttribute('src', product.imageUrl);
      imgCard.setAttribute('alt', product.altTxt);
      cartdiv_img.appendChild(imgCard);

      //on ajoute une div (cart__item__content)
      let cartContent_item = document.createElement("div");
      cartContent_item.className = "cart__item__content";
      cartArticles.appendChild(cartContent_item)

      //on ajoute une div (cart__item__content__description)
      let divDescription_item = document.createElement("div");
      divDescription_item.className = "cart__item__content__description";
      cartArticles.appendChild(divDescription_item);

      // on ajoute h2 qui va contenir le nom du produit
      let h2_nameProduit = document.createElement("h2");
      divDescription_item.appendChild(h2_nameProduit);
      h2_nameProduit.innerHTML = product.name;

      // on ajoute p qui va contenir le paragraphe (couleur du produit)
      let color_p_Description = document.createElement("p");
      divDescription_item.appendChild(color_p_Description);
      color_p_Description.innerHTML = productInLocalStorage[i].color;

      //on ajout p qui va contenir le prix 
      let price_description = document.createElement("p");
      divDescription_item.appendChild(price_description);
      price_description.innerHTML = product.price + '€';

      // on rajoute une div de cart__item__content__settings

      let divItem_settings = document.createElement("div");
      divItem_settings.className = "cart__item__content__settings";
      cartContent_item.appendChild(divItem_settings);

      //on rajoute une div de cart__item__content__settings__quantity
      let divQté_item = document.createElement("div");
      divQté_item.className = "cart__item__content__settings__quantity";
      divItem_settings.appendChild(divQté_item);

      //on rajoute la quantité p
      let qté_p = document.createElement("p");
      divItem_settings.appendChild(qté_p);
      qté_p.innerHTML = "Qté : ";

      // dans l'input il va obtenir la quantité
      let input_qté = document.createElement("input");
      divItem_settings.appendChild(input_qté);
      input_qté.value = productInLocalStorage[i].quantity;
      input_qté.className = "itemQuantity";
      input_qté.setAttribute("type", "number");
      input_qté.setAttribute("min", "1");
      input_qté.setAttribute("max", "100");
      input_qté.setAttribute("name", "itemQuantity");

      //on rajoute une div (supprimer) (cart__item__content__settings__delete)
      let cart_itemDelete = document.createElement("div");
      cart_itemDelete.className = "deleteItem";
      divItem_settings.appendChild(cart_itemDelete);

      //on rajoute le lien de suppression
      let btndelete = document.createElement("a");
      btndelete.innerHTML = "supprimer";
      cart_itemDelete.appendChild(btndelete);
      let productQuantity = productInLocalStorage[i].quantity;

      //affichage du prix total


      totalPrice += (productQuantity * product.price);

      let productQuantityNumber = parseInt(productQuantity, 10); //parsint sa transforme les string en number
      totalQuantity += productQuantityNumber;

      let valeurQuantity = document.getElementById('totalQuantity');
      valeurQuantity.innerHTML = totalQuantity;

      // on multiplie la quantité par le prix  (prix récupéré de l'api)

      let productTotalPrice = document.getElementById('totalPrice');
      productTotalPrice.innerHTML = totalPrice;


    })
    .catch(function (erreur) {
      console.log("Message d'erreur : \n" + erreur);
      alert("Une erreur est survenue lors du chargement");
    });


// enregistrer l'id et la couleur séléctionnés par le bouton supprimer
let deleteId = productInLocalStorage[i].idKanap;
let deleteColor = productInLocalStorage[i].colorKanap;

// filtrer l'élément cliqué par le bouton supprimer
  productInLocalStorage = productInLocalStorage.filter(elt => elt.idKanap !== deleteId || elt.colorKanap !== deleteColor);

// envoyer les nouvelles données dans le localStorage
localStorage.setItem('cart', JSON.stringify(productInLocalStorage));

// avertir de la suppression et recharger la page
alert('Votre article a bien été supprimé.');

//Si pas de produits dans le local storage on affiche que le panier est vide
if (productInLocalStorage.length === 0) {
  localStorage.clear();
}
//Refresh rapide de la page
location.reload();

function getTotals() {

  // Récupération du total des quantités
  var elemsQtt = document.getElementsByClassName('itemQuantity');
  var myLength = elemsQtt.length,
    totalQtt = 0;

  for (var i = 0; i < myLength; ++i) {
    totalQtt += elemsQtt[i].valueAsNumber;
  }

  let productTotalQuantity = document.getElementById('totalQuantity');
  productTotalQuantity.innerHTML = totalQtt;

  // Récupération du prix total
  totalPrice = 0;
  for (var i = 0; i < myLength; ++i) {
    totalPrice += (elemsQtt[i].valueAsNumber * productInLocalStorage[i].priceKanap);
  }

  let productTotalPrice = document.getElementById('totalPrice');
  productTotalPrice.innerHTML = totalPrice;
}
getTotals();


function modifyQtt() {
  let qttModif = document.querySelectorAll(".itemQuantity");

  for (let k = 0; k < qttModif.length; k++) {
    qttModif[k].addEventListener("change", (event) => {
      event.preventDefault();

      //Selection de l'element à modifier en fonction de son id ET sa couleur
      let quantityModif = productInLocalStorage[k].qtyKanap;
      let qttModifValue = qttModif[k].valueAsNumber;

      const resultFind = productInLocalStorage.find((el) => el.qttModifValue !== quantityModif);

      resultFind.qtyKanap = qttModifValue;
      productInLocalStorage[k].qtyKanap = resultFind.qtyKanap;

      localStorage.setItem("cart", JSON.stringify(productInLocalStorage));

      // refresh rapide
      location.reload();
    })
  }
}
modifyQtt();




/*
//- Suppression d'un produit au panier 
function removeFromBasket(product){
    let basket = getBasket();
    basket = basket.filter(p => p.id = product.id);
    saveBasket(basket);
    }
    //- Modification de la quantité d'un produit 
    
    function changeqty(product, quantity) {
      let basket = getBasket();
      let productFound = basket.find(p = p.id == product.id);
      if (productFound != undefined) {
        productFound.quantity + -quantity;
        if (productFound.quantity <= 0) {
          removeFromBasket(productFound);
        } else {
          saveBasket(basket);
        }
      }
}
//mise a jour prix total du panier
*/


//formulaire
//ajout des RegExp
let form = document.querySelector(".cart__order__form");
//Expression régulière
let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');

let villeRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
console.log(villeRegExp);
let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");
let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
//charregex

// Ecoute de la modification du prénom
form.firstName.addEventListener('change', function () {
  validFirstName(this);
});

// Ecoute de la modification du prénom
form.lastName.addEventListener('change', function () {
  validLastName(this);
});

// Ecoute de la modification du prénom
form.address.addEventListener('change', function () {
  validAddress(this);
});

// Ecoute de la modification du prénom
form.city.addEventListener('change', function () {
  validCity(this);
});

// Ecoute de la modification du prénom
form.email.addEventListener('change', function () {
  validEmail(this);
});
const validFirstName = function (inputFirstName) {
  let firstNameErrorMsg = inputFirstName.nextElementSibling;

  if (villeRegExp.test(inputFirstName.value)) {
    firstNameErrorMsg.innerHTML = '';
  } else {
    firstNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
  }
};
//validation du nom
const validLastName = function (inputLastName) {
  let lastNameErrorMsg = inputLastName.nextElementSibling;

  if (charRegExp.test(inputLastName.value)) {
    lastNameErrorMsg.innerHTML = '';
  } else {
    lastNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
  }
};
//validation de l'adresse
const validAddress = function (inputAddress) {
  let addressErrorMsg = inputAddress.nextElementSibling;

  if (addressRegExp.test(inputAddress.value)) {
    addressErrorMsg.innerHTML = '';
  } else {
    addressErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
  }
};
//validation de la ville
const validCity = function (inputCity) {
  let cityErrorMsg = inputCity.nextElementSibling;

  if (charRegExp.test(inputCity.value)) {
    cityErrorMsg.innerHTML = '';
  } else {
    cityErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
  }
};

//validation de l'email
const validEmail = function (inputEmail) {
  console.log(inputEmail);
  let emailErrorMsg = inputEmail.nextElementSibling;
  if (emailRegExp.test(inputEmail.value)) {
    emailErrorMsg.innerHTML = '';
  } else {
    emailErrorMsg.innerHTML = 'Veuillez renseigner votre email.';
  }
}};