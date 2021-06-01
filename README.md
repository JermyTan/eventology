# Black Cat

## Setup

Ensure [yarn](https://yarnpkg.com/) is installed on your local machine.

Then execute:

**`yarn install`**

To install husky for pre-commit hook.

Instructions to set up the app are located in the READMEs in the frontend and backend folder respectively.

## Development Guidelines

### Backend

- Use venv
- Use snake_case, 4 spaces indentations and CONSTANT_VARIABLE
- Use list comphension over `map`/`filter` where possible
- Include constant file
- Use double quotes for strings

### Frontend

- Only use yarn (no npm)
- Typescript only in `src` folder
- Component files use `.tsx`, utils function files use `.ts`
- Define constants instead of magic string
- Use enums
- Declare API request/response type