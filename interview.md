for IOT please search -> "IOT(1)"
for SQL please search -> "SQL(2)"
for REACT please search -> "REACT(3)"
for GIT please search -> "GIT(4)"
for MONGODB please search -> "MONGODB(5)"
for WEBSOCKET please search -> "WEBSOCKET(6)"
for REDIS please search -> "REDIS(7)"
for NGNIX please search -> "NGNIX(8)"

# 0.1) What is Node.js?
Node.js is a JavaScript runtime built on Chrome's V8 engine that allows us to execute JavaScript outside the browser. It is commonly used for building APIs, backend services, real-time applications, and microservices.

# 1) What is the difference between execution context and execution stack?
Execution Context
---
Whenever JavaScript executes code, it creates an Execution Context.
Think of it as a box containing everything needed to execute the code.
It stores

Variables
Functions
this
Outer environment reference

## Execution Stack
------------------
Execution Stack is a stack that stores execution contexts.
it follows LIFO(Last In First Out)

# 2) What is the Temporal Dead Zone (TDZ)?
console.log(a);
var a = 10; //undefined because vaiable a memory undefined
console.log(a);
let a = 10; //ReferenceError because let and const exist in memory but cannot be accessed until initialization. this is called TDZ.

# 3) Why is var hoisted but let is not?
actually,

both are hoisted. Most developers answer this incorrectly.

var: undefined || accessible
let: uninitialized || NOT accessible

# 4) What is a Lexical Environment?
A Lexical Environment is the environment where a function is defined, not where it is called.
It contains: Variables, functions, Reference to its parent (outer lexical environment)

---

let a = 10;

function outer() {
let b = 20;

    function inner() {
        console.log(a);
        console.log(b);
    }

    inner();

## }

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

---

When inner() looks for b, it finds it in outer.

When it looks for a, it goes to the global environment.

This search is called the Scope Chain.

# 5) What is Scope Chain?
A Scope Chain is the sequence JavaScript follows to find a variable.
It starts from the current scope and moves outward until the variable is found.

# 6) What is Closure?

A Closure is created when an inner function remembers variables from its outer function, even after the outer function has finished executing.

Uses: Data hiding, private variables, Event handlers, Timers, Module pattern.

# 7) What is Hoisting?

Hoisting means JavaScript moves declarations into memory before execution starts.

# 8) Difference Between Function Declaration and Function Expression?

Function Declaration: function add() {} , Can be called before declaration.
Function Expression: const add = function () {}; , Cannot be called before declaration. reason const is temporal dead zone.

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

b.address.city = "Delhi"; Both objects now show "Delhi" because address is shared.

## Deep Copy

A deep copy duplicates the top-level object and recursively clones all nested objects, creating a completely independent duplicate.
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

# 12) What is the Event Loop?

The Event Loop is the core mechanism that allows Node.js to perform non-blocking, asynchronous 
I/O operations despite JavaScript being single-threaded.

The Node.js event loop consists of **six** distinct major phases that execute sequentially in a continuous circle to handle asynchronous operations.

┌───────────────────────────────────────────┐
│                  TIMERS                   │ <── setTimeout(), setInterval()
└─────────────────────┬─────────────────────┘
                      ▼
┌───────────────────────────────────────────┐
│             PENDING CALLBACKS             │ <── Deferred system/error callbacks
└─────────────────────┬─────────────────────┘
                      ▼
┌───────────────────────────────────────────┐
│               IDLE, PREPARE               │ <── Node.js internal use only
└─────────────────────┬─────────────────────┘
                      ▼
┌───────────────────────────────────────────┐
│                   POLL                    │ <── Incoming I/O, events, data
└─────────────────────┬─────────────────────┘
                      ▼
┌───────────────────────────────────────────┐
│                   CHECK                   │ <── setImmediate()
└─────────────────────┬─────────────────────┘
                      ▼
┌───────────────────────────────────────────┐
│              CLOSE CALLBACKS              │ <── socket.on('close', ...)

1. Timers Phase
===============
Purpose: Executes callbacks scheduled by setTimeout() and setInterval().
Behavior: The event loop checks if any timers have exceeded their specified threshold. If their threshold is met, the loop runs their callbacks.

2. Pending Callbacks Phase [it handles system level errors]
==========================
Purpose: Processes system-level callbacks deferred from previous iterations.
Behavior: This handles rare scenarios like a TCP socket receiving an ECONNREFUSED error while attempting to connect.

3. Idle, Prepare Phase
======================
Purpose: Housekeeping for internal operations.
Behavior: Only used internally by Node.js and the underlying libuv library; developers cannot pass code to this phase.

4. Poll Phase
=============
Purpose: Retrieves new input/output (I/O) events and executes almost all I/O-related callbacks.Behavior:If the queue is not empty, Node processes the callbacks sequentially until completion or limits are reached.
-> If the queue is empty and setImmediate() scripts exist, the event loop ends the poll phase and shifts to the check phase.
-> If the queue is empty and no setImmediate() scripts exist, the loop blocks and waits for new connections or I/O events to be added to the queue.

5. Check Phase
==============
Purpose: Executes callbacks scheduled by setImmediate().
Behavior: Allows developers to run code immediately after the poll phase has wrapped up.

6. Close Callbacks Phase
========================
Purpose: Cleans up closed resources.
Behavior: If a socket or handle is closed abruptly (e.g., socket.destroy()), the 'close' event callback is executed here.


# to detect how event loop  blocking
I would use:

Application monitoring
Event-loop lag metrics
APM tools
CPU profiling
Node.js diagnostic tools

I would correlate event-loop lag with CPU utilization and slow requests.


# 13) What is the Thread Pool in Node.js?

Node.js has a Thread Pool managed by libuv.
Default size: 4 threads
Used for operations such as: fs.readFile(), crypto.pbkdf2(), bcrypt, zlib, Some DNS lookups

---

## Can you increase the thread pool size? -> yes UV_THREADPOOL_SIZE=8 node app.js, Maximum allowed is 1024,

# 14) What is Middleware?

Middleware is a function that executes between receiving the request and sending the response.
It has access to: req, res, next
Without next(), the request will never reach the next middleware or route handler.
Types of Middleware : Application Middleware, Router Middleware, Error Middleware, Built-in Middleware, Third-party Middleware

# 15) What is Dependency Injection (DI)?

Dependency Injection is a design pattern where dependencies are provided to a class instead of the class creating them.

## Without DI problem is: Tight coupling, Hard to test, Difficult to replace implementations

class UserService {
constructor() {
this.userRepo = new UserRepository();
}
}

## with DI , -> Loose coupling, Easy testing, Better maintainability

@Injectable()
export class UserService {
constructor(private readonly userRepo: UserRepository) {}
}

# 16) What are Providers in NestJS?

Providers are classes managed by NestJS's Dependency Injection container.
Examples: Services, Repositories, Factories, Helpers

@Injectable()
export class UserService {}

Register:
@Module({
providers: [UserService],
})
export class UserModule {}

Now it can be injected anywhere.

# 17) Explain the NestJS Request Lifecycle.

Client Request -> Middleware (Logging, parsing) -> Guards (Authentication & authorization) -> Interceptors (Before) -> Pipes (Validation & transformation) -> Controller -> Service -> Interceptors (After) (Logging, caching, response transformation) -> Exception Filter (Exception handling) -> Response

# 18) What is a Guard?

Guards determine whether a request is allowed to reach the controller.
Used for: JWT authentication, Role-based access, Permissions

# 19) What are Pipes?

Pipes validate and transform incoming data.

# 20) What are Interceptors?

Interceptors execute code before and after the controller.
Use cases: Logging, Caching, Response formatting, Execution time

# 20) What are Exception Filters?

Exception Filters handle errors globally.
@Catch(HttpException)
export class HttpExceptionFilter
implements ExceptionFilter {

catch(exception, host) {

}

}
Benefits: Centralized error handling, Consistent API responses, Cleaner controllers

# 21) What is EventEmitter in Node.js?

EventEmitter allows objects to emit and listen for custom events.
It follows the Publisher–Subscriber (Pub/Sub) pattern.
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("userRegistered", (user) => {
console.log(`Welcome ${user}`);
});

emitter.emit("userRegistered", "Rajesh");

Real-world Use Cases: Send email after registration, Log user activity, Notifications, Background tasks

# 22) What are Custom Decorators in NestJS?

A custom decorator lets you create reusable metadata or parameter extraction logic.
ex:

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
(data, ctx: ExecutionContext) => {
const request = ctx.switchToHttp().getRequest();
return request.user;
},
);

usage:
@Get()
getProfile(@CurrentUser() user) {
return user;
}

Instead of repeatedly writing:
req.user

# 23) What is Circular Dependency?

A circular dependency occurs when two classes depend on each other.
Solution: Use forwardRef().

imports: [
forwardRef(() => AuthModule)
]

# 24) What are Dynamic Modules?

Dynamic modules allow runtime configuration.
DatabaseModule.forRoot({
host:"localhost"
})
Instead of hardcoding values.

Used by: TypeORM, ConfigModule, PassportModule

# 25) How do WebSockets work in NestJS?

NestJS supports WebSockets using gateways.
ex: @WebSocketGateway()
export class ChatGateway {}

socket -> server -> boardcast

Use Cases: Chat applications, Stock market updates, Live sports scores, Notifications

# 26) What is the difference between emit() and on()?

emit() triggers an event.
on() registers a listener for that event.

# 27) What is ExecutionContext?

It provides details about the current execution, such as the request, response, handler, and controller. It works across HTTP, WebSockets, and microservices

# 28) What is the difference between interface and type?

## interface

Used mainly to define the shape of objects.
interface User {
id: number;
name: string;
}

## Type

Can define objects, unions, intersections, tuples, primitives, etc.
type User = {
id: number;
name: string;
}
Union (only possible with type) ex-> type Status = "pending" | "success" | "failed";

# 29) What are Generics?

Generics allow writing reusable code while preserving type safety.
Without Generic
function print(value: any) {
return value;
} problem: no type saftey

## With Generic

function print<T>(value: T): T {
return value;
}
use Generics: for Reusable code, Type safety, Better IntelliSense

# 30) Difference between any, unknown, and never?

any: No type checking. let a: any = 10; a= 'hello', a = true
unknown: Cannot use directly. let value: unknown; value = "Hello";
console.log(value.length); -> error need check type

        if(typeof value === "string"){
            console.log(value.length);
        }

never: Represents values that never occur.
function error(): never {
throw new Error();
}

# 31) Explain Utility Types?

## Partial: Makes all properties optional.

interface User{

    name:string;

    age:number;

}

type T = Partial<User>;

result:
{
name?;

    age?;

}

## Required: Everything mandatory.

Required<User>

## Pick: Creates a new type by selecting a specific subset of keys.

Pick<User,"name">
{
name:string;
}

## omit: Creates a new type by excluding specific properties.

Omit<User,"age">
{
name:string;
}

## Record: Constructs an object type with specific keys mapped to a single value type.

Record<string,number>
const marks: Record<string, number> = {
maths:90,
science:95
};

# 32) What happens when you call app.listen() in Express?

app.listen() internally creates an HTTP server using Node's http.createServer(app) and starts listening on the specified port.

# 33) What is Backpressure in Node.js?

Backpressure occurs when data is produced faster than it can be consumed.
we can solve by using pipe.

# 34) What is Stream Piping?

Instead of manually reading and writing
const fs = require("fs");

fs.createReadStream("input.txt")
.pipe(fs.createWriteStream("output.txt"));

Benefits: Less memory, Faster, Automatic backpressure handling

# 35) What is a Reverse Proxy?

A Reverse Proxy sits between clients and backend servers.
Client
│
▼
Reverse Proxy
│
├── Node Server 1
├── Node Server 2
└── Node Server 3

Benefits: Security, SSL Termination, Load Balancing, Caching, Compression
example: NGINX receives requests and forwards them to Express.

# 36) What is NGINX?

NGINX is a high-performance web server and reverse proxy.
example:
server {
listen 80;

    location / {
        proxy_pass http://localhost:3000;
    }

}

Common Uses: Reverse Proxy, Static File Hosting, Load Balancing, SSL, Gzip Compression

# 37) Access Token vs Refresh Token?

| Access Token            | Refresh Token                      |
| ----------------------- | ---------------------------------- |
| Short-lived             | Long-lived                         |
| Used to access APIs     | Used to generate new access tokens |
| Sent with every request | Stored securely                    |
| Expires quickly         | Used only when needed              |

# 38) What is a Webhook?

A webhook is a mechanism where one application pushes data to another when an event occurs.
Payment Success

↓

Razorpay

↓

POST /payment/webhook

↓

Your Server

Instead of repeatedly asking: Has payment completed?

the payment provider notifies your application automatically.

Use Cases: Stripe, Razorpay, GitHub, Slack

# 39) What is Normalization? Why is it used?

Normalization organizes data into multiple related tables to reduce redundancy and improve data integrity.

Without Normalization
Users

---

id | name | city | state | country
1 | Raj | Ahmedabad| Gujarat | India
2 | Amit | Ahmedabad| Gujarat | India

Here, "Ahmedabad, Gujarat, India" is repeated.

if i separate city, state and country dont repeated same name will store only their id.
Benefits: Less duplicate data, Better consistency, Easier updates

# 40) What is Denormalization?

Denormalization combines tables to improve read performance.

Instead of joining multiple tables:
SELECT u.name, c.city
FROM users u
JOIN city c ON u.city_id = c.id;

store the city directly:
Users

---

Raj | Ahmedabad

Benefits: Faster reads, Fewer joins
Drawback: More duplicate data, Harder to keep data consistent

# 41) What is Redis?

Redis (Remote Dictionary Server) is an in-memory NoSQL data store used for caching, sessions, pub/sub, queues, and real-time applications.

Unlike MySQL, Redis stores data in RAM, making it extremely fast.
Features: In-memory database, Key-value store, Extremely fast, Supports persistence, Pub/Sub, TTL (Time-To-Live)

# 42) What is a Message Queue?

A Message Queue (MQ) allows two services to communicate asynchronously without waiting for each other.
Without Queue:

---

Client
│
▼
API
│
├── Save User
├── Send Email
├── Send SMS
├── Generate PDF
└── Push Notification
The client waits until everything finishes.

## With Queue:

Client
│
▼
API
│
├── Save User
└── Push Job to Queue
│
▼
Worker Processes
├── Email
├── SMS
├── PDF
└── Notification
The API responds immediately while workers process tasks in the background.

Advantages:: Faster API response, Better scalability, Retry failed jobs, Decouple services,
Real-world Example:

    When a user registers:

        Save user immediately
        Add email job to queue
        Worker sends welcome email later

# 43) RabbitMQ vs Kafka

| RabbitMQ                                    | Kafka                                               |
| ------------------------------------------- | --------------------------------------------------- |
| Message Broker                              | Event Streaming Platform                            |
| Deletes message after consumer acknowledges | Stores messages for a configurable retention period |
| Best for background jobs                    | Best for real-time streaming                        |
| Low latency                                 | High throughput                                     |
| Complex routing                             | High scalability                                    |

RabbitMQ Use Cases: Email, SMS, OTP, PDF generation, Invoice generation
Kafka Use Cases: Stock Market, Banking transactions, Fraud Detection, Log Processing, Analytics

Interview Answer: RabbitMQ is ideal for reliable task processing, while Kafka is designed for processing large volumes of event streams.

# 44) What is an Exchange in RabbitMQ?

An Exchange receives messages from producers and decides which queue(s) should receive them.
Producer

↓

Exchange

↓

Queue A

Queue B

Queue C
Without an exchange, producers would need to know every queue.

## Exchange Types

## 1)Direct Exchange

Routes by exact routing key.
email

↓

Email Queue

## 2)Fanout Exchange

Broadcasts to every queue.
Notification

↓

Queue A

Queue B

Queue C

## 3)Topic Exchange

Routes based on pattern matching on the routing key using wildcards (\* = one word, # = zero or more words)
order.created

order.\*

## 4)Headers Exchange

Routes based on message headers instead of routing keys.

# 45) What is Message Acknowledgement (ACK)?

Message Acknowledgement (ACK) is how a consumer tells RabbitMQ "I successfully processed this message, you can safely delete it from the queue." It's the mechanism that prevents message loss if a consumer crashes or fails mid-processing.

How it works:
Consumer receives message → processes it → sends ACK → RabbitMQ removes message from queue

If the consumer crashes or disconnects before sending an ACK, RabbitMQ assumes the message wasn't handled and re-queues it to be delivered again (to the same or another consumer).

## Types of acknowledgement

## 1)Manual ACK (recommended for reliability)

You explicitly call channel.ack(message) in your code after processing succeeds
Gives you full control — only acknowledge once you're sure the work is done

## 2)Auto ACK (noAck: true)

RabbitMQ marks the message as acknowledged the moment it's delivered, not after processing
Risky: if your consumer crashes mid-processing, the message is already gone — RabbitMQ won't re-deliver it, and you lose it silently.

## Related: NACK (Negative Acknowledgement)

channel.nack(message) — tells RabbitMQ "I couldn't process this," and you can choose to:
Requeue it (requeue: true) — try again, possibly with another consumer
Discard it (requeue: false) — drop it, or send to a dead-letter queue if configured

## ex-

// Example in a raw amqplib consumer
channel.consume('myQueue', (msg) => {
try {
processMessage(msg.content.toString());
channel.ack(msg); // only ack after success
} catch (err) {
channel.nack(msg, false, true); // requeue on failure
}
}, { noAck: false });

# 46) What is a Dead Letter Queue (DLQ)?

A Dead Letter Queue (DLQ) is a special queue where "failed" messages get redirected instead of being lost or endlessly retried — it acts as a safety net for messages that couldn't be processed successfully.

## When a message becomes "dead"

A message gets sent to a DLQ when one of these happens:

-> Rejected/NACKed with requeue: false — consumer explicitly says "don't try again"
-> TTL (Time-To-Live) expires — message sat in the queue too long unprocessed
-> Queue length limit exceeded — queue is full, oldest/overflow messages get dead-lettered
-> Max retry count exceeded — if you've built retry logic, after N failed attempts the message goes to DLQ instead of looping forever

## How it's set up in RabbitMQ

You don't get a DLQ automatically — you configure it by adding arguments to your original queue:
channel.assertQueue('myQueue', {
arguments: {
'x-dead-letter-exchange': 'dlx', // exchange to route dead messages to
'x-dead-letter-routing-key': 'failed' // optional: routing key for the DLQ
}
});

// Then set up the actual DLQ, bound to that exchange
channel.assertExchange('dlx', 'direct');
channel.assertQueue('myQueue.dlq');
channel.bindQueue('myQueue.dlq', 'dlx', 'failed');

so the flow likes: Main Queue → (message fails) → Dead Letter Exchange → Dead Letter Queue

Why it matters

Without a DLQ, a "poison message" (one that always fails processing — bad data, bug, etc.) with requeue: true would loop forever, wasting resources and potentially blocking other messages. With a DLQ, it gets pulled out after failing, so you can:

Inspect it later — debug why it failed
Alert on it — monitor DLQ size, alert if messages pile up
Manually reprocess it once the bug is fixed, or discard it

# 47) What is PM2?

PM2 is a Node.js Process Manager.
Features: Auto Restart, Load Balancing, Clustering, Log Management, Zero Downtime Deployment, Monitoring
pm2 list, pm2 logs, pm2 restart app, pm2 stop app

PM2 is used in production to manage Node.js applications, automatically restart crashed processes, and enable clustering.

# 48) What causes Memory Leaks in Node.js?

A memory leak occurs when memory is allocated but never released.
-> global.users = []; -> Memory grows continuously.
-> emitter.on("event", handler); -> Unremoved Event Listeners
-> setInterval(() => {

},1000); Runs forever unless cleared.

-> Map (large cache)

↓

Millions of Objects -> never deleted

## Detection Tools

Chrome DevTools, Heap Snapshot, Clinic.js, node --inspect

# 49) what is docker ?

a docker is a tool that simplifies developing, packaging and deploying applications.
propoties of docker:-
a)efficiency: starts in a seconds, uses fewer system resources
b)portability: runs anywhere in local machine, cloud, and servers
c)consistency: same behavior in developement, testing, and production
d)scalability: ideal for microservices

# 50) What is an Image?

An image is a read-only blueprint/template for a container. It contains the application code, dependencies, and instructions for how to run it.
Built from a Dockerfile
Stored in layers (each instruction in the Dockerfile adds a layer, which helps with caching and reuse)
Can be shared via registries like Docker Hub

# 51) What is a Container?

A container is a running instance of an image. If the image is the blueprint, the container is the actual live, running thing — with its own filesystem, network, and process space, but sharing the host machine's OS kernel (unlike a full virtual machine).

# 52) What is a Dockerfile?

A text file with step-by-step instructions for building an image.

# 53) What is Docker Hub?

A public (and private) registry where Docker images are stored and shared — similar to how GitHub hosts code, Docker Hub hosts images. docker pull and docker push interact with registries like this.

# 54) What is a Volume?

A mechanism for persisting data outside a container's lifecycle. Containers are ephemeral — delete the container, and its internal filesystem changes are gone. Volumes let you store data (like a database's files) separately, so it survives even if the container is removed.

# 55) What is Docker Compose?

A tool for defining and running multi-container applications using a single YAML file (docker-compose.yml) — e.g., spinning up your Node.js app, a PostgreSQL database, and a Redis cache together with one command instead of managing each container manually.

# 56) difference between function declaration and function expressions?.

A Function Declaration defines a standalone function using the function keyword followed by a mandatory function name.
Key Characteristic: Hoisting
Function declarations are hoisted entirely to the top of their scope during compile time. This means you can invoke/call the function before it is actually defined in your code.

ex-
// ✅ Works fine due to Hoisting
sayHello();

function sayHello() {
console.log("Hello World!");
}

====
A Function Expression creates a function inside an expression (most commonly by assigning an anonymous or named function to a variable using const, let, or var).
Key Characteristic: No Function Hoisting
Only the variable declaration is hoisted, not the function assignment itself. If you try to execute it before its definition, JavaScript will throw an error (ReferenceError or TypeError).

ex-
// ❌ Uncaught ReferenceError: Cannot access 'sayHello' before initialization
sayHello();

const sayHello = function() {
console.log("Hello World!");
};

Real-World Examples & When to Use Which::::::::::;; a) Use Function Declarations for Top-Level Utility Helpers [main business logic or reusable code entire project]

b)Use Function Expressions for Callbacks & Array Methods:::::::::::
When you need to pass a function directly as an argument to another function (e.g., event listeners, route handlers, async pipeline processing). filter, map etc.

# 57) difference between for or and for in loop ?

for...in iterates over the keys (property names or array indexes) of an object or array.

for...of iterates over the values directly from an iterable object (like Arrays, Maps, Sets, or Strings).

# 58) async and await ?

# async

Placed before a function declaration or expression (e.g., async function() {} or const fn = async () => {}).
it always return promise

# await

Placed before a Promise call (e.g., const data = await fetch(url)).
: It pauses the execution of the surrounding async function until the Promise settles (resolves or rejects).

# 59) what is event driven architecture in node js ?
Event-driven architecture (EDA) in Node.js is a software design pattern where the flow of the program is determined by events (like user clicks, database updates, or HTTP requests) rather than a rigid, sequential line of code.

Core Concepts of Node.js EDA
============================
The entire architecture relies on three primary components working together:
Events:
=======
 Named signals indicating that something specific has occurred in the system.

Event Emitters (Producers):
==========================
Core objects that detect state changes and broadcast (emit) named events.

Event Listeners & Handlers (Consumers): 
======================================
Callback functions tied to specific events that execute business logic when triggered.

ex- 
=====
const EventEmitter = require('events');

// Create a custom emitter instance
const orderEmitter = new EventEmitter();

// 1. Define an Event Listener (Consumer)
orderEmitter.on('orderPlaced', (orderId, total) => {
    console.log(`📦 Shipping service notified for Order #${orderId} (Total: $${total})`);
});

orderEmitter.on('orderPlaced', (orderId) => {
    console.log(`📧 Confirmation email sent for Order #${orderId}`);
});

// 2. Trigger the Event (Producer)
console.log("Processing customer checkout...");
orderEmitter.emit('orderPlaced', 1042, 89.99); 
console.log("Moving on to other system tasks smoothly!");

# 60) what is buffer ?
In Node.js, a Buffer is a globally available class used to handle, manipulate, and store raw binary data.
Under the hood, modern Node.js implements Buffer as a direct subclass of JavaScript's Uint8Array.

Key Characteristics of a Buffer
==============================
Fixed Size:
==========
Once created, a buffer’s memory size cannot be changed.

Raw Memory Allocation: 
=====================
Memory is allocated raw outside the V8 JavaScript engine heap.

Global Object: 
==============
You do not need to use require() or import to use it in your code.

Array of Bytes:
==============
It behaves like an array of integers, where each element represents exactly 1 byte of data (a value from 0 to 255). When printed, Node.js displays these values in hexadecimal format to keep it readable.

Common Use Cases:: -> File System Operations, Streams, Network Packets

# 61) what is spawn and fork in node js ?
In Node.js, spawn() and fork() are methods from the child_process module. They help you run another process separately from your main Node.js process.
This is useful when you have CPU-heavy work, need to execute an external command, or want to isolate work from the main application.

1) child_process.spawn():
========================
spawn launches a new command in a separate process and streams its output. It can run any system command or non-Node script (e.g., Python, Bash scripts, C++ executables, ls, grep).

Data Transmission: Communicates via standard I/O streams (stdout, stderr, stdin).

Memory Usage: Highly efficient for large data transfers because it processes data via Node.js Streams instead of loading everything into memory at once.

Communication Channel: No built-in Inter-Process Communication (IPC) channel for JavaScript objects.

2)child_process.fork():
======================
fork is a specialized variation of spawn designed specifically to execute Node.js modules (.js files). It creates a new V8 engine instance to run another Node process.

Data Transmission: Automatically opens a built-in IPC (Inter-Process Communication) channel between the parent and child process.

Message Passing: Allows exchanging JavaScript objects directly using .send() and .on('message').

Resource Cost: Heavier overhead than spawn because it spawns an entirely new V8 instance for each child process.

# 62) streams and buffers
streams in node js are way to handle contineous flow of data.
they enable reading or writing data piece by piece instead of loading entire data in memory.
A buffer in node js is a temporary storage area for binary data.
buffers work as chunk of data  enableing efficient data manipulation in streams.
it helps to decrease memory consuption of your web server.
there are 4 types of streams in node js i,e a)writeable, b)readable , c) transform , d)duplex

example -
=========
const fs = require('fs');
const { Transform } = require('stream');

// 1. Create a Readable Stream from the source file
const readStream = fs.createReadStream('input.txt');

// 2. Create a Writable Stream to the destination file
const writeStream = fs.createWriteStream('output.txt');

// 3. Create a Transform Stream to manipulate the buffer chunks mid-flight
const uppercaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    // 'chunk' is a raw Buffer object containing binary data
    console.log('--- Processing New Chunk Buffer ---');
    console.log('Raw Buffer:', chunk); 
    console.log('As Text Before:', chunk.toString());

    // Modify the binary buffer data by converting it to an uppercase string
    const upperText = chunk.toString().toUpperCase();

    // Push the transformed data back out as a new Buffer allocation
    const modifiedBuffer = Buffer.from(upperText);
    this.push(modifiedBuffer);

    // Tell the stream system it is ready for the next incoming chunk
    callback();
  }
});

// 4. Pipe the data together: Source -> Transform -> Destination
readStream
  .pipe(uppercaseTransform)
  .pipe(writeStream);

writeStream.on('finish', () => {
  console.log('\nStream processing complete! Check output.txt.');
});


# 63) What is cluster?
The Cluster module provides a way to create multiple worker processes that share the same server port.

Since Node.js is single-threaded by default, the Cluster module helps your application utilize multiple CPU cores, significantly improving performance on multi-core systems.

Each worker runs in its own process with its own event loop and memory space, but they all share the same server port.

The master process is responsible for creating workers and distributing incoming connections among them.

How Clustering Works:
====================
The Cluster module works by creating a master process that spawns multiple worker processes.
The master process doesn't execute the application code but manages the workers.
Each worker process is a new Node.js instance that runs your application code independently.

# 64) How can Node.js use multiple CPU cores?
Node.js JavaScript execution is primarily single-threaded per process. To utilize multiple CPU cores, 
we can use: Cluster, Worker Threads, Multiple processes/containers, Horizontal scaling

# 65) What happens if you don't handle a Promise rejection?
It can result in an unhandled promise rejection. Depending on the Node.js version and application configuration, this can produce warnings or terminate the process.

# 66)
# 67)
# 68)
# 69)
========================================================================================
                                    REACT(3)
========================================================================================

# 1) What is React?
React is a JavaScript library for building user interfaces, developed by Facebook. It uses component-based architecture and virtual DOM.

# 2) what is React hooks ?

React Hooks are built-in JavaScript functions that allow you to use state and other React features inside functional components.
Why Use Hooks?
===========
Eliminate Class Boilerplate: No more this.state, this.setState, or binding event handlers in constructors.

Reusable Stateful Logic: You can extract component logic into custom hooks without altering your component hierarchy.

Group Related Logic: Instead of splitting logic across componentDidMount and componentWillUnmount, hooks let you organize code by what it does rather than when it runs.

The Fundamental Rules of Hooks::
Call hooks at the top level only: Do not call hooks inside loops, conditions, or nested functions.

Call hooks from React functional components only: Or from custom hooks (do not call them in plain JavaScript functions).

1. # useState (State Management)
   What it does: Allows functional components to store and update local memory/data across re-renders.

Why & Where to use: Form inputs, toggle buttons, modal open/close states, UI tab selections.

2. # useEffect (Side Effects & Lifecycle)
   What it does: Executes code after rendering. Handles side effects like fetching data, manually manipulating the DOM, or setting up subscriptions.

Why & Where to use: API data fetching on page load, setting up interval timers, subscribing to WebSockets.

3. # useRef (DOM Access & Mutable Values without Re-rendering)
   What it does: Returns a mutable ref object whose .current property persists across renders. Changing a ref does NOT trigger a re-render.

Why & Where to use: Storing DOM node references (focusing inputs, scrolling), keeping track of timer IDs (setInterval), or storing previous values.

4. # useContext (Global State Sharing without Prop Drilling)
   What it does: Consumes values provided by a React.createContext() parent provider anywhere deep in the component tree.

Why & Where to use: App-wide themes (Dark/Light mode), user authentication sessions, localized settings.

5. # useMemo & useCallback (Performance Optimization)
   useMemo: Caches (memoizes) the result of an expensive calculation so it doesn't recalculate on every render.

useCallback: Caches a function instance so child components receiving it as a prop don't re-render unnecessarily.

---

Modern React Form & Async Hooks (useActionState, useOptimistic)
React 19 builds on hooks to handle server mutations and form state natively:

useActionState: Manages form submit actions and returns pending states and returned errors directly without writing manual try...catch block state setters.

useOptimistic: Instantly updates the UI with expected data while an API request completes in the background (and auto-reverts if the network request fails).

# 3) What is JSX?
JSX stands for JavaScript XML. It allows us to write HTML-like code inside JavaScript.

# 4) What is the Virtual DOM?
Virtual DOM is a lightweight copy of the real DOM. React updates the Virtual DOM first, compares it with the previous version (diffing), and then updates only the changed parts in the real DOM.

# 5) What is the difference between Real DOM and Virtual DOM?
Real DOM is slower to update. Virtual DOM is faster because it minimizes direct manipulation of the browser DOM.

# 6) What are Components in React?
Components are independent, reusable pieces of UI. They can be Functional or Class-based.

# 7) What is the difference between Functional and Class Components?
Functional components are simpler and use Hooks. Class components use this and lifecycle methods.

# 8) What are Props?
Props (properties) are read-only data passed from parent to child component.

# 9) What is State?
State is a built-in object that stores data that can change over time within a component.

# 10) What is the difference between Props and State?
Props are passed from outside (immutable). State is managed inside the component (mutable).

# 11) What is useState Hook?
useState is a Hook that lets you add state to functional components.

# 12) What is useEffect Hook?
useEffect lets you perform side effects (API calls, subscriptions, DOM updates) in functional components.

# 13) What is the difference between useEffect and lifecycle methods?
useEffect combines componentDidMount, componentDidUpdate, and componentWillUnmount.

# 14) What are Keys in React?
Keys help React identify which items have changed, been added, or removed in lists. They should be unique.

# 15) What is the difference between Controlled and Uncontrolled Components?
Controlled → form data is handled by React state.
Uncontrolled → form data is handled by the DOM itself (using ref).

# 16) What is ref in React?
ref is used to access DOM elements or component instances directly.

# 17) What is Conditional Rendering?
Rendering different UI based on conditions using if, ternary operator, or &&.

# 18) What are Events in React?
Events in React are actions triggered by user interactions—such as clicks, mouse hovers, form submissions, or keystrokes—that allow your application to respond with specific logic.

core concepts of react events ->
a) Synthetic Events: React wraps the browser's native events into a normalized object called a SyntheticEvent.
b)Event Delegation: Rather than attaching individual event listeners to every single DOM node, React attaches a single listener to the root element of your app. This boosts memory efficiency and performance.

# 19) What is Prop Drilling?
Passing props through multiple nested components even if intermediate components don’t need them.
to solve prop drilling problem we can use -> Using Context API, Redux, Zustand, or component composition.

# 20) What is React.memo()?
React.memo is a higher-order component that memoizes the result and prevents unnecessary re-renders.

# 21) What is the difference between useMemo and useCallback?
useMemo → memoizes a value.
useCallback → memoizes a function.

# 22) What is Context API?
Context API provides a way to share data across the component tree without prop drilling.

# 23) What is the difference between Context API and Redux?
Context is built-in and good for simple global state. Redux is more powerful for large applications with complex state logic.

# 24) What is useRef?
useRef returns a mutable object that persists across renders. Commonly used for accessing DOM or storing values without re-rendering.

# 25) What is useReducer?
useReducer is an alternative to useState for managing complex state logic (similar to Redux reducers).

# 26) What is Custom Hook?
A custom Hook is a reusable function that starts with use and can call other Hooks.

# 27) What is the difference between useEffect and useLayoutEffect?
useLayoutEffect runs synchronously after DOM mutations (before paint). useEffect runs asynchronously after paint.

# 28) What is Code Splitting?
Technique to load only the required code using React.lazy() and Suspense.

# 29) What is React.lazy() and Suspense?
React.lazy() enables dynamic import of components. Suspense shows fallback UI while loading.

# 30) What is Reconciliation?
The process by which React updates the DOM by comparing the new Virtual DOM with the previous one.

# 31) What are Pure Components?
React.PureComponent implements shouldComponentUpdate with shallow comparison of props and state.

# 32) What is the difference between createElement and JSX?
JSX is syntactic sugar that converts to React.createElement() calls.

# 33) What is Server-Side Rendering (SSR)?
Rendering React components on the server and sending HTML to the client (improves SEO and initial load).

# 34) What is the difference between SSR, SSG, and CSR?

CSR → Client-Side Rendering
SSR → Server-Side Rendering
SSG → Static Site Generation

# 35) What is Next.js?
A React framework that supports SSR, SSG, routing, API routes, and more.

# 36) What is Hydration?
The process of attaching event listeners to server-rendered HTML so it becomes interactive.

# 37) What is Redux?
A state management library that uses a single store, actions, and reducers.

# 38) What are Redux Toolkit and RTK Query?
Redux Toolkit simplifies Redux usage. RTK Query is for data fetching and caching.

# 39) What is the difference between Redux and Context API?
Redux is better for large apps with complex state. Context is lighter for simpler cases.

# 40) What is Error Boundary?
A component that catches JavaScript errors in child components and displays a fallback UI.

# 41) What is Redux?
Redux is a predictable state management library for JavaScript apps (most commonly used with React).
It helps you manage global state in a centralized place called the Store.

Why do we need Redux?
==================
Avoid Prop Drilling
Manage complex state
Predictable state updates
Easy debugging (Redux DevTools)

core components are:
===================
store -> Holds the entire application state
action -> Plain object that describes what happened
reducer -> Pure function that updates state based on action
dispatch -> Method used to send an action to the store
subscribe -> Listen to store changes

Redux Data Flow (One-way) =====> Component → dispatch(action) → Reducer → Store → Component re-renders

Important Rules of Redux
=======================
Single Source of Truth → One store
State is Read-Only → Only change via actions
Changes are made with Pure Functions → Reducers must be pure

# 42) What is an Action?
A plain JavaScript object that has a type field and describes what happened.

# 43) What is a Reducer?
A pure function that takes current state and action, then returns the next state.

# 44) What is a Store?
The object that holds the application state and provides methods like getState(), dispatch(), subscribe().

# 45) What is dispatch?
A method used to send an action to the Redux store.

# 46) What is the difference between Props and Redux State?
Props are passed from parent. Redux state is global and accessible from any component.

# 47) What is Prop Drilling? How does Redux solve it?
Prop Drilling is passing data through many levels. Redux stores data globally so any component can access it directly.

# 48) What is a Pure Function?
A function that always returns the same output for the same input and has no side effects.

# 49) Why must reducers be pure?
So state updates are predictable and time-travel debugging works.

# 50) What is Redux Toolkit?
The official modern way to write Redux logic. It reduces boilerplate.

# 51) What is createSlice?
A function that automatically generates action creators and reducers.

# 52) What is Immer in Redux Toolkit?
Immer lets you write “mutating” logic in reducers that is actually converted to immutable updates.

# 53) What is Middleware in Redux?
Functions that sit between dispatching an action and the reducer (e.g., redux-thunk, redux-logger).

# 54) What is Redux Thunk?
Middleware that allows action creators to return functions (for async logic) instead of plain objects.

# 55) What is createAsyncThunk?
Redux Toolkit function that handles pending, fulfilled, and rejected states of async requests automatically.

# 56) What is the difference between useSelector and useDispatch?
useSelector → read data from store
useDispatch → send actions to store

# 57) What is RTK Query?
A powerful data fetching and caching tool built into Redux Toolkit.

# 58) what is react fibre  and how does it differ from old reconcelation algorithim ?
React Fiber is the core reconciliation engine introduced in React 16 to improve rendering performance and make UI updates smoother. It rewrites React’s rendering system to efficiently manage and prioritize update tasks.

A Fiber is a plain JavaScript object representing a unit of work in React’s rendering process.
It enhances the reconciliation algorithm by breaking rendering into smaller, prioritized tasks.
Enables better performance optimizations and smoother, more responsive UI updates.

# 59) how does react determine when to rerender componet ?
React will only queue a re-render for an existing component under four distinct scenarios:
1)State Updates: Calling a state-setter function like setCount from useState or dispatch from useReducer directly schedules a re-render for that specific component.
2)Parent Re-renders: By default, when a parent component re-renders, all of its child components will also re-render recursively, regardless of whether their props changed.
3)Context Changes: When a value inside a React Context provider changes, any component utilizing the useContext hook for that provider will immediately re-render to fetch the fresh data.
4)Hook Updates: If a custom hook experiences an internal state or context change, the component consuming that hook will re-render.

# 60) what are concurent feature in react  and how do they help ?
Concurrent features in React (introduced in React 18) are a set of capabilities powered by React's internal concurrent renderer. Instead of rendering a component tree in a single, un-interruptible, blocking synchronous task, concurrent rendering allows React to pause, yield, interrupt, re-use, and discard component rendering tasks in the background without blocking the main browser UI thread.

1. Transitions (useTransition & startTransition)
===============================================
Transitions allow you to differentiate between urgent updates (like typing in a text field, clicking a button, or selecting a checkbox) and non-urgent (transition) updates (like filtering a massive list, rendering a chart, or switching tabs).

2. Deferred Values (useDeferredValue)
====================================
useDeferredValue lets you defer updating a specific non-critical value until more urgent rendering tasks have settled. It works similarly to debouncing or throttling, but without fixing a rigid timer—React defers it dynamically based on the device's speed.

# 61)

===================================IOT===================================
IOT(1)
=====

device-input , output device[please filture out which device requred and for testing moisture,temp,humidity,]

IOT
INTERNET OF THINGS

It means connecting physical devices to the internet so they can:

1)collect data using sensors
2)send data over network
3)process or stored data in cloud or server
4)Take actions based on that data
5)Sometimes receive commands back from the server

# example

Imagine a smart temperature sensor:
Temperature Sensor
↓
ESP32 Device
↓
Wi-Fi / Internet
↓
Node.js Backend
↓
Database
↓
React Dashboard

The sensor measures: Temperature = 32°C , Humidity = 65%  
The ESP32 sends:
{
"deviceId": "ESP001",
"temperature": 32,
"humidity": 65
} Your Node.js server receives it and stores it in a database.

Then your React dashboard can show:
Device: ESP001

Temperature: 32°C
Humidity: 65%

Status: Online

IoT Architecture

First understand these 5 major components:
┌──────────────────┐
│ Physical Device │
│ │
│ Sensor / Motor │
└────────┬─────────┘
│
↓
┌──────────────────┐
│ IoT Device │
│ ESP32 / Arduino │
└────────┬─────────┘
│
│ Wi-Fi / 4G / LoRa
↓
┌──────────────────┐
│ Communication │
│ MQTT / HTTP │
└────────┬─────────┘
│
↓
┌──────────────────┐
│ Backend / Cloud │
│ Node.js / AWS │
└────────┬─────────┘
│
↓
┌──────────────────┐
│ Database │
│ MongoDB / SQL │
└──────────────────┘

==========================

Phase 1
│
├── What is IoT?
├── IoT architecture
└── Basic electronics
↓
Phase 2
│
├── Arduino
├── ESP32
├── GPIO
├── Sensors
└── Actuators
↓
Phase 3
│
├── Wi-Fi
├── TCP/IP
├── HTTP
└── REST API
↓
Phase 4
│
├── MQTT
├── Broker
├── Publisher
├── Subscriber
└── Topics
↓
Phase 5
│
├── Node.js
├── NestJS
├── MQTT integration
└── Database
↓
Phase 6
│
├── AWS IoT Core
├── Device authentication
├── Certificates
└── Cloud architecture
↓
Phase 7
│
├── Security
├── OTA updates
├── Device management
└── Scaling

# phase-1

## defination of IOT

IoT is a system where physical objects/devices can sense something, process information, communicate over a network, and sometimes perform an action.

The 4 basic things an IoT device can do

# 1)SENSE:

The device collects information from the physical world.
Temperature
Humidity
Light
Motion
Pressure
Distance
Gas
Sound
GPS location

# 2)PROCESS:

The device decides what to do with the data.
EX-
Temperature = 35°C

if temperature > 30:
turn ON fan

The microcontroller performs this logic.

# 3)COMMUNICATE:

The device sends or receives information.
EX-
ESP32
↓
Wi-Fi
↓
Internet

OR

ESP32
↓
Bluetooth

OR

ESP32
↓
LoRa

# 4)ACT (actuator)

The device can perform an action.

EX-
Turn ON LED
Turn OFF LED
Start motor
Open door
Turn ON fan
Activate alarm

========================

            Sensor vs Actuator
            -----------------

SENSOR-> A sensor observes/measures something.
ex-

---

Temperature sensor
Humidity sensor
Motion sensor
Light sensor
Distance sensor
Pressure sensor
Gas sensor

Actuator-> An actuator does something.
ex-

---

LED
Motor
Relay
Buzzer
Servo motor
Solenoid

---

## What is a microcontroller?

A microcontroller is a small computer designed to control electronic devices.
ex-
Arduino
ESP8266
ESP32
STM32
PIC

You can think of an ESP32 as a tiny computer.

it has:;;
CPU
Memory
GPIO
Timers
Communication interfaces
Wi-Fi
Bluetooth
But it is much smaller and more limited than your laptop/server.

---

ESP32:: ESP32 is the brain/controller of our IoT device.
a family of microcontrollers from espressif, commonly used in iot for because of features such as gpio, blueetooth, wifi,timers, communication peripherals
======
why ESP32 ?

becuase it gives you:
Wi-Fi -> Wi-Fi (802.11 b/g/n): Built-in wireless radio that connects directly to local Wi-Fi routers.
Bluetooth -> Bluetooth (v4.2 BR/EDR & BLE): Short-range radio protocol supporting both classic Bluetooth and Bluetooth Low Energy.

GPIO -> GPIO (General Purpose Input/Output): Digital pins that can be programmed as inputs (reading binary states) or outputs (sending HIGH/LOW signals).

ADC -> ADC (Analog-to-Digital Converter): Converts continuous analog voltage signals into digital numbers that the microprocessor can process

PWM -> PWM (Pulse Width Modulation): Simulates an analog voltage signal by rapidly toggling a digital output pin ON and OFF at varying duty cycles.

SPI -> SPI (Serial Peripheral Interface): High-speed, full-duplex synchronous bus that uses separate data lines (MISO/MOSI) and a clock line (SCK).

I2C -> I2C (Inter-Integrated Circuit): Low-speed, two-wire synchronous protocol (SDA for data, SCL for clock) that allows multiple peripheral devices to share the exact same two pins.

UART -> UART (Universal Asynchronous Receiver-Transmitter): Asynchronous serial communication protocol using two lines (TX and RX) to transfer data byte-by-byte at a set baud rate (e.g., 115200).

ex-

              ESP32
        ┌──────────────┐
        │              │

Sensor ─┤ GPIO │
│ │
LED ────┤ GPIO │
│ │
Wi-Fi ──┤ Wi-Fi │
│ │
└──────────────┘

# What is GPIO?

GPIO = General Purpose Input/Output
This is extremely important.

An ESP32 has pins.

Those pins allow it to interact with electronic components.

A GPIO pin can generally be configured as: INPUT or OUTPUT

# Digital vs Analog

# DIGITAL:

Digital generally has discrete states.
ex-> 0 or 1 // LOW or HIGH

A button is a good example:
Pressed → HIGH
Not pressed → LOW

# Analog

Analog values can vary continuously.

For example, imagine a sensor produces:
0.0V
0.5V
1.2V
2.1V
2.8V
3.3V

The value isn't just: 0 or 1

===========================day2=========================

First understand: Electricity

Before ESP32, we need three basic terms:
Voltage
Current
Resistance

# voltage::

Voltage is measured in Volts (V).

For a beginner, think of voltage as the electrical potential difference that pushes current through a circuit. ex- 3.3v, 5v ,12v
An ESP32 typically operates its GPIO logic around:3.3v

for ESP32 GPIO:
HIGH ≈ 3.3V
LOW ≈ 0V

# Current:

Current means the flow of electric charge through a circuit.
Current is measured in Amperes (A).
ex-10mA, 20mA, 100mA (mA-miliampere)

a simple mental model is:
Voltage → pushes
Current → flows

# Resistance::

Resistance opposes/restricts current.
Resistance is measured in Ohms (Ω).
ex-
ESP32
↓
Resistor
↓
LED
The resistor limits the current flowing through the LED.

# Ohm's Law

V(volatage) = I(current) × R(resistance)

# What is an LED?

LED = Light Emitting Diode
It's a type of diode that emits light when current flows through it in the correct direction.
An LED has two terminals i,e Anode(+) , Cathode(-)

# What is GND?

GND = Ground.
At this level, think of GND as the common electrical reference/return point of the circuit.
For our LED circuit:
ESP32 GPIO
↓
Resistor
↓
LED
↓
GND

The circuit needs a complete electrical path.
Without a proper return path, you don't have a functioning circuit.

==============learning purposeeeeeeeeeeeeeeeeeeeeeeeeeee=========================

1. Start with these devices first
   A. DHT22 / DHT11 (Temperature + Humidity)

---

What it does: measures temperature and humidity
Why learn: cheapest way to understand sensor → data → code
Use in seafood: cold room / packing area monitoring
Level: absolute beginner

## B. DS18B20 (Waterproof temperature sensor)

What it does: precise temperature, often waterproof probe
Why learn: closer to real cold-chain product temperature
Use: ice box, chilled water, cold storage probe
Level: beginner

## C. GPS module (NEO-6M / NEO-8M)

What it does: latitude/longitude location
Why learn: track truck/shipment movement
Use: transport tracking from farm to plant/port
Level: beginner-intermediate

## D. ESP32 / ESP8266 board

What it does: small WiFi microcontroller
Why learn: brain of IoT device; reads sensors and sends data to Node.js API
Use: main device in prototype
Level: must learn

## E. SIM800L / 4G LTE module (optional)

What it does: sends data using mobile network
Why learn: rural farm roads often have no WiFi
Use: truck tracking in remote areas
Level: intermediate

## how one real device setup looks

DS18B20 (temp probe) +
GPS module +
ESP32 board +
Power (battery)
↓
Internet (WiFi/4G)
↓
Your Node.js API

---

1. # Temperature sensor (DS18B20 / DHT22)
   Know if shrimp/fish cold storage is safe.
   How it works:
   Sensor measures heat → converts to number (°C) → microcontroller reads it → sends to cloud

DS18B20: good probe for cold boxes
DHT22: temperature + humidity (air around storage)

Real use: alert if temperature rises above safe limit.

example:::::
DS18B20 (waterproof probe) – common for cold boxes
DHT22 – temperature + humidity (air)
PT100 / PT1000 – industrial high-accuracy temperature
MAX31855 + Thermocouple – industrial temperature setups
Cold-chain data loggers (Testo / Sensitech type) – export shipments

2. # Humidity sensor
   Helps with:
   Detect too much moisture in packing rooms/cold stores.
   How it works:
   Measures water vapor in air → % humidity value → sent to app/API
   Real use: prevent packaging damage, condensation issues, quality problems.

example:::::::::::::::::::;
DHT11 – basic humidity + temperature
DHT22 (AM2302) – better accuracy than DHT11
SHT30 / SHT31 – reliable industrial-grade humidity
SHT40 – modern accurate humidity sensor
BME280 – humidity + temperature + pressure

3. # GPS tracker (NEO-6M or NEO-8M)
   Helps with:
   Know where the truck/container is.
   How it works:
   GPS antenna receives satellite signals → calculates lat/long → device sends location to server.

Real use:

live vehicle tracking
ETA updates
find delays during export transport

example::::::::::::::
NEO-6M GPS module – beginner/learning module
NEO-8M GPS module – better accuracy than NEO-6M
SIM7600 / SIM800 based GPS tracker – GPS + mobile network
Vehicle GPS tracker (Teltonika-style devices) – commercial truck tracking
Reefer container GPS/IoT unit – export container tracking

4. # Door sensor (magnetic reed switch)
   Helps with:
   Know if cold-room/truck door is open.
   How it works:
   Magnet + switch on door
   Door closed → circuit connected
   Door open → circuit breaks → device sends “DOOR OPEN” event

Real use: stop cold air loss, prevent temperature spikes from open doors.

example:::::::::::::::;
Magnetic reed switch door sensor – basic open/close detection
MC-38 door/window magnetic sensor – common DIY/IOT module
Industrial door contact sensor – cold room doors
Door sensor + IoT node (ESP32) – sends open/close events to server

5. # Shock / vibration sensor
   Helps with:
   Detect rough handling of boxes/pallets.
   How it works:
   Sudden movement/impact → sensor signal → event logged (“shock detected”)

Real use: identify mishandling during loading/transport.

6. # Smart weight scale (load cell)
   Helps with:
   Measure product weight automatically.
   How it works:
   Weight presses load cell → electrical signal changes → converted to kg value → sent to system

Real use: packing accuracy, yield tracking, less manual error.

7. # RFID / QR scanner tags [RFID = Radio-Frequency Identification]
   Helps with:
   Identify each batch uniquely (traceability).
   How it works:
   Tag has unique ID
   Scanner reads tag → app links ID to farm/pond/batch/time

Real use:

farm-to-export tracking
find source of quality issues quickly

8. # IoT gateway / ESP32 board
   Helps with:
   Acts as the “brain” that connects sensors to internet.
   How it works: Reads sensors → packages JSON data → sends via WiFi/4G to Node.js API
   ESP32 is a common learning/prototyping board.

=====================

## Cold storage room — 25 scenarios × devices chart

COLD ROOM IoT CHART

1. Temp not safe
   Device: Temperature sensors (room + probe)
   Solves: Early cooling failure alert

2. Fire
   Device: Smoke detector + heat detector + alarm
   Solves: Fire warning

3. Door open/close + who
   Device: Door sensor + RFID/Face reader
   Solves: Who opened, open time, close time

4. Humidity issue
   Device: Humidity sensor (SHT31/DHT22)
   Solves: Moisture quality control

5. Power failure
   Device: Power monitor / UPS sensor
   Solves: Immediate outage alert

6. Compressor/AC failure
   Device: CT current sensor + status relay
   Solves: Cooling equipment failure detection

7. High energy use
   Device: Smart energy meter
   Solves: Power cost monitoring

8. Water leakage
   Device: Water leak sensor
   Solves: Leak and safety risk detection

9. Ammonia leak
   Device: Ammonia gas sensor
   Solves: Toxic gas safety

10. CO2 high / O2 low
    Device: CO2 sensor / O2 sensor
    Solves: Air safety for workers

11. Unauthorized entry
    Device: RFID/Face + door sensor + camera
    Solves: Access security

12. Door open too long
    Device: Door sensor + app timer rule
    Solves: Prevent cold loss

13. Too many door opens
    Device: Door sensor logs
    Solves: Discipline/audit

14. Crate in/out unknown
    Device: Crate RFID/QR scanner
    Solves: Inventory movement tracking

15. Batch stored too long
    Device: Batch QR/RFID + timestamp software
    Solves: FEFO / old stock control

16. Room overloaded
    Device: Inventory/slot tracking system
    Solves: Airflow and capacity control

17. Lights left ON
    Device: Light sensor / smart relay
    Solves: Power and heat waste

18. Motion after hours
    Device: PIR motion sensor + camera
    Solves: Intrusion detection

19. No incident proof
    Device: IP camera + NVR
    Solves: Video audit evidence

20. Wet floor slip risk
    Device: Leak sensor + warning light
    Solves: Staff safety

21. Uneven temperature
    Device: Multi-level temp sensors
    Solves: Hotspot detection

22. Long defrost warmup
    Device: Temp sensors + defrost status signal
    Solves: Defrost quality impact monitoring

23. IoT network offline
    Device: Gateway heartbeat monitor
    Solves: Monitoring downtime detection

24. Emergency exit opened
    Device: Emergency door contact sensor
    Solves: Safety compliance log

25. Forklift impact/shock
    Device: Vibration/shock sensor
    Solves: Rack/product damage detection

---

Sensor :DHT11 / DHT22
Measures :Temperature + humidity

Sensor :DS18B20
Measures :Waterproof temperature

Sensor :PIR sensor
Measures :Motion

Sensor :Ultrasonic (HC-SR04)
Measures :Distance

Sensor :MQ-series (MQ2, MQ135)
Measures :Gas/smoke

Sensor :Soil moisture sensor
Measures :Agriculture

Sensor :LDR
Measures :Light level

Sensor :BME280
Measures :Temp + humidity + pressure

Sensor :SHT31 / SHT40
Measures :Accurate humidity/temp

Sensor :pH / DO sensors
Measures :Water quality (aquaculture)

=====
Task-1:::: Today's Mini Task

No hardware needed yet — just build the mental model:

Pick (imaginary or real) one pond/tank you'd monitor.
List which 3 parameters you'd sensor first (hint: DO, temp, pH).
Sketch on paper: sensor → ESP32 → WiFi → phone alert. Just boxes and arrows.
======
solution
======

The Scenario

One shrimp grow-out pond (~1000 m²). We're monitoring the "big 3": DO(dissolved oxygen), Temperature, pH, with alerts sent to your phone.

Step 1: Which sensors, and why exactly these three
Sensor Why THIS one specifically Type
Optical DO sensor DO crashes are the #1 killer — this is non-negotiable, monitor 24/7 Digital (RS-485 or I2C)
DS18B20 Cheap, waterproof, accurate to ±0.5°C, industry-standard for water temp Digital (1-Wire)
Glass electrode pH probe, pH swings affect ammonia toxicity — a "silent" secondary killer Analog (needs signal conditioning module)

Step 2: How each sensor physically works

DO Sensor (Optical/Luminescent type — recommended over older galvanic type)
Sensor tip has a luminescent dye.
An LED shines light on the dye → dye fluoresces (glows).
Oxygen molecules "quench" (reduce) this fluorescence — more oxygen = less glow, less oxygen = more glow.
Sensor electronics measure the glow decay time and convert it to a DO value (mg/L).
Outputs a digital signal (usually RS-485/Modbus or I2C) — no messy calibration drift like older probes.

DS18B20 (Temperature)
A small chip embedded in a waterproof stainless steel probe.
Uses the 1-Wire protocol — meaning it sends digital data back over a single signal wire (plus power + ground = 3 wires total).
Each sensor has a unique ID, so you can even chain multiple DS18B20s on one wire if you had multiple ponds.

pH Probe
A glass electrode generates a tiny voltage (millivolts) based on the concentration of H+ ions in the water.
This voltage is compared against a stable internal reference electrode.
Because the voltage is very small and noisy, it needs a signal conditioning module (a small circuit board) to amplify and clean it into a 0–3.3V signal the microcontroller can read.
Requires periodic calibration using pH 4, 7, and 10 buffer solutions (probes drift over weeks/months).

Step 3: Wiring — how they connect to the microcontroller (ESP32)
┌─────────────────────────┐
DO Sensor ──────┤ │
(RS-485/I2C) │ │
│ ESP32 │
DS18B20 ──────────┤ (microcontroller) │
(1-Wire, pin D4) │ │
│ - Reads all 3 sensors │
pH Probe ─────────┤ - Has built-in WiFi │
(Analog → ADC pin)│ │
└────────────┬────────────┘
│
WiFi (2.4GHz)

DO sensor → connects via RS-485-to-TTL converter or I2C, depending on model.
DS18B20 → connects directly to one digital GPIO pin (needs a 4.7kΩ pull-up resistor).
pH module → connects to an analog (ADC) pin on the ESP32.

The ESP32 reads all three at set intervals (e.g. every 60 seconds) and converts raw signals into real units using each sensor's calibration formula.

Step 4: How the data actually gets transmitted (the important part)

This is the full chain, step by step:

ESP32 reads sensors → gets raw values (e.g. DO=5.2 mg/L, Temp=28.4°C, pH=7.8)
ESP32 packages the data into JSON:

{
"pond_id": "pond_01",
"do": 5.2,
"temp": 28.4,
"ph": 7.8,
"timestamp": "2026-08-17T09:00:00"
}

ESP32 connects to WiFi (your farm's router, or a 4G module if there's no WiFi at the pond).
ESP32 sends the JSON packet using MQTT (a lightweight messaging protocol built for exactly this — small, low-power devices sending frequent small updates). It "publishes" this data to a specific "topic" like farm/pond01/sensors.
A cloud platform "subscribes" to that topic and receives the data instantly (examples: ThingsBoard, Blynk, Firebase, AWS IoT Core — you'll pick one on Day 4).
The cloud platform stores the reading in a time-series database, so you can view historical graphs later.
The cloud platform checks rules/thresholds — e.g. "if DO < 4.0 mg/L → trigger alert."
If triggered, an alert is pushed to your phone via a mobile app notification (Firebase Cloud Messaging) or SMS (via a service like Twilio).

step 5: the full loop or visualized

[DO/Temp/pH Sensors]
↓ (wired: I2C/1-Wire/Analog)
[ESP32]
↓ (WiFi → MQTT protocol)
[Cloud Platform / Database]
↓ (rule check: DO < 4.0?)
┌────┴────┐
NO YES
↓ ↓
[Just log] [Push alert to phone]
↓ (optional, Day 5 topic)
[Auto-trigger aerator relay]

Step 6: Why this specific design (the reasoning, tied together)

Digital sensors (DO, temp) over analog where possible → less signal noise over pond-side wiring, more reliable.
WiFi for now, not LoRa/GSM → simplest for Day 1 learning; you'll compare alternatives on Day 3 for remote farms without WiFi coverage.
MQTT over HTTP polling → far lower power/data use, critical if later running on solar/battery.
Cloud thresholds, not just raw dashboard viewing → the whole point of IoT here is catching a DO crash at 3 AM when no one is watching a screen.

==================
note:: Real-Time Clock (RTC) module (supporting, not a "sensor" but essential) [DS3231] [ ESP32's internal clock drifts and resets on power loss — a hardware RTC keeps correct time independently, critical for day/night rule logic],

above module is required you have designed it check every hour amonia, oxygen and ph scale if power loss esp32 rests they have not send actual data, but DS3231 this is not a sensor it is hardware RTC keeps correct time independently if it is day or night.

# [Sensor type: Ion-Selective Electrode (ISE) Ammonia Sensor] ]

====================================================================================
                                    SQL(2)
====================================================================================

# 1). What is MySQL?

MySQL is an open-source relational database management system (RDBMS) that uses Structured Query Language (SQL) to store, manage, and retrieve data. It is widely used for web applications.

# 2). What is the difference between MySQL and SQL?

SQL is a language used to communicate with relational databases.
MySQL is a database management system that uses SQL.

# 3). What are the different types of joins in MySQL?

INNER JOIN – Returns matching records from both tables.
LEFT JOIN – Returns all records from left table + matching from right.
RIGHT JOIN – Returns all records from right table + matching from left.
FULL JOIN – Returns all records when there is a match in either table (MySQL doesn’t support FULL JOIN directly; we use UNION).
CROSS JOIN – Returns Cartesian product of both tables.

# 4). What is a Primary Key?

A Primary Key uniquely identifies each record in a table. It cannot be NULL and must be unique.

# 5. What is a Foreign Key?

A Foreign Key is a column that creates a relationship between two tables. It refers to the Primary Key of another table.

# 6). What is Indexing in MySQL?

Indexing is a technique used to speed up data retrieval. It creates a data structure that helps the database find rows faster without scanning the entire table.

different types of indexes: a)Primary Index , b)Unique Index , c) Composite Index , d)Full-text Index , e)Spatial Index

# 7)What is the difference between CHAR and VARCHAR?

CHAR is fixed-length.
VARCHAR is variable-length.
VARCHAR saves space when the data length varies.

# 8)What is Normalization?

Normalization is the process of organizing data to reduce redundancy and improve data integrity.
Common forms: 1NF, 2NF, 3NF, BCNF.

# 9) What is Denormalization?

Denormalization is the process of combining tables to improve read performance by reducing the number of joins (at the cost of some redundancy).

# 10) What is ACID in MySQL?
Atomicity means a transaction is all-or-nothing either all its operations succeed, or none are applied. If any part fails, the entire transaction is rolled back to keep the database consistent.

Commit: If the transaction is successful, the changes are permanently applied.
Abort/Rollback: If the transaction fails, any changes made during the transaction are discarded.

---
Consistency in transactions means that the database must remain in a valid state before and after a transaction.

--- 
Isolation ensures that transactions run independently without affecting each other. Changes made by one transaction are not visible to others until they are committed.

---
Durability ensures that once a transaction is committed, its changes are permanently saved, even if the system fails. The data is stored in non-volatile memory, so the database can recover to its last committed state without losing data.

# 11) What is a Transaction?
A transaction is a group of SQL statements that are executed as a single unit. It either fully succeeds or fully fails.

# 12) What is the difference between INNER JOIN and OUTER JOIN?
INNER JOIN returns only matching rows.
OUTER JOIN returns matching rows + non-matching rows from one or both tables.

# 13) What is a View?
A View is a virtual table based on the result of a SQL query. It does not store data physically.

ex-
CREATE VIEW active_customers AS
SELECT customer_id, name, email
FROM customers
WHERE status = 'active';

query view => SELECT * FROM active_customers;
Note::::::: if you change data in main table respective view table data also changed
means in customers table you changed name from AMIT to rajesh , this changes shown in orginal table i,e customers as well as active_customers.

a)  Modify or Update a View:
To change the underlying query logic of an existing view, use CREATE OR REPLACE VIEW.

ex->  
CREATE OR REPLACE VIEW active_customers AS
SELECT customer_id, name, email, phone
FROM customers
WHERE status = 'active';

b) Delete a View:
Permanently remove a view using the DROP VIEW command.
ex->
DROP VIEW active_customers;

why us views ?
============
Simplifies Complex Queries: Hides multi-table JOIN statements and complicated calculations behind a simple table name.
Enhances Security: Restricts access by displaying only specific columns or rows to certain database users without exposing full underlying tables.
Real-time Consistency: Always reflects the most up-to-date information because it executes live against the base tables every time you run it.

# 14) What is a Stored Procedure?
A Stored Procedure is a set of SQL statements stored in the database that can be executed multiple times. [just think like function]

core features
=============
Accepts Parameters: It can accept dynamic inputs (e.g., passing a specific user ID) and return output values back to the application.
Procedural Logic: Unlike standard queries, it can handle conditional statements (IF...ELSE), loops, and complex multiple-step workflows.
Data Modification: It can safely fetch, insert, update, or delete records within the database system.

why use ?
=========
a) better performance b)reduced network traffic c)enhancced security d)centralized maintainance

ex-
-- 1. Create the procedure
CREATE PROCEDURE GetEmployeesByDepartment
    @DeptName NVARCHAR(50)                 <-- Input parameter
AS
BEGIN
    SELECT FirstName, LastName, JobTitle 
    FROM Employees 
    WHERE Department = @DeptName;
END;

-- 2. Execute the procedure
EXEC GetEmployeesByDepartment @DeptName = 'Sales';


# 15) What is a Trigger?
A Trigger is a set of instructions that automatically executes when a specific event (INSERT, UPDATE, DELETE) occurs on a table.

# 16) What is the difference between HAVING and WHERE?
WHERE filters rows before grouping.
HAVING filters groups after aggregation (used with GROUP BY).

# 17) What is GROUP BY?
GROUP BY groups rows that have the same values into summary rows (often used with aggregate functions like COUNT, SUM, AVG).

# 18) What is the difference between UNION and UNION ALL?
UNION removes duplicate records.
UNION ALL keeps all records including duplicates (faster).

# 19) What is a Candidate Key?
A Candidate Key is a column (or set of columns) that can uniquely identify a record. One of them is chosen as Primary Key.

# 20) What does EXPLAIN do in MySQL?
EXPLAIN shows how MySQL executes a query (which indexes are used, type of join, number of rows scanned, etc.). It helps in query optimization.

# 21) What is a Composite Key?
A Composite Key is a combination of two or more columns that uniquely identify a record in a table.

# 22) What is a Super Key?
A Super Key is a set of one or more columns that can uniquely identify a row in a table. Primary Key is a minimal Super Key.

# 23) What is the difference between NOW() and CURRENT_DATE()?
NOW() returns current date and time.
CURRENT_DATE() returns only the current date.

# 24) What is the difference between IN and EXISTS?
IN is used to check if a value matches any value in a list/subquery.
EXISTS checks whether a subquery returns any rows (usually faster for large datasets).

# 25) What is Database Sharding?
Sharding is the process of splitting a large database into smaller, faster, more manageable parts called shards.

# 26) What is Replication in MySQL?
Replication is the process of copying data from one MySQL server (Master) to one or more servers (Slaves) for backup, load balancing, or high availability.

# 27) What is the difference between Horizontal and Vertical Scaling?
Horizontal Scaling → Adding more servers (scale out).
Vertical Scaling → Increasing resources of existing server (scale up).

# 28) What is a Self Join?
A Self Join is a join of a table with itself. It is useful when comparing rows within the same table.

# 29) What is the difference between RANK() and DENSE_RANK()?
RANK() leaves gaps in ranking when there are ties.
DENSE_RANK() does not leave gaps.

# 30) What is a Window Function in MySQL?
Window Functions perform calculations across a set of rows related to the current row (examples: ROW_NUMBER, RANK, LAG, LEAD, SUM OVER).

# 31) What is the difference between Optimistic and Pessimistic Locking?
Pessimistic Locking locks the data when reading (prevents others from modifying).
Optimistic Locking allows concurrent access and checks for conflicts only at update time.

# 32) What is a Schema in MySQL?
A Schema is the same as a Database in MySQL. It is a collection of tables, views, procedures, etc.

# 33) What is COALESCE()?
COALESCE() returns the first non-NULL value from the list of arguments.

# 34) What is the difference between IFNULL() and COALESCE()?
IFNULL(expr1, expr2) → works with only two arguments.
COALESCE() → can take multiple arguments.

# 35) What is a Constraint?
Constraints are rules applied on columns to enforce data integrity (PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, DEFAULT).

# 36) What is CASCADE in Foreign Key?
ON DELETE CASCADE or ON UPDATE CASCADE automatically deletes/updates child records when the parent record is deleted/updated.

# 37) What is a Subquery?
A Subquery is a query nested inside another query.
a) Single-row subquery b) Multiple-row subquery c) Correlated subquery, d)Nested subquery

# 38) What is a CTE (Common Table Expression)?
CTE is a temporary result set defined using the WITH clause. It improves readability of complex queries and can be referenced multiple times.

# 39) What is a Recursive CTE?
A Recursive CTE is a CTE that references itself. It is useful for hierarchical data (e.g., employee-manager hierarchy).

# 40) What is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?
ROW_NUMBER() → unique sequential number
RANK() → leaves gaps on ties
DENSE_RANK() → no gaps on ties

# 41) What is the N+1 Query Problem?
It occurs when one query fetches a list, and then additional queries are executed for each related record (common in ORMs). It causes performance issues.
-> for avoiding N+1 query problem [Use include (eager loading) or separate: true, or use joins instead of multiple queries.]


# 42) What is Partitioning in MySQL?
Partitioning divides a large table into smaller pieces (partitions) while still treating it as a single table. It improves performance and manageability.
-> types of partitioning a) RANGE b)LIST c)HASH d)KEY e)COMPOSITE (subpartitioning)

# 43) What is the difference between Partitioning and Sharding?
Partitioning → done inside one database server.
Sharding → data is distributed across multiple servers.

# 44) What is a "Tie"?
When two or more people have the same value, it is called a Tie.
In above example:

Priya and Amit both have 82000
This is a Tie

# 45) What is Ranking?
Ranking means giving positions (1st, 2nd, 3rd...) according to some order (usually highest to lowest).
types of ranking :::

A. ROW_NUMBER()
===============
Always gives unique numbers
Even if salary is same, it gives different numbers

B. RANK()
=========
Same values get same rank
But it creates a gap for next rank

C. DENSE_RANK()
===============
Same values get same rank
No gap

Function,     || Same Salary (Tie), ||     Next Rank,  || Gap?
ROW_NUMBER(),    Different numbers,        Continuous,    No
RANK(),          Same rank,                Skips,         Yes
DENSE_RANK(),    Same rank,                Continuous,    No


# 46)
# 47)
# 48)
# 49)
# 5)

===========================================================================================
        covering questions
        ============================================

CREATE DATABASE company_db;
USE company_db;

-- 1. Departments
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100)
);

-- 2. Employees
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    salary DECIMAL(10,2),
    hire_date DATE,
    dept_id INT,
    manager_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

-- 3. Projects
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2)
);

-- 4. Employee_Projects (Many-to-Many)
CREATE TABLE employee_projects (
    emp_id INT,
    project_id INT,
    role VARCHAR(50),
    hours_worked INT DEFAULT 0,
    PRIMARY KEY (emp_id, project_id),
    FOREIGN KEY (emp_id) REFERENCES employees(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);


-- Departments
INSERT INTO departments (name, location) VALUES
('Engineering', 'Bangalore'),
('HR', 'Mumbai'),
('Sales', 'Delhi'),
('Finance', 'Pune');

-- Employees
INSERT INTO employees (name, email, salary, hire_date, dept_id, manager_id) VALUES
('Amit Sharma', 'amit@company.com', 75000, '2021-03-15', 1, NULL),
('Priya Patel', 'priya@company.com', 82000, '2020-07-22', 1, 1),
('Rahul Verma', 'rahul@company.com', 65000, '2022-01-10', 1, 1),
('Sneha Reddy', 'sneha@company.com', 58000, '2021-11-05', 2, NULL),
('Vikram Singh', 'vikram@company.com', 72000, '2019-05-18', 3, NULL),
('Neha Gupta', 'neha@company.com', 69000, '2022-06-30', 3, 5),
('Karan Mehta', 'karan@company.com', 91000, '2018-09-12', 4, NULL),
('Anjali Desai', 'anjali@company.com', 64000, '2023-02-14', 1, 2);

-- Projects
INSERT INTO projects (name, start_date, end_date, budget) VALUES
('Website Redesign', '2024-01-10', '2024-06-30', 500000),
('Mobile App', '2024-03-01', '2024-12-31', 1200000),
('HR Portal', '2024-02-15', '2024-08-15', 300000),
('Sales Dashboard', '2024-04-01', '2024-09-30', 450000);

-- Employee_Projects
INSERT INTO employee_projects (emp_id, project_id, role, hours_worked) VALUES
(1, 1, 'Lead', 120),
(2, 1, 'Developer', 180),
(3, 1, 'Developer', 150),
(2, 2, 'Lead', 90),
(8, 2, 'Developer', 110),
(4, 3, 'Coordinator', 70),
(5, 4, 'Manager', 60),
(6, 4, 'Executive', 95),
(1, 2, 'Consultant', 40);
=====================================================================
# Q1. Display all employees with their department name.
SELECT e.name AS employee_name, d.name AS department_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id;

# Q2. Find employees who are not assigned to any project.
SELECT e.id, e.name
FROM employees e
LEFT JOIN employee_projects ep ON e.id = ep.emp_id
WHERE ep.project_id IS NULL;

# Q3. Show the total number of employees in each department.
SELECT d.name, COUNT(e.id) AS total_employees
FROM departments d
LEFT JOIN employees e ON d.id = e.dept_id
GROUP BY d.id, d.name;

# Q4. Find the highest salary in each department.
SELECT d.name AS department, MAX(e.salary) AS highest_salary
FROM employees e
JOIN departments d ON e.dept_id = d.id
GROUP BY d.id, d.name;

# Q5. List all projects along with the number of employees working on them.
SELECT p.name AS project_name, COUNT(ep.emp_id) AS total_employees
FROM projects p
LEFT JOIN employee_projects ep ON p.id = ep.project_id
GROUP BY p.id, p.name;

# Q6. Find employees who earn more than their manager.
SELECT e.name AS employee, e.salary AS emp_salary,
       m.name AS manager, m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;

# Q7. Display employees who joined in the year 2022.
SELECT name, hire_date
FROM employees
WHERE YEAR(hire_date) = 2022;

OR

WHERE hire_date BETWEEN '2022-01-01' AND '2022-12-31';

# Q8. Show average salary of each department (only departments having more than 1 employee).
SELECT d.name, AVG(e.salary) AS avg_salary
FROM employees e
JOIN departments d ON e.dept_id = d.id
GROUP BY d.id, d.name
HAVING COUNT(e.id) > 1;

# Q9. Find the employee who has worked the maximum total hours across all projects.
SELECT e.name, SUM(ep.hours_worked) AS total_hours
FROM employees e
JOIN employee_projects ep ON e.id = ep.emp_id
GROUP BY e.id, e.name
ORDER BY total_hours DESC
LIMIT 1;

# Q10. List all employees with their manager’s name (self join).
SELECT e.name AS employee_name,
       m.name AS manager_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;

# Q11. Display the name of employees who earn more than the average salary of all employees.
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

Trick: When comparing with overall average, use a subquery.

# Q12. Employees who are not managers
SELECT name
FROM employees
WHERE id NOT IN (
    SELECT manager_id 
    FROM employees 
    WHERE manager_id IS NOT NULL
);

OR

SELECT e.name
FROM employees e
LEFT JOIN employees m ON e.id = m.manager_id
WHERE m.manager_id IS NULL;

# Q13. Projects with budget greater than average budget
SELECT name, budget
FROM projects
WHERE budget > (SELECT AVG(budget) FROM projects);

# Q14. Employees hired in the last 3 years
SELECT name, hire_date
FROM employees
WHERE hire_date >= DATE_SUB(CURDATE(), INTERVAL 3 YEAR);

# Q1
# Q1
# Q1
# Q1

=========================================================================================
                                        GIT(4)
=========================================================================================
# 1) What is Git?
Git is a Version Control System.
It helps you:

Track changes in your code
Go back to previous versions
Work with multiple people on the same project
Create branches (parallel versions)

# 2) undo changes
# Unstage file
git reset HEAD filename

# Discard changes in working directory
git checkout -- filename
# or
git restore filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (delete changes)
git reset --hard HEAD~1

# 3) git cherry-pick
Use: Take a specific commit from one branch and apply it to another.
git cherry-pick <commit-hash>

# 4) git rebase
Use: Clean up commit history / put your branch on top of latest main.
git checkout feature-branch
git rebase main

# 5)
# 6)
# 7)
# 8)
# 9)


=========================================================================================
                              MONGODB(5)
=========================================================================================
# 1) What is MongoDB?
MongoDB is a NoSQL database that stores data in JSON-like documents (BSON).
core concepts:

Database -> Container for collections
Collection -> table
Document,->  row (stored as JSON/BSON)
Field -> column
_id -> Unique identifier (auto-created)
BSON -> Binary JSON (MongoDB’s storage format)

// Show databases
[show dbs]

// Create / Switch database
[use companyDB]

// Show collections
[show collections]

// Insert documents
db.employees.insertOne({ name: "Amit", salary: 75000, dept: "Engineering" })

db.employees.insertMany([
  { name: "Priya", salary: 82000, dept: "Engineering" },
  { name: "Rahul", salary: 65000, dept: "Sales" }
])

// Find documents
db.employees.find()
db.employees.findOne({ name: "Amit" })
db.employees.find({ salary: { $gt: 70000 } })

// Update
db.employees.updateOne(
  { name: "Amit" },
  { $set: { salary: 78000 } }
)

// Delete
db.employees.deleteOne({ name: "Rahul" })
db.employees.deleteMany({ dept: "Sales" })

# 2) Projection (Select specific fields)
db.employees.find({}, { name: 1, salary: 1, _id: 0 })

# 3) Sorting, Limit, Skip
db.employees.find().sort({ salary: -1 })     // descending
db.employees.find().limit(5)
db.employees.find().skip(10).limit(5)        // pagination

# 4) Update Operators
    $set        // set field value
    $unset      // remove field
    $inc        // increment number
    $push       // add to array
    $pull       // remove from array
    $addToSet   // add to array only if not exists
    $pop        // remove first/last from array

# 5) indexing
db.employees.createIndex({ email: 1 })
db.employees.createIndex({ name: 1, salary: -1 })  // compound index
db.employees.getIndexes()
db.employees.dropIndex("email_1")

# 6) What is the difference between MongoDB and MySQL?
MySQL is relational (tables/rows), MongoDB is document-based (collections/documents) with flexible schema.

# 7)What is a Document in MongoDB?
A document is a set of key-value pairs (like a JSON object). It is the basic unit of data.

# 8) What is a Collection?
A collection is a group of documents (similar to a table in MySQL).

# 9)What is BSON?
BSON (Binary JSON) is the binary format used by MongoDB to store documents. It supports more data types than JSON.

# 10) What is an ObjectId?
ObjectId is a 12-byte unique identifier generated by MongoDB (contains timestamp, machine id, process id, counter).

# 11) How do you create a database in MongoDB?
Use use database_name. MongoDB creates it when you first insert data.

# 12) What is the difference between updateOne and replaceOne?
updateOne modifies fields. replaceOne replaces the entire document.

# 13) What are Cursors in MongoDB?
A cursor is a pointer to the result set of a query. It allows you to iterate over large results.

# 14) What is Projection?
Projection means selecting only specific fields from documents ({ name: 1, _id: 0 }).

# 15) What is the difference between $set and $unset?
$set updates/adds a field. $unset removes a field.

# 16) What is Aggregation in MongoDB?
Aggregation processes data records and returns computed results (like GROUP BY in SQL).

# 17) What is $lookup?
    $lookup performs a left outer join between two collections.

# 18) What is $unwind?
    $unwind deconstructs an array field into multiple documents.

# 19) What is a Replica Set?
A group of MongoDB servers that maintain the same data for high availability and failover.

# 20) What is Sharding?
Sharding is horizontal scaling — distributing data across multiple servers.

# 21) What is a Shard Key?
A field used to distribute documents across shards.

# 22) What is the difference between Replica Set and Sharding?
Replica Set → high availability.
Sharding → horizontal scaling / performance.

# 23) What is the difference between find() and findOne()?
find() returns a cursor. findOne() returns a single document.

# 24) . How do you optimize MongoDB queries?
Use indexes, projection, covered queries, proper shard key, aggregation optimization, avoid large documents.

# 25) 
# 26) 
# 27) 
# 28) 
# 29) 

========================================================================================
                            # WEBSOCKET(6)
========================================================================================
# 1). What is WebSocket?
WebSocket is a communication protocol that provides full-duplex (two-way) communication between client and server over a single TCP connection.

Normal HTTP vs WebSocket
======================================================================================
Feature,             ||                HTTP,                   ||             WebSocket
=======================================================================================
Connection,          ||    Request → Response → Close,         ||            Open and stays open
Communication,       ||    One-way (client starts),            ||Two-way (both can send anytime)
Overhead,            ||    High (headers every time),          ||  Low
Use case,            ||    Normal APIs,                        ||  Real-time apps


where uses: a) Chat applications b) Live notifications c) Real-time dashboards d) Multiplayer games e) Live tracking (location, stock prices) f) Collaborative tools (Google Docs style)

# 2)  How WebSocket Works (Step by Step)?
1. Client sends HTTP request with Upgrade header
2. Server accepts and upgrades connection to WebSocket
3. Connection stays open
4. Both Client and Server can send messages anytime
5. Connection closes when either side wants

# 3) WebSocket in Node.js?
instalattion
============
npm install ws
# or
npm install socket.io

Option A: Using ws (lightweight)
===============================
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send message to client
  ws.send('Welcome from server!');

  // Receive message from client
  ws.on('message', (message) => {
    console.log('Received:', message.toString());

    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on ws://localhost:8080');

====================================================
Option B: Using Socket.IO (Recommended for beginners)
=====================================================
Socket.IO is easier and has fallback support. 

instalation ->  npm install express socket.io cors

server.js
=========
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React app
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for message
  socket.on('send_message', (data) => {
    console.log('Message:', data);

    // Send to all users
    io.emit('receive_message', data);

    // Send to everyone except sender
    // socket.broadcast.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});

# 3) WebSocket in React
Using Socket.IO Client
Install: -> npm install socket.io-client

App.js / Chat component:
=======================
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for messages
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      socket.off('receive_message');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', {
        text: message,
        time: new Date().toLocaleTimeString()
      });
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Chat App</h2>

      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg.text} <small>{msg.time}</small></p>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;

===
# 4) What are Rooms in Socket.IO?
Rooms are channels that sockets can join. Useful for sending messages to specific groups of users (e.g., chat rooms).

# 5). What is the difference between io.emit, socket.emit, and socket.broadcast.emit?
Method,                    Who receives the message?
socket.emit,               Only that specific client
socket.broadcast.emit,     All clients except the sender
io.emit,                   All connected clients

# 5)How do you handle authentication in WebSockets?
Send JWT token while connecting
Verify token in server middleware

Example (Socket.IO):
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // verify token
  next();
});

# 6) How do you prevent memory leaks in React with WebSockets?
Always clean up listeners in useEffect:
useEffect(() => {
  socket.on('message', handler);
  return () => {
    socket.off('message', handler);
  };
}, []);

# 7) What is the difference between WebSocket and Server-Sent Events (SSE)?
WebSocket → Bi-directional
SSE → Only server to client (uni-directional)

# 8) How does scaling WebSocket servers work?
Use Redis Adapter (for Socket.IO) so multiple servers can communicate
Sticky sessions (same client connects to same server)
Load balancer with proper configuration

# 9) What are Namespaces in Socket.IO?
Namespaces allow you to create separate communication channels (/chat, /notifications) on the same server.

# 10) What happens when a WebSocket connection drops?
Native WebSocket → You need to handle reconnection manually
Socket.IO → Automatic reconnection with configurable attempts

# 11) What is Heartbeat / Ping-Pong in WebSocket?
Mechanism to check if the connection is still alive. Server and client periodically send ping/pong frames.

# 12) What are the common issues with WebSockets?
Connection drops
Scaling across multiple servers
Authentication
Proxy/firewall blocking
Memory leaks on client side

# 13) 
# 1
# 1
# 1
# 1
# 1
# 1
# 1
=======================================================================================
                                        REDIS(7)
=======================================================================================
# 1) What is Redis?
Redis = Remote Dictionary Server
It is an in-memory key-value data store.
Very fast because data is stored in RAM.
Main Use Cases: Caching, Session storage, Real-time leaderboards, Pub/Sub (messaging), Rate limiting, Queue / background jobs

# 2) Why Redis is Fast?
Data stored in memory (RAM)
Single-threaded (no lock contention)
Efficient data structures
Optional persistence (RDB / AOF) 

# 3) Redis Data Types ?
Type                  ||       Description                ||        Example Use Case
=====================================================================================
String                ||       Simple key-value           ||        "Cache, session"
Hash                  ||       Field-value pairs          ||        User profile
List                  ||       Ordered list               ||        "Queue, recent activity"
Set                   ||       Unique unordered values    ||        "Tags, unique visitors"
Sorted Set            ||       Unique values with score   ||        Leaderboard
Bitmap                ||       Bit operations             ||        Analytics
HyperLogLog           ||       Approximate count          ||        Unique views
Stream                ||       Log / event data           ||        Event sourcing

# 4) Basic Commands
# String
SET name "Amit"
GET name
DEL name
EXISTS name
EXPIRE name 60          # expire in 60 seconds
TTL name

# Hash
HSET user:1 name "Amit" age 25
HGET user:1 name
HGETALL user:1

# List
LPUSH messages "Hello"
RPUSH messages "World"
LRANGE messages 0 -1

# Set
SADD tags "nodejs" "redis"
SMEMBERS tags

# Sorted Set
ZADD leaderboard 100 "Amit"
ZADD leaderboard 200 "Priya"
ZRANGE leaderboard 0 -1 WITHSCORES

# 5) What is the difference between Redis and Memcached?
Redis supports multiple data structures and persistence. Memcached only supports simple key-value and has no persistence.

# 6) What is RDB persistence?
RDB (Redis Database) persistence is a feature that saves point-in-time snapshots of your in-memory dataset to disk at specified time intervals. It creates compact, fast-loading binary files (usually named dump.rdb), making it ideal for backups, disaster recovery, and fast restarts with large datasets.

# 7) What is AOF persistence?
AOF (Append Only File) persistence in Redis logs every write command received by the server to a disk file. When Redis restarts, it replays these commands to rebuild the data. It offers high durability with minimal data loss compared to snapshots.

# 8) What is Redis Pub/Sub?
Publish/Subscribe messaging system where publishers send messages to channels and subscribers receive them.

# 9) What is Redis Sentinel?
High availability solution that monitors Redis masters and slaves and handles automatic failover.

# 10) What is Cache Penetration?
When queries keep requesting data that doesn’t exist in cache or DB, causing load on the database.
solving cache penetration 1) Cache null values 2) Use Bloom Filter

# 11) What is the difference between SETNX and SET with NX?
Both set the key only if it does not exist. SET key value NX is the modern way.

# 12) How do you implement Rate Limiting with Redis?
Using INCR + EXPIRE or Sorted Sets / Sliding Window.

# 10)
# 10)
# 10)
# 10)
# 10)
====================
[ 1. User Taps Card ] ──> [ 2. RC522 Reads UID via Induction ] ──> [ 3. ESP32 Receives SPI Signal ]
                                                                                   │
                                                                                   ▼
[ 6. Visual/Audio Output ] <── [ 5. ESP32 Reads Response ] <── [ 4. Transmits HTTPS Packet to Node.js ]
  ├─ OLED: Shows Name/Msg
  ├─ LED: Green (200) / Red (403)
  └─ Buzzer: Beep Alert


  ====

  How does the SPI protocol handle data exchange between the ESP32 and the RC522 module?

Answer: "SPI uses four wires: MOSI (Master Out Slave In), MISO (Master In Slave Out), SCK (Clock), and SS (Slave Select). The ESP32 acts as the master, generating the clock signal and toggling the SS pin LOW to initiate data transfer over MOSI/MISO."

=====

How do you ensure the DS3231 Real-Time Clock keeps accurate time across device reboots?

Answer: "The DS3231 has its own battery-backed registers. Upon boot, the C++ code initializes the RTC over I2C (RTClib). If NTP time isn't available via Wi-Fi, the ESP32 pulls the current time directly from the RTC's internal register."

====


======================================================================================================================
                                    NGNIX(8)
======================================================================================================================
1)what is ngnix ?
Nginx is an open-source, high-performance web server, reverse proxy, load balancer, and HTTP cache. It uses an event-driven, asynchronous, non-blocking architecture, making it lightweight and capable of handling tens of thousands of concurrent connections on low memory footprint.

Key Core Concepts to Learn First:
================================
Reverse Proxy: 
==============
Accepts incoming traffic on ports 80/443 and routes requests to backend application servers (like your Express or NestJS APIs).

Load Balancing: 
===============
Distributes incoming traffic across multiple app instances using strategies like Round Robin, Least Connections, or IP Hash.

SSL/TLS Termination: 
====================
Offloads HTTPS decryption at the Nginx edge so your Node.js apps process plain HTTP internally.

Static File Serving: 
===================
Serves static assets (HTML, CSS, images) directly from disk, saving CPU cycles on backend servers.

# 2) What are worker_processes and worker_connections in nginx.conf?
worker_processes: Specifies how many worker instances Nginx spawns (best practice is setting it to auto to match available CPU cores).
worker_connections: Sets the maximum simultaneous connections each worker process can open.
Total Max Connections = worker_processes *  worker_connections.

# 3) In what language was the Nginx software being written?
The language in which the Nginx software is written is ‘C’ Language.

# 4) What are the difference between Nginx and Apache?
Firstly, Nginx is an event-based web server and Apache is a process-based server.
Nginx is best known for its speed and Apache is best known for its power.
Nginx is the best when it comes to memory consumption and connection whereas Apache is not best in this category.
In Nginx, a single thread is handling all of the requests whereas in Apache single thread handles a single request.
Nginx is best when you want the load balancing. But Apache will refuse the new connection when traffic reaches the limit of the process.
Apache provides lots of functionality as compared to Nginx.
Code language: JavaScript (javascript)

# 5) What is the difference between a forward proxy and reverse proxy?
Forward proxy:  The proxy acts on behalf of the client. [Client → Proxy → Internet]
Reverse proxy:  The proxy acts on behalf of the server. [Client → Nginx → Backend]
A forward proxy hides or represents clients, while a reverse proxy hides or represents backend servers.

# 6) What is an Nginx configuration file?
It contains Nginx's configuration, such as ports to listen on, domains, reverse proxy rules, SSL configuration, caching, load balancing, and static file handling.

ex-
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:5000;
    }
}

# 7) Explain server block.
A server block defines how Nginx should handle requests for a particular server/domain.

# 8) What is a location block?
A location block defines how Nginx should handle requests matching a particular URL path.
location /api/ {
    proxy_pass http://localhost:5000;
}

# 9) What does proxy_pass do?
proxy_pass tells Nginx where to forward the incoming request.

# 10) How do you configure Nginx for a Node.js application?
server {
    listen 80;

    server_name example.com;

    location / {
        proxy_pass http://localhost:5000;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# 11) Why do we use proxy_set_header?
When Nginx forwards a request, some original client information may not automatically be available to Node.js in the way we want. proxy_set_header allows Nginx to forward information such as the original host, client IP, and protocol.

# 12) Why is X-Forwarded-For important?
It allows the backend to know the original client IP when the request passes through one or more proxies.

# 13) What happens if Node.js is down?
Nginx will receive the request but won't be able to connect to the configured upstream. It generally returns an error such as 502 Bad Gateway

# 13) How do you configure load balancing?
upstream node_backend {
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
    server 127.0.0.1:5003;
}

server {
    listen 80;

    location / {
        proxy_pass http://node_backend;
    }
}

# 14) What is an upstream?
An upstream block defines a group of backend servers to which Nginx can forward requests.
upstream node_backend {
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}

# 15)What is SSL termination?
SSL termination means Nginx handles HTTPS encryption/decryption while forwarding the request to the internal Node.js server, which can communicate over HTTP on the private network.

This simplifies certificate management for the application.

# 16) Your Node.js application runs on port 5000. Users should access api.example.com. How do you configure it?
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://localhost:5000;
    }
}

# 17) How do you reload Nginx?
sudo nginx -s reload

# 18) What is a 301 redirect?
301 Moved Permanently tells the client that the requested resource has permanently moved to another URL.

# 19) What is a 302 redirect?
302 Found is commonly used for a temporary redirect.

# 20) Where should SSL certificates be configured?
If Nginx is terminating HTTPS, the certificate and private key are configured at the Nginx layer.

# 21) What is TLS?
TLS is the cryptographic protocol used to secure HTTPS communication. It provides encryption, authentication, and integrity protection.

# 22) 


================================================================================================================
                                  AWS(9)
================================================================================================================
                    AWS
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
        EC2                    S3
   Run Node.js app        Store files/objects
          │                     │
          ↓                     ↓
       Nginx              Images/PDFs/Videos
          │
          ↓
      PostgreSQL

# 1) What is AWS?
AWS (Amazon Web Services) is a cloud platform that provides infrastructure and managed services such as servers, storage, databases, networking, security, monitoring, and more.     

# 2) What is EC2?
EC2 = Elastic Compute Cloud
It provides virtual servers in AWS.
 think of ec2 as : [A remote Linux/Windows computer in the cloud where I can deploy and run my Node.js application.]

ex-
EC2 Server
 ├── Node.js
 ├── Express
 ├── Nginx
 ├── Docker
 └── Your application

# 3)Why would you use EC2 for Node.js?
Suppose locally you run: [npm start]  and your application runs on: [localhost:5000]

But users on the internet cannot normally access your local machine.
With EC2: 

Internet
    ↓
AWS EC2
    ↓
Node.js :5000

# 4) What is an EC2 instance?
An EC2 instance is a virtual machine created from an Amazon Machine Image (AMI).
AMI
 ↓
Create EC2 Instance
 ↓
Linux Server
 ↓
Install Node.js
 ↓
Deploy Application

# 5) What is an AMI?
AMI = Amazon Machine Image
It is a template used to create EC2 instances.

It can contain: Operating system, Software, Configuration

# 6) What is S3?
S3 = Simple Storage Service
S3 is an AWS object storage service.

# 7) What is an S3 bucket?
A bucket is a container for objects in S3.

# 8) What is an S3 pre-signed URL?
A pre-signed URL is a temporary URL that provides authorized access to an S3 object.
Node.js
   ↓
Generate pre-signed URL
   ↓
Client
   ↓
Download directly from S3

# 9) deploying application in ec2 ?
Step 1 — Create an EC2 instance
===============================
Go to AWS → EC2 → Launch instance
Choose:

Name: task-api-server
AMI: Ubuntu
Instance type: a small instance suitable for learning/testing
Key pair: create/download a .pem key
Network: default VPC is fine for learning

Step 2 — Connect to EC2
=======================
After creating the instance, AWS gives you a public IP.
From Windows, you can use PowerShell/Windows Terminal with SSH.

[ssh -i "my-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP] you will get something like [ubuntu@ip-172-31-10-25:~$]

Step 3 — Update Ubuntu
======================
sudo apt update
sudo apt upgrade -y

Step 4 — Install Git
===================
sudo apt install git -y

Step 5 — Get your project onto EC2
==================================
If your project is on GitHub: [git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git]

Step 6 — Don't upload your .env
===============================
by the help of .gitignore you can ignore it

On EC2 you can create the real .env: [nano .env]

then install docker, ngnix, then add domain

===============================================================================================================
                                                  SENARIO
===============================================================================================================
# 1) What is Monolithic Architecture?                                             
In a monolithic architecture, the entire application is built and deployed as one application/unit.

# 2) What is Microservice Architecture?
In microservice architecture, the application is divided into multiple small, independently deployable services.
Each service generally owns a specific business capability.
They can communicate using: => HTTP/REST, gRPC, RabbitMQ, Kafka

