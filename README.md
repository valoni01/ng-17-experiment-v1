# Ng17

---

### Version of Angular user: 17

### State management: NGRX component store

### Run - npm install (To install dependencies)

### Run - ng server (To run the app locally)

NB: There is less focus on the style, and also no tests were written. styles were very minimal and variables would have been overkill (and wanted more focus on the logic).

### JWT

The JWT is very secure for authentication. a few of the reasons

1.  The token can be set to expire at a specific time. This mean, expired token can't be used by an attacker or someone getting access to your device
2.  Help prevents server side session hijacking since a session state is not needed while using jwt
3.  Forged token can't be decoded hence, it is easy to know when a token is forged
4.  Allow the opportunity to use strong cryptographic algorithms and keys

###

Attack vectors for HTML messages

1. Cross-site scripting(xss):
   An attacker can easily inject malicious scripts (sql, js ..) and can be used to steal sensitive information, highjack session or crash the application

   Ways to prevent this
   a. Implement CSP headers to restrict the sources from which (scripts) can be loaded on the webpage. This will block unauthorized scripts from executing
   b. Input sanitization
   c. Encode user-generated content appropriately before rendering it to the browser. For example, use HTML encoding to render user-generated HTML content as text rather than executing it.

2. HTML Injection:
   An attacker can inject HTML code(None scripts) into messages to modify the appearance of the messages or the entire page for the intention of phishing or defacement of the webpage

   Ways to prevent this:
   a. Set the Content-Type header to prevent browsers from interpreting content as HTML if it's intended to be treated as plain text. This reduces the risk of HTML injection attacks by enforcing the rendering behavior of the browser.
   b. Use HTML sanitization libraries or frameworks to remove or neutralize any potentially harmful HTML tags or attributes from user-generated content while preserving harmless formatting elements.
   c. Adopt a whitelist approach where only a specific set of HTML tags and attributes are allowed, while all others are stripped out. This helps prevent unexpected or malicious content from being rendered.

###

###

Difference Between Mutable and Immutable Objects

First, there are two types of data types in Javascript

1. The primitive types and
2. The Reference types (Non-primitive)

The primitive types are stored in the stack in the memory, It is a stack of data with LIFO data structure. This provides very fast access. When storing a primitive type in memory, it adds an element to the top of the stack with the value of the newly created variable. When creating a new variable and assigning the first one to the new one, it adds a new element on top of the stack with the value of the new variable (which is the value of the first created variable).

Reference types:
Reference types are been stored on the Heap. When storing a reference type in memory, it adds a new element to the top of the stack when its value is a pointer/reference to the address of the object that has been stored on the heap. So if you create a property and assign that property to another new property, the value of the new property will be added to the stack with a reference to the original object on the heap.

The behavior of how this data is stored influences how this data can be modified.

For the primitive types, they are immutable, meaning that they can be created once and cannot be changed even though we can assign new values. This lowers the developer's mental burden but is also prone to bugs.

For Reference types, they are mutable, they can be changed without creating an entirely new value unlike the primitive types

###

###

Example of Immutable Object:

A string

###

Pron and Cons of Immutability

Pros:

1. Easy access
2. A copy of a new immutable object is a new copy
3. No need for defensive copy or extra care to use and assign them

Cons:

1. Can't store a complex data structure
2. Performance overhead, new instances are created for each modification

###

###

How to achieve immutability in your code

1. use the const keyword to prevent reassignment of values
2. using the readonly modifier which can make the properties of an object immutable
3. Using object.freeze()
4. use spread operators or object.assign() to create copies of objects and array

###

How to speed up Wep application

1. Profile the web apps using tools like lighthouse to identify bottlenecks
2. use profilers to analyze buddle sizes
3. Optimize template rendering during change detection (using onPush change detection strategy)
4. Lazy load modules/components
5. use preloading mechanism
6. implement mono-repository approach

others 7. image optimization 8. use service workers when necessary

####

What part of a new job do you think is more important:

2. You’re offered a standard piece of mediocre hardware. Free to pick your own Software.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
