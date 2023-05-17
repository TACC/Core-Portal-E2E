# Core-Portal-E2E

Steps to run: 

1. Run the command `npm install` to install the relevant project dependancies
1. Create a new file in settings folder called `.env.secret`. Populate it with values following the example in `.env.secret_example`
2. Run the test using the following: 
`PORTAL={portal_name} ENVIRONMENT={environment} npx playwright test`
