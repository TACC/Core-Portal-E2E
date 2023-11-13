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

data = {
    "PORTAL_DATAFILES_STORAGE_SYSTEMS": custom_portal_settings._PORTAL_DATAFILES_STORAGE_SYSTEMS or [],
    "SYSTEM_MONITOR_DISPLAY_LIST": custom_portal_settings._SYSTEM_MONITOR_DISPLAY_LIST or []
}

with open(output_path, 'w') as json_file: 
    json.dump(data, json_file, indent=2)

print(f"JSON file created.")