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
  return null;P
}


// )5 tricky question part sort the array by using sort method
const arr1 = [1,2,10,3];
// console.log(arr1.sort()); // [1, 10, 2, 3] because the sort method sorts the elements as strings by default, so "10" comes before "2" and "3". To sort the array numerically, you can provide a compare function:
// console.log(arr1.sort((a, b) => a - b)); // [1, 2, 3, 10]
// console.log(arr1.sort((a, b) => b - a)); // [10, 3, 2, 1]

console.log(a);

var a = 10;
var b = 20;
