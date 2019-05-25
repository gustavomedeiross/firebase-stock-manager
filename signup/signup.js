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

const auth = firebase.auth();
const firestore = firebase.firestore();

//DOM
const emailInput = document.querySelector("input[type='email']");
const passwordInput = document.querySelector("input[type='password']");
const createAccountButton = document.querySelector('button');

//location.href='../index.html'
createAccountButton.addEventListener('click', event =>{
  event.preventDefault();
  createAccountFirebase();
});

async function createAccountFirebase(){
  //checks if the accout doesn't exist yet
  try{
    await auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value);
    alert('Usuário já existente!');
    location.href='../index.html';
  }
  //if it doesn't exists: 
  catch(err){
    try{
      let user = await auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value);
      await firestore.collection('usersData').doc(user.user.uid).set({
        exists: true
      });
      alert('Cadastro realizado com sucesso!');
      location.href = '../index.html';
    }catch(err){
      alert(err);
      passwordInput.value = '';
    }
  }
}
