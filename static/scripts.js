function updateMethodInputs() {
    let method = document.getElementById("methodType").value;
    let inputDiv = document.getElementById("methodInputs");
    inputDiv.innerHTML = ""; // Clear previous inputs

    let inputHTML = "";

    if (method === "root_finding") {
        inputHTML = `
            <label>Function f(x):</label>
            <input type="text" class="form-control" id="functionInput" placeholder="e.g., x**3 - 2*x - 5">
            <label>Interval (comma-separated):</label>
            <input type="text" class="form-control" id="intervalInput" placeholder="e.g., 1,3">
            <label>Method:</label>
            <select class="form-select" id="rootMethod">
                <option value="false_position">False Position</option>
                <option value="newton_raphson">Newton Raphson</option>
            </select>
        `;
    } else if (method === "jacobi_method") {
        inputHTML = `
            <label>Matrix (comma-separated rows):</label>
            <textarea class="form-control" id="matrixInput" placeholder="e.g., 3,2,-1; 2,-1,3; -1,5,2"></textarea>
            <label>Initial Guess (comma-separated):</label>
            <input type="text" class="form-control" id="initialGuessInput" placeholder="e.g., 0,0,0">
        `;
    } else if (method === "matrix_inversion") {
        inputHTML = `
            <label>Matrix (comma-separated rows):</label>
            <textarea class="form-control" id="matrixInput" placeholder="e.g., 3,2,-1; 2,-1,3; -1,5,2"></textarea>
        `;
    } else if (method === "curve_fitting") {
        inputHTML = `
            <label>X Values (comma-separated):</label>
            <input type="text" class="form-control" id="xValuesInput" placeholder="e.g., 1,2,3,4">
            <label>Y Values (comma-separated):</label>
            <input type="text" class="form-control" id="yValuesInput" placeholder="e.g., 2,3,5,8">
        `;
    } else if (method === "integration") {
        inputHTML = `
            <label>Function:</label>
            <input type="text" class="form-control" id="functionInput" placeholder="e.g., x**2">
            <label>Lower Bound:</label>
            <input type="number" class="form-control" id="aInput" placeholder="e.g., 0">
            <label>Upper Bound:</label>
            <input type="number" class="form-control" id="bInput" placeholder="e.g., 2">
            <label>Subintervals:</label>
            <input type="number" class="form-control" id="nInput" placeholder="e.g., 6">
        `;
    }

    inputDiv.innerHTML = inputHTML; 
}


document.addEventListener("DOMContentLoaded", function () {
    updateMethodInputs(); 
});


function submitMethod() {
    let method = document.getElementById("methodType").value;
    let requestData = {};

    if (method === "root_finding") {
        requestData = {
            method: document.getElementById("rootMethod").value,
            function: document.getElementById("functionInput").value,
            interval: document.getElementById("intervalInput").value.split(',').map(Number)
        };
    } else if (method === "jacobi_method") {
        requestData = {
            matrix: document.getElementById("matrixInput").value.split(';').map(row => row.split(',').map(Number)),
            initial_guess: document.getElementById("initialGuessInput").value.split(',').map(Number)
        };
        method = "jacobi";
    } else if (method === "integration") {
        requestData = {
            function: document.getElementById("functionInput").value,
            a: parseFloat(document.getElementById("aInput").value),
            b: parseFloat(document.getElementById("bInput").value),
            n: parseInt(document.getElementById("nInput").value)
        };
    }

    console.log("Sending Request to /" + method, requestData); 

    document.getElementById("loadingSpinner").style.display = "block";
    document.getElementById("resultContainer").style.display = "none";

    $.ajax({
        url: `/${method}`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(requestData),
        success: function(response) {
            document.getElementById("loadingSpinner").style.display = "none";
            document.getElementById("resultContainer").style.display = "block";
            document.getElementById("resultOutput").innerHTML = JSON.stringify(response, null, 2);
        },
        error: function(err) {
            document.getElementById("loadingSpinner").style.display = "none";
            document.getElementById("resultContainer").classList.replace("alert-success", "alert-danger");
            document.getElementById("resultOutput").innerHTML = "Error: " + err.responseText;
        }
    });
}

