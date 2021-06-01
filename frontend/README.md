## Setup

Ensure [yarn](https://yarnpkg.com/) is installed on your local machine.

Then execute:

**`yarn install`**

To install all app dependencies.

## Run Development Build

Execute:

**`yarn start`**

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## Formatting and Linting

Excute:

**`yarn format`**

Auto-formats the codebase.

**`yarn lint`**

Performs lint check.

## Other Available Scripts

In the project directory, you can run:

**`yarn generate-component --name=<component name>`**

Auto generates the template code for a component.

E.g. `yarn generate-component --name=RoundButton` generates the template code for the `RoundButton` component.

**`yarn generate-data`**

Auto generates event data using [faker.js](https://www.npmjs.com/package/faker).

**`yarn build`**

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!
