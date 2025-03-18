import json 
import os
import sys

# Get the absolute path of the current script
script_path = os.path.abspath(__file__)

# Derive the project root and settings folder paths
project_root = os.path.dirname(os.path.dirname(script_path))
settings_folder = os.path.join(project_root, 'settings')

# Append the settings folder to the Python path
sys.path.append(settings_folder)

# Import the custom portal settings
import custom_portal_settings

# Define the output file path
output_path = os.path.join(settings_folder, 'custom_portal_settings.json')

# open and read the .env file 
with open(f'{settings_folder}/.env.portal') as file:
    for line in file:
        if line.strip() and not line.startswith('#'):
            key, value = line.strip().split('=', 1)
            os.environ[key] = value

# add data we want to retrieve and use from python config and env file
data = {
    "PORTAL_DATAFILES_STORAGE_SYSTEMS": custom_portal_settings._PORTAL_DATAFILES_STORAGE_SYSTEMS or [],
    "SYSTEM_MONITOR_DISPLAY_LIST": custom_portal_settings._SYSTEM_MONITOR_DISPLAY_LIST or [],
    "NGINX_SERVER_NAME": os.getenv('NGINX_SERVER_NAME'),
    "WORKBENCH_SETTINGS":custom_portal_settings._WORKBENCH_SETTINGS or [],
    "PORTAL_PROJECTS_SYSTEM_PREFIX": custom_portal_settings._PORTAL_PROJECTS_SYSTEM_PREFIX or '',
    "PORTAL_USER_ACCOUNT_SETUP_STEPS": custom_portal_settings._PORTAL_USER_ACCOUNT_SETUP_STEPS or ''
}

with open(output_path, 'w') as json_file: 
    json.dump(data, json_file, indent=2)

print(f"JSON file created.")