// Login modal
const log = document.getElementById('loginmodal');

log.addEventListener('submit', function (e) {
    e.preventDefault();

    const loginEmail = document.querySelector('#exampleInputEmail1');
    const loginPwd = document.querySelector('#exampleInputPassword1');

    console.log(loginEmail.value);
    console.log(loginPwd.value);
})

// Signup modal

const signUp = document.querySelector('#signmodal');
signUp.addEventListener('submit', function (e) {
    e.preventDefault();

    const signEmail = document.querySelector('#exampleInputEmail2');
    const signPwd = document.querySelector('#exampleInputPassword2');
    const confirmPwd = document.querySelector('#exampleInputPassword3')

    if (signPwd.value === confirmPwd.value) {
        console.log(signEmail.value);
        console.log(signPwd.value);
    }
})

// Interest and Location

const searchForm = document.querySelector('#searchForm');

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const interest = document.querySelector("#searchInterest");
    const location = document.querySelector('#userLocation');

    console.log(interest.value, location.value);

})


