import sys
import os
sys.path.append(os.getcwd())

from app.schemas.master import GuruResponse, MapelDiampuResponse
print("Schemas imported successfully")
try:
    print(GuruResponse.model_json_schema())
    print(MapelDiampuResponse.model_json_schema())
    print("Schemas passed validation")
except Exception as e:
    print(f"Schema validation error: {e}")
