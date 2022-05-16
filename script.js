'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale
// DIFFERENT DATA! Contains movement dates, currency and locale
 const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

   const date = new Date(acc.movementsDates[i]);
      const day = `${date.getDate()}`.padStart(2, 0);
      const month = `${date.getMonth() + 1}`.padStart(2, 0);
      const year = date.getFullYear();
      const displayDate = `${day}/${month}/${year}`;


      const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
const startLogoutTimer = function () {
    const tick = function () {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);

        //In each call, print the remaining time to UI
        labelTimer.textContent = `${min}:${sec}`;

        //When 0 sec, stop timer and log out user
        if (time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = 'Log in to get started';
            containerApp.style.opacity = 0;
        }

        //Decrease 1 sec
        time--;
    };
    //Set time to 5 minutes
    let time = 30;
    //Call the timer every second
    tick();
    const timer = setInterval(tick, 1000);
    return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const min = now.getMinutes();
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

//day/month/year

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Timer
        if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);

    //Reset timer
        clearInterval(timer);
        timer = startLogoutTimer();

  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add transfer date
        currentAccount.movementsDates.push(new Date());
        receiverAcc.movementsDates.push(new Date());

    // Update UI
    updateUI(currentAccount);
  }
    //Reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
        // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }, 2500);
      //Reset timer
      clearInterval(timer);
      timer = startLogoutTimer();
}
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log(23 === 23.0);//will log true
// console.log(0.1 + 0.2);//will log 0.30000000000000004
// console.log(0.1 + 0.2 === 0.3); // will log false; error in JS
//
// //Convert a string to a number
// console.log(Number('23'));
// console.log(+'23');
//
// //Parsing
// console.log(Number.parseInt('30px, 10')); //will log 30
// console.log(Number.parseInt('e23', 10)); //will log NaN
// console.log(Number.parseFloat('2.5rem')); //will log 2.5
//
// //Check if value isNaN
// console.log(Number.isNaN('20'));//false
// console.log(Number.isNaN(+'20x')); //true;
// console.log(Number.isNaN(23 / 0)); // false; 23/0 is infinity;
//
// //Best way of checking if value is a number
// console.log(Number.isFinite(20));//true
// console.log(Number.isFinite('20'));//false
// console.log(Number.isFinite(23 / 0));//false
//
// console.log(Number.isInteger(23));//true
// console.log(Number.isInteger(23.0));//true
// console.log(Number.isInteger(23 / 0));//false

// console.log(Math.sqrt(25));//5; square root
// console.log(25 ** (1 / 2)); //5; square root
// console.log(8 ** (1 / 3)); //2; cubic root of 8
//
// console.log(Math.max(5, 18, 23, 11, 2)); //23
// console.log(Math.max(5, 18, '23', 11, 2)); //23; Math.max does type coercion
// console.log(Math.max(5, 18, '23px', 11, 2)); //NaN, Math.max does not parsing
//
// console.log(Math.min(5, 18, 23, 11, 2)); //2
//
// console.log(Math.PI * Number.parseFloat('10px') ** 2); //314.1592653589793; calculate area of a circle
//
// console.log(Math.trunc(Math.random() * 6) + 1);//random number between 0 and 6
//
// const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + 1) + min;
// console.log(randomInt(10, 20));
//
// //Rounding integers
// console.log(Math.trunc(23.3));//23
// console.log(Math.round(23.3));//23
// console.log(Math.round(23.6));//24
//
// console.log(Math.ceil(23.3));//24
// console.log(Math.ceil(23.9));//24
//
// console.log(Math.floor(23.3));//23
// console.log(Math.floor(23.9));//23
//
// console.log(Math.trunc(-23.3));//-23
// console.log(Math.floor(-23.3));// -24
// console.log(Math.trunc(23.3));//23
// console.log(Math.floor(23.3));//23
//
// //Rounding decimals
// console.log((2.7).toFixed(0)); //will return 3 as a string
// console.log((2.7).toFixed(3)); //2.700
// console.log((2.345).toFixed(2)); //2.35
// console.log(+(2.345).toFixed(2)); //2.35 as a number


// //Remainder operator
// console.log(5 % 2); //1
//
// const isEven = n => n % 2 === 0;
// console.log(isEven(8)); //true
// console.log(isEven(23)); //false
// console.log(isEven(514)); //true
//
// labelBalance.addEventListener('click', function () {
//     [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//       //0, 2, 4, 6
//         if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//         //0, 3, 6, 9
//         if (i % 3 === 0) row.style.backgroundColor = 'blue';
//     });
// });
//

// console.log(2 ** 53 - 1); //9007199254740991
// console.log(Number.MAX_SAFE_INTEGER); //9007199254740991
//
// //Creation of BigInt
// console.log(97938398384738473847384n);
// console.log(BigInt(979383983));
//
// //Operations
// console.log(1000n + 1000n);//2000n
// console.log(983803984309489n * 10000000000000n);
//
//
// const huge = 202020200229933993n;
// const num = 23;
// console.log(huge * BigInt(num));//regular number must be converted to BigInt
//
// //Exceptions: logical operators and string concatenation
// console.log(20n > 15);//true
// console.log(20n === 20); //false
// console.log(typeof 20n); //bigint
// console.log(20n == 20); //true
//
// console.log(huge + 'is Really Big');//202020200229933993is Really Big number isn't converted to a string
//
// //Divisions
// console.log(10n / 3n); //3n; it cuts the decimal part off

//Create a date
// const now = new Date();
// console.log(now);//Tue Oct 05 2021 19:49:54 GMT+0300 (Восточная Европа, летнее время)
//
// console.log(new Date('Aug 02 2020 18:05:41'));
// console.log(new Date('December 24, 2015'));
// console.log(new Date(account1.movementsDates[0]));
// console.log(new Date(2037, 10, 19, 15, 23, 5));
// console.log(new Date(2037, 10, 31));//Tue Dec 01 2037 00:00:00 GMT+0200 (Восточная Европа, стандартное время)
// console.log(new Date(0));//Thu Jan 01 1970 03:00:00 GMT+0300 (Восточная Европа, стандартное время)
// console.log(new Date(3 * 24 * 60 * 60 * 1000)); //3 days after Unix time


//Working with dates
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);//Thu Nov 19 2037 15:23:00 GMT+0200 (Восточная Европа, стандартное время)
// console.log(future.getFullYear());//2037
// console.log(future.getMonth());//10
// console.log(future.getDate());//19
// console.log(future.getDay());//4; 4th day of the week is Thursday
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());//2037-11-19T13:23:00.000Z
// console.log(future.getTime());//2142249780000;
// console.log(new Date(2142249780000));//Thu Nov 19 2037 15:23:00 GMT+0200 (Восточная Европа, стандартное время)
// console.log(Date.now());//get the timestamp for right now

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future); //2142249780000; converting data to number with + operator
//
// //function that takes in two dates and return the number of days that pass between
// const calcDaysPassed = (date1, date2) =>
//     Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
// const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
// console.log(days1); //10
//
// const num = 3884764.23;
//
// const options = {
//     style: 'unit',//unit/percent or currency
//     unit: 'mile-per-hour',
// };
// console.log('US:', new Intl.NumberFormat('en-US', options).format(num)); //US: 3,884,764.23 mph
// console.log('Germany:', new Intl.NumberFormat('de-DE').format(num)); //Germany: 3.884.764,23
// console.log('Syria:', new Intl.NumberFormat('ar-SY').format(num)); //Syria: ٣٬٨٨٤٬٧٦٤٫٢٣
// console.log(navigator.language, new Intl.NumberFormat(navigator.language).format(num));// ru-RU 3 884 764,23

// const ingredients = ['olives', 'spinach'];
// const pizzaTimer = setTimeout((ing1, ing2) =>
//     console.log(`Here is your pizza with ${ing1} and ${ing2}`), 3000, ...ingredients);
// console.log('Waiting...'); //Asynchronous JavaScript
//
// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

//setInterval
// setInterval(function () {
//     const now = new Date();
//     console.log(now);
// }, 1000);