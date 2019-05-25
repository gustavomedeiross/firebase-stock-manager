// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAww0ItGHcpVNgSLusQOoHwepIzTJ8Lk7Y",
    authDomain: "stocksystem-bc235.firebaseapp.com",
    databaseURL: "https://stocksystem-bc235.firebaseio.com",
    projectId: "stocksystem-bc235",
    storageBucket: "stocksystem-bc235.appspot.com",
    messagingSenderId: "959877780274",
    appId: "1:959877780274:web:955b8a6815f033ae"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const auth = firebase.auth();



//DOM starts here

//main elements

//users uid (when it's logged in
var user;

//login
const loginDiv = document.querySelector('div.login-div');
const emailInput = document.querySelector(".login-div input[type='email']");
const passwordInput = document.querySelector(".login-div input[type='password'");
const stayConnectedInput = document.querySelector(".login-div input[type='checkbox']");
const loginButton = document.querySelector(".login-div button");

//content
const contentDiv = document.querySelector('div.content');
const header = document.querySelector('.content header');
const logOutButton = document.querySelector(".content button[type='button']");

//menu items
const menu = document.querySelector('main.menu');
const stockButton = document.querySelector('main.menu button:nth-child(1)');
const registerButton = document.querySelector('main.menu button:nth-child(2)');
const analysisButton = document.querySelector('main.menu button:nth-child(3)');

//backtomenu button
const backToMenuButton = document.querySelector('button.backtomenu');

//stock, register and analysis divs
const stock = document.querySelector('main.stock');
const register = document.querySelector('main.register');
const analysis = document.querySelector('main.analysis');



//DOM Manipulation/firebase

//login

loginButton.addEventListener('click', event => {
  event.preventDefault();
  login();
});


//this will call the checkLoggedUser automatically - it's auto executable
//checks if there is any logged user when the page loads
(function checkLoggedUser(){
  auth.onAuthStateChanged(localUser => {
    if(localUser){
      showPage();
      user = localUser.uid;
    }
  }); 
})();

async function login(){
  try{
    await auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value);
    if(stayConnectedInput.checked){
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    }else{
      auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    }
    showPage();
  }catch(err){
    alert('O seu email ou senha estão incorretos!');
    alert(err);
    emailInput.value = '';
    passwordInput.value = '';
  }
}

function showPage(){
  loginDiv.style.display = 'none';
  contentDiv.style.display = 'block';
}


//content DOM

//logOut function
logOutButton.addEventListener('click', ()=>{
  auth.signOut()
  .then(()=> {
    console.log('Logged out');
    location.href = '';
  })
  .catch(err => alert("Couldn't log out! error: ", err));
});




//main content divs

//makes the "back to menu button" go back to the menu 
backToMenuButton.onclick = () => {
  backToMenuButton.style.display = 'none';
  menu.style.display = 'grid';

  stock.style.display = 'none';
  register.style.display = 'none';
  analysis.style.display = 'none';
}


//makes the stock, register and analysis menu buttons work
stockButton.onclick = ()=> {
  backToMenuButton.style.display = 'inline';
  menu.style.display = 'none';
  stock.style.display = 'block';
  renderStock();
}

registerButton.onclick = ()=> {
  backToMenuButton.style.display = 'inline';
  menu.style.display = 'none';
  register.style.display = 'block';
  // document.body.style.backgroundColor = '#75B5DF';
}

analysisButton.onclick = () => {
  alert('Em breve!');
}


//stock backend integration

async function renderStock(){
  let snapshot = await firestore.collection('usersData').doc(user).get();
  let data = snapshot.data();
  // const table = document.querySelector('.stock table');
  const tbody = document.querySelector('.stock tbody');
  tbody.innerHTML = `<tr>
  <th>Código</th>
  <th>Descrição do Peça</th>
  <th>Tamanho</th>
  <th>Cor</th>
  <th>Material</th>
  <th>Condição</th>
  <th>Estampa</th>
  <th>Data da Compra</th>
  <th>Custo</th>
  <th>Status da Venda</th>
  <th>Data da Venda</th>
  <th>Preço da Venda</th>
  <th>Lucro Bruto</th>
  <th>Edit</th>
  <th>Remove</th>
</tr>`;

  for(let item in data){
    const tr = document.createElement('tr');

    //the name of the object is the actual "codigo" td
    let codTd = document.createElement('td'); 
    codTd.innerHTML = item;  
    tr.appendChild(codTd);

    //loops in every array item
    data[item].forEach((value, index) => {
      let td = document.createElement('td');
      let date;

      //this switch format any td that needs a format (like dates and money)
      switch(index){
        case 6:
          date = new Date(value);
          td.innerHTML = `${date.getDate() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`;
          break;
        case 7:
          td.innerHTML = `R$${value}`;
          break;
        case 8:
          td.innerHTML = value;
          switch(value){
            case 'Vendido':
              td.style.color = '#73eb68';
              break;
            case 'Reservado':
              td.style.color = 'yellow';
              break;
            case 'Pendente':
              td.style.color = '#333';
              break;
          }
          break;
        case 9:
          if(value){
            date = new Date(value);
            td.innerHTML = `${date.getDate() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`;
          }else{
            td.innerHTML = 'N/A'
          }
          break;
        case 10:
          if(value){
            td.innerHTML = `R$${value}`;
          }else{
            td.innerHTML = 'N/A'
          }
          break;
        default:
          td.innerHTML = value;
          break;
      }
      tr.appendChild(td);
    });


    //"lucro bruto" td
    let profitTd = document.createElement('td');
    //checks if the item is sold 
    if(data[item][10]){
      profitTd.innerHTML = `R$${data[item][10] - data[item][7]}`;
    }
    else{
      profitTd.innerHTML = 'N/A';
    }
    tr.appendChild(profitTd);

    let editIcon = document.createElement('td');
    let editImg = document.createElement('img');
    editImg.src = 'logos/edit-icon.png';
    editIcon.appendChild(editImg);
    tr.appendChild(editIcon);


    let removeIcon = document.createElement('td');
    let removeImg = document.createElement('img');
    removeImg.src='logos/remove-icon.png';
    removeIcon.appendChild(removeImg);
    tr.appendChild(removeIcon);

    tbody.appendChild(tr);


    //edit and remove buttons functionality

    //EDIT
    const editDiv = document.querySelector('div.edit');

    editIcon.onclick = () =>{
      editDiv.style.display = 'block';
      tbody.style.display = 'none';
      renderEdit();
    }
    function renderEdit(){
      const editButton = document.querySelector('.edit button');



      

      editButton.addEventListener('click', event => {
        event.preventDefault();
        registerBackEnd(event.target);
        editDiv.style.display = 'none';
        tbody.style.display = 'table-row-group';
        renderStock();
      });

      //this gets the inputs in an array format
      let inputs = document.querySelectorAll('.edit input');
      inputs = [...inputs];
      inputs.splice(9, 0, document.querySelector('.edit select'));

      //this gets an array of the clicked tr
      const editTr = editIcon.parentElement;


      inputs.forEach((input, index) => {
        input.value = '';
        let date;
        let price;

        //this switch formats every value on the td to the edit's input 
        switch(index){
          case 7:
            date = editTr.children[index].textContent;
            date = date.split('/');

            if(date[0].length === 1){date[0] = '0' + date[0]}
            if(date[1].length === 1){date[1] = '0' + date[1]}

            date = `${date[2]}-${date[1]}-${date[0]}`
            input.value = date;
            console.log(date);
            break;
          case 10:
            date = editTr.children[index].textContent;
            date = date.split('/');

            if(date[0].length === 1){date[0] = '0' + date[0]}
            if(date[1].length === 1){date[1] = '0' + date[1]}

            date = `${date[2]}-${date[1]}-${date[0]}`
            input.value = date;
            break;
          case 8:
            price = editTr.children[index].textContent;
            input.value = price.slice(2);
            break;
          case 11:
              price = editTr.children[index].textContent;
              input.value = price.slice(2);
              break;
          default: 
            input.value = editTr.children[index].textContent;
            break;
        }
      });
    }

    //back to table button
    const editAnchor = document.querySelector('.edit a');
    editAnchor.onclick = ()=>{
      editDiv.style.display = 'none';
      tbody.style.display = 'table-row-group';
    }


    //REMOVE
    const removeDiv = document.querySelector('div.remove');
    const buttonYesRemove = document.querySelector('.remove li:nth-child(1)');
    const buttonNoRemove = document.querySelector('.remove li:nth-child(2)');

    removeIcon.addEventListener('click', () =>{
      let removableTr = removeIcon.parentElement;
      
      tbody.style.display = 'none';
      removeDiv.style.display = 'grid';

      //"yes remove function"
      buttonYesRemove.onclick = ()=> {
        deleteItem(removableTr.children[0].textContent)
        .then(()=> {
          tbody.style.display = 'table-row-group';
          removeDiv.style.display = 'none';
        }).catch(err => alert(err));
      };
  
      async function deleteItem(cod){
        try{
          let tempObj = {};
          tempObj[cod] = firebase.firestore.FieldValue.delete();
          await firestore.collection('usersData').doc(user).update(tempObj);
          alert('Item excluído com sucesso!');
          renderStock();
        }catch(err){
          alert(err);
        }
        
      }
    });

    buttonNoRemove.addEventListener('click', ()=> {

      tbody.style.display = 'table-row-group';
      removeDiv.style.display = 'none';
    });

    


  } 
}



//register backend integration

//register button
const registerButtonBackend = document.querySelector('.register button'); 

registerButtonBackend.addEventListener('click', event =>{
  event.preventDefault();
  registerBackEnd(event.target);
})

async function registerBackEnd(target){
  //array of all the inputs
  if(target == registerButtonBackend){
    var inputs = document.querySelectorAll('.register input');
    var selectorInput = document.querySelector('.register select').value;
  }

  if(target == document.querySelector('.edit button')){
    var inputs = document.querySelectorAll('.edit input');
    var selectorInput = document.querySelector('.edit select').value;
  }
  
  let inputsValue = [...inputs].map(input => input.value);
  inputsValue.splice(9, 0, selectorInput);
  let [codigo, ...registerInputs] = inputsValue; 

  //if there isn't any value on the input, it will return null + formats the date
  registerInputs = registerInputs.map(input => {
    if(input === ''){
      return null;
    }
    else{
      return input;
    }
  });


  //this object is created like this to use the "codigo" as the key value for the array
  let tempObj = {};
  tempObj[codigo] = registerInputs;

  try{
    await firestore.collection('usersData').doc(user).update(tempObj);
    alert('Cadastro realizado com sucesso!');

    inputs.forEach(input => input.value = '');

  }catch(err){
    alert('Houve algum problem no cadastro =(');
    alert(err);
  }
}
