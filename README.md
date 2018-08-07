# node-azure-mvc
Example application for creating an MVC Express + Node + TypeScript app and deploying it to Azure

- [Getting Started](#getting-started)
- [What is TypeScript?](#what-is-typescript)
- [Project Setup](#project-setup)
- [Hello World](#hello-world)

## Getting Started

This tutorial will focus on creating a basic MVC web app with Node, Express, and TypeScript. We'll approach this from the angle of already being familiar with creating an ASP.NET Core MVC app in C#, so this tutorial will model the structure of the [MVC web app](https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-mvc-app/start-mvc?view=aspnetcore-2.1&tabs=aspnetcore2x) tutorial.

In short, if you are a C# developer and want to learn how to make Express MVC apps in Node and TypeScript, this tutorial is for you!

### Install Node

TODO: explain what Node is
https://nodejs.org/en/download/

### Using NPM

NPM is Node's package manager, similar to Nuget. It's included in Node. When adding dependencies to your projects, the first thing you'll need to do in a new project is run `npm init`. This will take you through the steps of creating a new `package.json` file, which will contain the manifest of all the installed dependencies on your project, as well as custom scripts and other configuration settings.

There's two types of dependencies:
- `dependencies` refers to any dependencies your running app actually depends on
  - To install and save a dependency, `npm install some-dependency --save`
  - (or `npm i some-dependency -S` for short)
- `devDependencies` refers to any dependencies needed to build, test, lint, etc. your app, and are not necessary for running the app.
  - To install and save a devDependency, `npm install some-dependency --save-dev`
  - (or `npm i some-dependency -D` for short)

More info:
- https://docs.npmjs.com/files/package.json

### Install VS Code

VS Code is the preferred editor for creating TypeScript projects, as it has built-in support for TypeScript. You can get it here: https://code.visualstudio.com/download

## What is TypeScript?

TypeScript is a "typed superset of JavaScript that compiles to plain JavaScript." JavaScript is not a typed language, which may make it feel unfamiliar when coming from a strongly-typed language like C#. Thankfully, TypeScript (TS for short) provides strong typing support to make JavaScript feel similar to C#.

Throughout the course, we'll compare the TypeScript we write to C#, and explore the differences.

More info:
- http://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- https://www.lynda.com/course-tutorials/Typescript-C-Programmers/543000-2.html

## Project Setup

Create a new directory which will contain our Node app.

```bash
mkdir my-app
cd my-app
```

Initialize the `package.json` file. You can just press <kbd>Enter</kbd> through all the steps, unless you want to set any of the package configuration settings (which you can do at any time in the `package.json` file).

```bash
npm init
```

To get up and running quickly, we'll just install `express` as a dependency:

```bash
npm install express --save
```

[Express](https://expressjs.com/) is the most popular minimalist web framework for Node apps, and you will see many Node apps authored either in Express or variants of Express, such as [Koa](https://koajs.com/) or [Nest](https://nestjs.com/).

Now install TypeScript and the Express types as devDependencies (since they are not required to run the app):

```bash
npm install typescript @types/express --save-dev
```

The `@types/express` package adds the proper typings for `express`, so that it can be strongly typed and work with Intellisense even though it's written in JavaScript.

After installing TypeScript, add a `tsconfig.json` file to the project root with the following configuration:

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "esModuleInterop": true,
        "target": "es6",
        "noImplicitAny": true,
        "moduleResolution": "node",
        "sourceMap": true,
        "outDir": "dist",
        "baseUrl": ".",
        "paths": {
            "*": [
                "node_modules/*",
                "src/types/*"
            ]
        }
    },
    "include": [
        "src/**/*"
    ]
}
```

This file contains the config settings for compiling the TypeScript code. In short, it tells TypeScript to look for `.ts` files in the `src/` directories and subdirectories, compile it according to the config settings, and output the compiled `.js` files in the `dist/` directory. To dive deeper into what each of these configuration settings mean, check out the [TypeScript Node Starter readme](https://github.com/Microsoft/TypeScript-Node-Starter#configuring-typescript-compilation) or the [TypeScript config file docs](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

### Folder Structure
Here's what our overall folder structure will look like:

```
src/
├─ controllers/
│  ├─ UsersController.ts
|  └─ GoatsController.ts
├─ models/
│  ├─ UserModel.ts
|  └─ GoatModel.ts
├─ views/
│  ├─ index.pug
│  ├─ users.pug
|  └─ goats.pug
└─ index.ts
```

Create these directories:

- `touch index.ts`
- `mkdir src && cd src`
- `mkdir models views controllers`
- `cd ../`

When TypeScript compiles this app, it will recursively compile all `.ts` files within these folders and output them in `dist/` with the same structure.

## Hello World

Now that our project is set up, let's set up a simple running Node + Express + TypeScript app. Import the `express` package in `index.ts`:

```ts
import express from 'express';
```

<details><summary>ℹ️ Compare TS imports to C#</summary>
In JavaScript/TypeScript, external references to variables/functions/etc. must be explicitly imported and referenced. This is different than C#, where you would use the `using` directive to reference external namespaces.

For example, in C#, the `ReadAllText` function is implicitly available from `using System.IO.File`:
```cs
using System.IO.File;

class ReadFromFile
{
    static void Main()
    {
        // ReadAllText is implicitly available from System.IO.File
        string text = ReadAllText(@"path\to\file.txt");
    }
}
```

Whereas in TypeScript, it is referenced from [the built-in `fs` module](https://nodejs.org/api/fs.html):
```ts
import { readFileSync } from 'fs';

export class ReadFromFile {
    constructor() {
        // readFileSync is explicitly imported from the fs module
        this.text = readFileSync('path/to/file.txt');
    }
}
```

The above can also be written without [import destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import):
```ts
import * as fs from 'fs';

export class ReadFromFile {
    constructor() {
        // readFileSync is referenced from the fs module
        this.text = fs.readFileSync('path/to/file.txt');
    }
}
```
</details>
<br />

Following the [hello world guide in the Express docs](https://expressjs.com/en/starter/hello-world.html), continue creating the app:

```ts
import express from 'express';

// Creates a new Express app instance
const app = express();

// Configures the http://localhost:5000/ route to send a text response
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Starts the app on port 5000, then calls the callback when 
// the app successfully starts.
app.listen(5000, () => {
    console.log('Listening on port 5000: http://localhost:5000');
});
```

You'll notice that the above TS code is almost the same as the normal JS code, thanks to type inference.

### Running the App

There's two steps to run this app:
1. Compile the TypeScript files
2. Run the compiled JavaScript `dist/index.js` file.

To compile the TypeScript files, you can use the `tsc` terminal command, which is made available from installing the `typescript` dependency in this project:

```bash
tsc
```

This will:
1. read the configuration settings and compiler options from `tsconfig.json`
2. compile the TypeScript files from the `"include"` setting (in this case, `"src/**/*`)
3. output the compiled TypeScript files as JavaScript to the specified `"outDir"` setting (in this case, `dist/`)

From there, you can run the compiled `dist/index.js` file via `node`:

```bash
node dist/index.js
# Listening on port 5000: http://localhost:5000
```

### Adding NPM Scripts

Of course, we don't want to manually run `tsc && node dist/index.js` whenever we want the app to run. Thankfully, we can add [custom NPM scripts](https://docs.npmjs.com/misc/scripts) that will both help us in development, as well as provide an easy way for Azure deployment scripts to build and run the app in the cloud.

In `package.json`, add the following scripts:

```json
...
    "scripts": {
        "start": "npm run serve",
        "serve": "node dist/index.js",
        "build-ts": "tsc",
        "watch-ts": "tsc --watch",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
...
```

To break these down:
- `npm run start` (or just `npm start`) will run `npm run serve`...
- `npm run serve` will serve the compiled JS app via `node`
- `npm run build-ts` will compile the TS files via `tsc`
- `npm run watch-ts` can be used in development to automatically compile the TS files whenever the files change
- `npm run test` (or just `npm test`) is not specified yet, but will be used to run tests

Now, you can run the below command to run your Node app:
```bash
npm run build-ts && npm start
```
