import pandas as pd

def predict_cheating_probability(features, loaded_model):
    """
    Predict the probability of cheating based on input features.

    Parameters:
    features (list or array-like): A list or array of feature values in the following order:
        [num_images, mobile_phone, extra_person, mouth_open, no_person, eye_left_right]

    Returns:
    dict: A dictionary with probabilities of 'not cheating' and 'cheating', rounded to two decimal places.
    """
    # Define the feature names
    feature_names = ["num_images", "mobile_phone", "extra_person", "mouth_open", "no_person", "eye_left_right"]
    
    # Convert the features into a DataFrame with the correct feature names
    features_df = pd.DataFrame([features], columns=feature_names)
    
    # Get probability predictions
    probabilities = loaded_model.predict_proba(features_df)[0]

    # Return rounded probabilities
    return {
        "cheating_probability": round(probabilities[1] * 100, 2),
        "not_cheating_probability": round(probabilities[0] * 100, 2)
    }
