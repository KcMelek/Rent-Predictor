import joblib
import pandas as pd
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

# Global variables to store the model, scaler, encoder, and feature order
model = None
scaler = None
encoder = None
feature_order = None

# Path to the model file
MODEL_PATH = "./predict_app/pricing_model.pkl"

# Load the model, scaler, encoder, and feature order (only once during startup)
def load_model():
    global model, scaler, encoder, feature_order
    try:
        model_data = joblib.load(MODEL_PATH)
        model = model_data.get('model')
        scaler = model_data.get('scaler')
        encoder = model_data.get('encoder')
        feature_order = model_data.get('feature_order')

        if not model or not scaler or not encoder or not feature_order:
            raise ValueError("Model, scaler, encoder, or feature order is missing in the loaded file.")

        print("Model, scaler, encoder, and feature order successfully loaded.")
    except FileNotFoundError:
        print(f"Model file not found at {MODEL_PATH}.")
    except Exception as e:
        print(f"Error loading model: {str(e)}")


# Features used during model training
NUMERIC_FEATURES = ['capacity / persons', 'rooms', 'beds', 'num of bathrooms']
CATEGORICAL_FEATURES = ['City', 'Country', 'property_type']
EQUIPMENT_FEATURES = [
    'Wireless Internet', 'Free Parking on Premises', 'Pets Allowed', 'Pool',
    'Climatisation / AC', 'Cheminée', 'Family/Kid Friendly', 'Hot Tub',
    'Hot Water', 'Elevator in Building', 'Heating', 'Kitchen', 'TV', 'Essentials', 'Washer'
]


class PredictPrice(APIView):
    def post(self, request):
        try:
            # Load model, scaler, encoder, and feature order if not already loaded
            if model is None or scaler is None or encoder is None or feature_order is None:
                load_model()

            # Parse input data
            input_data = request.data
            print("Received input data:", input_data)

            # Extract numeric, categorical, and equipment features
            numeric_data = {key: float(input_data[key]) for key in NUMERIC_FEATURES}
            categorical_data = {key: input_data[key] for key in CATEGORICAL_FEATURES}
            equipment_data = {key: int(input_data[key]) for key in EQUIPMENT_FEATURES}

            print("Numeric data:", numeric_data)
            print("Categorical data:", categorical_data)
            print("Equipment data:", equipment_data)

            # Combine all input features into a single DataFrame
            input_df = pd.DataFrame([{
                **numeric_data,
                **categorical_data,
                **equipment_data
            }])

            print("Initial input DataFrame:")
            print(input_df)

            # Check if scaler and encoder are loaded properly
            if not scaler or not encoder or not feature_order:
                return Response({'error': 'Scaler, encoder, or feature order not loaded properly.'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Scale numeric features
            input_df[NUMERIC_FEATURES] = scaler.transform(input_df[NUMERIC_FEATURES])
            print("Scaled numeric features:")
            print(input_df[NUMERIC_FEATURES])

            # One-hot encode categorical features
            encoded_cats = encoder.transform(input_df[CATEGORICAL_FEATURES])
            encoded_df = pd.DataFrame(encoded_cats, columns=encoder.get_feature_names_out(CATEGORICAL_FEATURES))

            print("Encoded categorical features:")
            print(encoded_df)

            # Combine scaled numeric, equipment, and encoded categorical features
            processed_input = pd.concat(
                [input_df[NUMERIC_FEATURES], input_df[EQUIPMENT_FEATURES], encoded_df], axis=1
            )

            # Ensure processed input matches the model's expected feature order
            processed_input = processed_input.reindex(columns=feature_order, fill_value=0)


            # Predict the price
            print("Model's expected features:", feature_order)
            print("Processed input features:", list(processed_input.columns))
            compare_feature_order(feature_order, list(processed_input.columns))

            predicted_price = model.predict(processed_input)[0]

            print("Predicted price:", predicted_price)

            return Response({'predicted_price': round(predicted_price, 2)}, status=status.HTTP_200_OK)

        except Exception as e:
            print("Error occurred:", str(e))
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Function to compare feature order and report differences
def compare_feature_order(model_features, input_features):
    if model_features == input_features:
        print("Feature order matches perfectly!")
    else:
        print("Feature order mismatch detected!")
        # Find missing features in the input
        missing_in_input = [feature for feature in model_features if feature not in input_features]
        if missing_in_input:
            print("Features missing in the input:", missing_in_input)

        # Find extra features in the input
        extra_in_input = [feature for feature in input_features if feature not in model_features]
        if extra_in_input:
            print("Extra features in the input:", extra_in_input)

        # Find features that are out of order
        ordered_mismatch = [
            (model_features[i], input_features[i])
            for i in range(min(len(model_features), len(input_features)))
            if model_features[i] != input_features[i]
        ]
        if ordered_mismatch:
            print("Mismatched feature order at indices:")
            for i, (expected, actual) in enumerate(ordered_mismatch):
                print(f"  Index {i}: Expected '{expected}' but got '{actual}'")


