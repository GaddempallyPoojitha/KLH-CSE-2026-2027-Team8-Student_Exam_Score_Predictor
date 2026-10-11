
const form = document.getElementById("predictionForm");
const predictButton = document.getElementById("predictButton");
const resultBox = document.getElementById("result");
const scoreElement = document.getElementById("score");
const gradeElement = document.getElementById("grade");
const messageElement = document.getElementById("message");
const scoreRing = document.getElementById("scoreRing");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const data = {
        Hours_Studied: document.getElementById("Hours_Studied").value,
        Attendance: document.getElementById("Attendance").value,
        Parental_Involvement: document.getElementById("Parental_Involvement").value,
        Access_to_Resources: document.getElementById("Access_to_Resources").value,
        Extracurricular_Activities: document.getElementById("Extracurricular_Activities").value,
        Sleep_Hours: document.getElementById("Sleep_Hours").value,
        Previous_Scores: document.getElementById("Previous_Scores").value,
        Motivation_Level: document.getElementById("Motivation_Level").value,
        Internet_Access: document.getElementById("Internet_Access").value,
        Tutoring_Sessions: document.getElementById("Tutoring_Sessions").value,
        Family_Income: document.getElementById("Family_Income").value,
        Teacher_Quality: document.getElementById("Teacher_Quality").value,
        School_Type: document.getElementById("School_Type").value,
        Peer_Influence: document.getElementById("Peer_Influence").value,
        Physical_Activity: document.getElementById("Physical_Activity").value,
        Learning_Disabilities: document.getElementById("Learning_Disabilities").value,
        Parental_Education_Level: document.getElementById("Parental_Education_Level").value,
        Distance_from_Home: document.getElementById("Distance_from_Home").value,
        Gender: document.getElementById("Gender").value
    };

    predictButton.disabled = true;
    predictButton.querySelector("span:first-child").textContent = "Generating prediction...";
    scoreElement.innerHTML = "…<span>/100</span>";
    gradeElement.textContent = "Calculating";
    messageElement.textContent = "Analyzing the student information...";
    scoreRing.style.background =
        "conic-gradient(from -90deg, #a58aff 0deg, #292d48 0deg)";

    try {
        const response = await fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || "The prediction request failed.");
        }

        const predictedScore = Number(result.predicted_score);

        if (!Number.isFinite(predictedScore)) {
            throw new Error("The server returned an invalid score.");
        }

        const boundedScore = Math.max(0, Math.min(100, predictedScore));
        const degrees = boundedScore * 3.6;

        scoreElement.innerHTML =
            `${boundedScore.toFixed(2)}<span>/100</span>`;

        scoreRing.style.background =
            `conic-gradient(from -90deg, #a58aff 0deg, #6579ff ${degrees}deg, #292d48 ${degrees}deg 360deg)`;

        if (boundedScore >= 90) {
            gradeElement.textContent = "Excellent";
        } else if (boundedScore >= 75) {
            gradeElement.textContent = "Very Good";
        } else if (boundedScore >= 60) {
            gradeElement.textContent = "Good";
        } else {
            gradeElement.textContent = "Needs focus";
        }

        messageElement.textContent =
            "Prediction generated successfully using the trained Linear Regression model.";

    } catch (error) {
        console.error("Prediction error:", error);
        scoreElement.innerHTML = "--<span>/100</span>";
        gradeElement.textContent = "Prediction unavailable";
        messageElement.textContent = error.message ||
            "Unable to connect to the prediction server.";
        scoreRing.style.background =
            "conic-gradient(from -90deg, #f2b96e 0deg, #292d48 0deg)";
    } finally {
        predictButton.disabled = false;
        predictButton.querySelector("span:first-child").textContent =
            "Generate Prediction";
    }
});
