import random
import pandas as pd

def predict_cheating_probability(features, loaded_model):
    """
    Predict the probability of cheating based on input features, introducing randomness
    to handle overfitting issues.

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

    # Modify probabilities to add randomness
    cheating_probability = probabilities[1] * 100
    not_cheating_probability = probabilities[0] * 100

    if cheating_probability >= 90.0:
        cheating_probability = round(random.uniform(80, 100), 2)
        not_cheating_probability = round(100 - cheating_probability, 2)
    elif cheating_probability <= 10.0:
        cheating_probability = round(random.uniform(0, 30), 2)
        not_cheating_probability = round(100 - cheating_probability, 2)
    else:
        cheating_probability = round(cheating_probability, 2)
        not_cheating_probability = round(not_cheating_probability, 2)

    # Return the modified probabilities
    return {
        "cheating_probability": cheating_probability,
        "not_cheating_probability": not_cheating_probability
    }
