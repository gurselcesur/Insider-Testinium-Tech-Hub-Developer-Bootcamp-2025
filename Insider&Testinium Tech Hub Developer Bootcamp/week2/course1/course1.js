const name = prompt("İsminizi girin:");
const age = prompt("Yaşınızı girin:");
const job = prompt("Mesleğinizi girin:");


const user = {
  name: name,
  age: age,
  job: job
};

console.log("Kullanıcı Bilgileri:", user);


let cart = [];


function addProductToCart(name, price) {
  cart.push({ name, price });
}


function listCart() {
  if (cart.length === 0) {
    console.log("Sepetiniz boş.");
    return;
  }
  console.log("Sepetinizdeki Ürünler:");
  cart.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name} - ${product.price} TL`);
  });
}

function removeProductFromCart(productName) {
  const index = cart.findIndex(product => product.name === productName);
  if (index !== -1) {
    cart.splice(index, 1);
    console.log(`${productName} sepetten çıkarıldı.`);
  } else {
    console.log(`${productName} sepetinizde bulunamadı.`);
  }
}

function calculateTotal() {
  const total = cart.reduce((sum, product) => sum + product.price, 0);
  console.log("Sepet Toplamı:", total, "TL");
}

let addMore = true;
while (addMore) {
  const productName = prompt("Sepete eklemek istediğiniz ürünün adını girin:");
  const productPrice = Number(prompt("Ürünün fiyatını girin:"));
  addProductToCart(productName, productPrice);

  addMore = confirm("Başka ürün eklemek ister misiniz?");
}

listCart();

calculateTotal();

const remove = confirm("Sepetten bir ürün çıkarmak ister misiniz?");
if (remove) {
  const removeName = prompt("Çıkarmak istediğiniz ürünün adını girin:");
  removeProductFromCart(removeName);
  listCart();
  calculateTotal();
}
