function moveZeros(arr) {
  let left = 0;

  for (let right = 0; right < arr.length; right++) {
    if (arr[right] !== 0) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      left++;
    }
  }

  return arr;
}

// console.log(moveZeros([0,1,2,0,3,4]));

//2Find First Non-Repeating Character
const s = "leetcode";
// console.log(findFirstNonRepeatingCharacter(s));
function findFirstNonRepeatingCharacter(s) {
  let charCount = {};
  for (let i = 0; i < s.length; i++) {
    charCount[s[i]] = (charCount[s[i]] || 0) + 1;
  }
  // for (const [i, j] of Object.entries(charCount)) {
  //   if (j == 1) {
  //     return i;
  //   }
  // }
  for (const char in charCount) {
    if (charCount[char] > 1) {
      return char;
    }
  }
  return null;
}

const u = "[()(){}";
// console.log(isValid(u));
function isValid(s) {
  const stack = [];
  const pairs = {
    "}": "{",
    "]": "[",
    ")": "(",
  };

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (s[i] === "(" || s[i] === "{" || s[i] === "[") {
      stack.push(char);
    } else {
      if (stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}

// remove duplicate from sorted array
const nums = [1, 1, 2, 2, 3, 4, 5, 5, 6];
// console.log(removeDuplicate(nums));

function removeDuplicate(nums) {
  if (nums.length == 0) return 0;
  let unique = 0;
  for (let i = 1; i < nums.length; i++) {
    if (nums[unique] !== nums[i]) {
      //1 !== 1
      unique++;
      nums[unique] = nums[i];
    }
  }
  // return nums;
  return nums.slice(0, unique + 1);
}

// =======================
// interview questions
// ========================
const arr = [1, 2, 3];

const res = arr.map((num) => {
  num * 2;
});
// console.log(res) // [undefined, undefined, undefined] because the arrow function does not have a return statement, so it returns undefined for each element. To fix this, you can add a return statement or use parentheses to implicitly return the value:
const resFixed = arr.map((num) => num * 2);
// console.log(resFixed); // [2, 4, 6]

// 2) below code return what ?
const fn = () => 10;
// console.log(fn()) // 10, because the arrow function returns the value 10 when called.

// 3) kids with gretest number of candies
const candies = [2, 3, 5, 1, 3];
const extraCandies = 3;
const target = 8;
// console.log(kidsWithCandies(candies, extraCandies));

function kidsWithCandies(can, ext) {
  const res = [];
  const max = Math.max(...can);
  // console.log(max);
  for (let i = 0; i < can.length; i++) {
    if (can[i] + ext >= max) {
      res.push(true);
    } else {
      res.push(false);
    }
  }
  return res;
}

// 4) find pair which is equal to target sum
// console.log(findPair(candies, target));
function findPair(arr, target) {
  const map = new Map();
  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    if (map.has(complement)) {
      return [complement, arr[i]];
    }
    map.set(arr[i], i);
    console.log(map);
  }
  return null;
  P;
}

// )5 tricky question part sort the array by using sort method
const arr1 = [1, 2, 10, 3];
// console.log(arr1.sort()); // [1, 10, 2, 3] because the sort method sorts the elements as strings by default, so "10" comes before "2" and "3". To sort the array numerically, you can provide a compare function:
// console.log(arr1.sort((a, b) => a - b)); // [1, 2, 3, 10]
// console.log(arr1.sort((a, b) => b - a)); // [10, 3, 2, 1]

// console.log(a);

// var a = 10;
// var b = 20;
// const a = {};

// const b = {
//   key: "b",
// };

// const c = {
//   key: "c",
// };

// a[b] = 100;
// a[c] = 200;

// console.log(a[b]);
// console.log(Boolean("")); // -> false
// console.log(Boolean(" ")); //-> true
// console.log(Boolean(true)); //-> true
// console.log(Boolean(false)); //-> false
// console.log(1 || "nnn", "ppppppppp"); //-> nnnn

// let str = "987";
// console.log(rev(str));
// function rev(str) {
//   return str.split("").reverse().join("")
// }

// just one mismatch in the below code
// const arr2 = ["banaa", "bana",  "banaaa"];
// const t = "banana";
// console.log(findc(arr2, t));
// function findc(arr, target) {
//   let count = 0;
//   let d=0;
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i].length == target.length) {
//       let a = arr[i].split("");
//       let b = target.split("");
//       console.log(a, b);
//       for (let j = 0; j < a.length; j++) {
//         if (a[j] !== b[j]) {
//           count++;
//           d = i
//         }
//       }
//     }
//   }
//   if(count == 1) {
//     return arr[d];
//   }
// }

// const js = "jjvascript";
// console.log(maxChar(js));
// function maxChar(js){
//   let obj = {};
//   for(let i = 0;i<js.length;i++){
//     if(obj[js[i]]){
//       obj[js[i]]++;
//     } else {
//       obj[js[i]] = 1;
//     }
//   }
//   for(const ch in obj) {
//     if( obj[ch] == 1)  return ch;
//   }
// }

// let a = { x: 1 };
// let b = a;
// console.log(a)
// console.log(b)

// b.x = 100;
// console.log(a)
// console.log(b)

// console.log(a.x);

// console.log(typeof NaN); // number
// console.log(NaN == NaN);
// console.log(NaN)
// console.log(NaN === NaN);

// for (let i = 0; i < 3; i++) {
//     setTimeout(() => console.log(i), 0);
// }

// console.log([] + []);
// console.log([] + {});
// console.log({} + []);
// console.log({} + {} );

console.log([[[1]]] + [[[2]]]);
console.log(aaaaaa);
// console.log(b);
var aaaaaa = (b = 200);

const employes = [
  { name: "John", dept: "backend" },
  { name: "Jane", dept: "backend" },
  { name: "Bob", dept: "devops" },
];

// i want group by dept
const groupByDept = employes.reduce((acc, curr) => {
  if (!acc[curr.dept]) {
    acc[curr.dept] = [];
  }
  acc[curr.dept].push(curr);
  return acc;
}, {});
console.log(groupByDept);

// ==========================================system design question========================

// 1) When a user clicks "Logout from All Devices, the backend should perform the following steps:
// ans:
// [Client] ---> POST /api/logout-all ---> [Backend API]
//                                           │
//                                           ▼
//                              [1. Authenticate Request]
//                                           │
//                                           ▼
//                            [2. DB: increment token_version]
//                                 (e.g., version 1 -> 2)
//                                           │
//                                           ▼
//                            [3. DB/Redis: Delete all Refresh Tokens]
//                                           │
//                                           ▼
//                             [4. Clear Cookies / Return 200 OK]

// ==================================================// interview tricky question with answer =========================
console.log(new Date() == new Date()); // because each new Date() creates a new object, and two different objects are never equal in JavaScript, even if they represent the same date and time. Therefore, the comparison returns false.
console.log([] == false); // true, because when comparing an array to a boolean, JavaScript first converts the array to a primitive value. An empty array is converted to an empty string, which is then converted to false when compared to a boolean. Therefore, the comparison returns true.
console.log([] == ![]); // true, because ![] evaluates to false, and [] is converted to an empty string, which is also falsy. Therefore, the comparison returns true.

// const employees = [
//   { name: "John Doe", position: "Software Engineer", city: "New York" },
//   { name: "Jane Smith", position: "Product Manager", city: "Chicago" },
//   { name: "Alice Johnson", position: "UX Designer", city: "Los Angeles" },
//   { name: "Bob Brown", position: "Product Manager", city: "Chicago" },
// ];

// const result = employees.reduce((acc, curr) => {
//   if (!acc[curr.position]) {
//     acc[curr.position] = {};
//   }

//   if (!acc[curr.position][curr.city]) {
//     acc[curr.position][curr.city] = [];
//   }

//   acc[curr.position][curr.city].push(curr);

//   return acc;
// }, {});

// console.log(JSON.stringify(result, null, 2));




// ==========================
// currying
console.log(infiniteAdd(1)(2)(3)(4)()); // 10

function infiniteAdd(a) {
    return function(b) {
        if(b !== undefined) return infiniteAdd(a+b)
            return a;
    }
}


// ===============
// throttle 


function throttle(func,limit) {
    let lastran;
    let lastfunc;

    return function (...args) {
        if(!lastran) {
            func.apply(this,args);
            lastran = Date.now()
        } else {
            clearTimeout(lastfunc)
            lastfunc = setTimeout(() => {
                if(Date.now() - lastran >= limit){
                    func.apply(this,args)
                    lastran = Date.now();
                }
            }, limit - (Date.now() - lastran));
        }
    }
}

const searchinput = throttle((query)=>{
    console.log(`Fetching results for: ${query}`);
},300)

searchinput("n")
searchinput("nfff")
searchinput("nffffffffff")

// ===============================
// debounce

function debounce(func,delay) {
    let timer;

    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this,args)
        }, delay);
    }
}

const searchinput = debounce((query)=>{
    console.log(`Fetching results for: ${query}`);
},300)

searchinput("n")
searchinput("nfff")
searchinput("nffffffffff")


// ===========
// flattenarray
console.log(flattenArray([1, [2, [3, 4], 5], 6])); 

function flattenArray(arr) {
    let res = [];
    for(let i = 0;i<arr.length;i++) {
        if(Array.isArray(arr[i])) {
            res = res.concat(flattenArray(arr[i]))
        } else {
            res.push(arr[i])
        }
    }
    return res
}

// ==================
// parenthesis check 
console.log(isValidParentheses("{[())]}")); // Output: true


function isValidParentheses(arr) {
    let stack = {
        '}' : '{',
        ']' : '[',
        ')' : '('
    };
    let res = []

    for(const ch of arr) {
        if(ch == '{' || ch == '[' || ch == '(' ) {
            res.push(ch)
        } else if(stack[ch]) {
            if(res.pop() !== stack[ch]) {
                return false
            }
        }
    }
    return res.length == 0 ? true : false
}

// =========================
// twosum

console.log(twoSum([2, 7, 11, 15], 9)); 

function twoSum(arr,f) {
    let map = new Map()
    for(let i =0;i<arr.length;i++) {
        let complement = f - arr[i];
        if(map.has(complement)) {
            return [map.get(complement),i]
        }

        map.set(arr[i],i)
    }
    return null
}


// =========================