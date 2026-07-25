# 1) What is the difference between execution context and execution stack?
 Execution Context
 ---------------

Whenever JavaScript executes code, it creates an Execution Context.

Think of it as a box containing everything needed to execute the code.

It stores

Variables
Functions
this
Outer environment reference

Execution Stack
-------------

Execution Stack is a stack that stores execution contexts.
it follows LIFO(Last In First Out)

# 2) What is the Temporal Dead Zone (TDZ)?
console.log(a);

var a = 10; //undefined   because vaiable  a memory undefined 

console.log(a);

let a = 10; //ReferenceError  because let and const exist in memory but cannot be accessed until initialization. this is called TDZ.

# 3) Why is var hoisted but let is not?
ctually,

both are hoisted. Most developers answer this incorrectly.

var:  undefined      ||   accessible
let:  uninitialized  ||   NOT accessible

# 4) What is a Lexical Environment?
A Lexical Environment is the environment where a function is defined, not where it is called.
It contains: Variables, functions, Reference to its parent (outer lexical environment)

------
let a = 10;

function outer() {
    let b = 20;

    function inner() {
        console.log(a);
        console.log(b);
    }

    inner();
}
----
outer();

Global Lexical Environment
    a = 10
       │
       ▼
Outer Lexical Environment
    b = 20
       │
       ▼
Inner Lexical Environment
-------

When inner() looks for b, it finds it in outer.

When it looks for a, it goes to the global environment.

This search is called the Scope Chain.

# 5) What is Scope Chain?
A Scope Chain is the sequence JavaScript follows to find a variable.
It starts from the current scope and moves outward until the variable is found.

# 6) What is Closure?
A Closure is created when an inner function remembers variables from its outer function, even after the outer function has finished executing.

Uses: Data hiding, private variables, Event handlers, Timers, Module pattern.

# 7)  What is Hoisting?
Hoisting means JavaScript moves declarations into memory before execution starts.

# 8) Difference Between Function Declaration and Function Expression?
Function Declaration: function add() {} ,            Can be called before declaration.
Function Expression:  const add = function () {}; ,  Cannot be called before declaration. reason const is temporal dead zone.

# 9) What is an IIFE?
IIFE stands for Immediately Invoked Function Expression.
(function () {
    console.log("Executed");
})();
Before ES6 modules, developers used IIFEs to:

Avoid global variables, Create private scope, Prevent naming conflicts.

# 10) Difference Between Deep Copy and Shallow Copy?
Shallow Copy: Copies only the first level. , Nested objects still share references
const a = {
    name:"Raj",
    address:{
        city:"Ahmedabad"
    }
};

const b = {...a};

b.address.city = "Delhi";   Both objects now show "Delhi" because address is shared.

Deep Copy
--------
Creates completely independent nested objects.
const b = JSON.parse(JSON.stringify(a)); (Works only for JSON-safe data.)

# 11) What is the difference between call(), apply(), and bind()?
All three methods are used to change the value of this.

call()
Invokes the function immediately.
Arguments are passed individually.

apply()
Invokes the function immediately.
Arguments are passed as an array.

bind()
Does not execute immediately.
Returns a new function.

# 12) 
# 13) 
# 14) 
# 15) 