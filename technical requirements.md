# Technical Requirements

- Note the **most important requirement** is to finish all the functionalities properly in time (**other than the me/profile page**).
- Me/Profile page is optional. Try to complete it if time permits. Otherwise, please focus on polishing up the interactions of other pages like list/detail page
- All requirements start with \`**Must**\` are compulsory.
- Requirements marked with bonus are to challenge yourself.
- For all other requirements, try to complete as many as you can.

## Git

- [x] **Must** create a git repo on gitlab
- [x] Commit frequently
- [x] Commit message should be meaningful
- [x] \(bonus) Set up gitlab CI checks for the linting, testing job

## API Design

- [x] **Must** design and document backend APIs to retrieve all necessary data for FE user interactions like login, browsing etc.
- [x] Decide how you are going to implement session, using sessionid vs token based method.
- [x] Create your own mock data using [faker.js](https://github.com/marak/Faker.js/). and serve your fake data using a simple express.js service
- [x] \(bonus) Implement session logic on express server

## Dev and Build

- [x] Cannot use any  boilerplate generator like `create-react-app`
- [x] **Must** use `webpack` (webpack 5+) as your build tool.
- [x] Should have separate configurations for local development and production build.
- [x] **Must** support JavaScript code splitting for your webpack production build.
- [x] Have hot reload for your local development.
- [ ] \(bonus) Support CSS coding splitting.
- [x] \(bonus) Setup `react-hot-loader` for your local development.

## JavaScript/TypeScript

- [x] Use modern ECMAScript syntax like class, module etc
- [x] Use async/await, generator functions to avoid the callback hell
- [x] Setup babel to transpile newer ECMAScript code for older browsers
- [x] **Must** use [TypeScript](https://www.typescriptlang.org/) as a static type checker and write type definition to annotate the code properly 
- [x] Document down API schema with TypeScript
- [ ] \(bonus) Study the min browser version you plan to support and only include the necessary polyfills to save bundle size

## CSS

- [x] **Must** use SCSS as preprocessor
- [x] **Must** use CSS Modules with your React component
- [ ] \(bonus) Add autoPrefixer to cover browser discrepancies on CSS implementation

## React

- [x] **Must** use React 16+ for the entry task
- [x] Use `react-router` for the routing
- [x] \(bonus) Explore using newer React APIs like hooks, suspense, memo

## Redux

- [x] **Must** use `redux` to manage your data logic
- [x] **Must** use `redux-thunk` for async actions
- [ ] \(bonus) Support inject reducer asynchronously on demand instead of combine all the reducers up front

## Linting

- [x] Setup ESLint as a `pre-commit` hook
- [x] Use `prettier` to format your code automatically
- [ ] Use `stylelint` as a `pre-commit` hook to lint your CSS code as well

## Testing

- [ ] Set up `jest` and `enzyme` as your test framework
- [ ] Write at least one snapshot test
- [ ] Use enzyme to test out the rendering logic for at least one React component

## Bonus

- [ ] Support internationalisation (i18n)
- [ ] Support server side rendering **(in-progress)**
- [ ] Annotate page properly with SEO meta tags

