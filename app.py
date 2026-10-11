from flask import Flask, request, jsonify, send_from_directory
import joblib
import pandas as pd
import os

app = Flask(__name__, static_folder="frontend")

# Load the trained best model
MODEL_PATH = r"C:\Student-Exam-Score-Predictor\models\best_model.pkl"

model = joblib.load(MODEL_PATH)


@app.route("/")
def home():
    return send_from_directory("frontend", "index.html")
@app.route("/frontend/<path:filename>")
def frontend_files(filename):
    return send_from_directory("frontend", filename)


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        input_data = pd.DataFrame([{
            "Hours_Studied": float(data["Hours_Studied"]),
            "Attendance": float(data["Attendance"]),
            "Parental_Involvement": data["Parental_Involvement"],
            "Access_to_Resources": data["Access_to_Resources"],
            "Extracurricular_Activities": data["Extracurricular_Activities"],
            "Sleep_Hours": float(data["Sleep_Hours"]),
            "Previous_Scores": float(data["Previous_Scores"]),
            "Motivation_Level": data["Motivation_Level"],
            "Internet_Access": data["Internet_Access"],
            "Tutoring_Sessions": float(data["Tutoring_Sessions"]),
            "Family_Income": data["Family_Income"],
            "Teacher_Quality": data["Teacher_Quality"],
            "School_Type": data["School_Type"],
            "Peer_Influence": data["Peer_Influence"],
            "Physical_Activity": float(data["Physical_Activity"]),
            "Learning_Disabilities": data["Learning_Disabilities"],
            "Parental_Education_Level": data["Parental_Education_Level"],
            "Distance_from_Home": data["Distance_from_Home"],
            "Gender": data["Gender"]
        }])

        prediction = model.predict(input_data)[0]

        # Keep prediction within a realistic exam-score range
        prediction = max(0, min(100, prediction))

        return jsonify({
            "success": True,
            "predicted_score": round(float(prediction), 2)
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400


if __name__ == "__main__":
    app.run(debug=True)