# Core-Portal-E2E

Steps to run: 

1. Run the command `npm install` and `npx playwright install` to install playwright and the relevant project dependancies
2. In the settings folder create and populate the following files:
	 * `.env.secret` : follow template in [.env.secret_example](https://github.com/TACC/Core-Portal-E2E/blob/main/settings/.env.secret_example) and populate with values from Stache entry
   * `.env.portal` : copy contents of the .env file relevant to the portal and environment being tested from the [Core Portal Deployments](https://github.com/TACC/Core-Portal-Deployments/tree/main) repo ([env file](https://github.com/TACC/Core-Portal-Deployments/blob/main/core-portal/camino/prod.env) for prod cep)
   * `custom_portal_settings.py` : copy contents of the settings_custom file relevant to the portal and environment being tested from the Core Portal Deployments repo ([settings_custom](https://github.com/TACC/Core-Portal-Deployments/blob/main/core-portal/camino/prod.settings_custom.py) file for prod cep)
3. Run the following command from root of the project: `python3 utils/pythonHelper.py` and ensure a file named `custom_portal_settings.json` gets created in the settings folder with some portal data
4. Run tests using the command `npx playwright test`
