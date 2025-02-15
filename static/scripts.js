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
            <label>Matrix (comma-separated rows, use ; to separate rows):</label>
            <textarea class="form-control" id="matrixInput" placeholder="e.g., 10,-1,2,0,6; -1,11,-1,3,25; 2,-1,10,-1,-11"></textarea>
            <label>Initial Guess (comma-separated):</label>
            <input type="text" class="form-control" id="initialGuessInput" placeholder="e.g., 0,0,0,0">
        `;
    } else if (method === "matrix_inversion") {
        inputHTML = `
            <label>Matrix (comma-separated rows, use ; to separate rows):</label>
            <textarea class="form-control" id="matrixInput" placeholder="e.g., 4,7; 2,6"></textarea>
        `;
    } else if (method === "curve_fitting") {
        inputHTML = `
            <label>X Values (comma-separated):</label>
            <input type="text" class="form-control" id="xValuesInput" placeholder="e.g., 1,2,3,4">
            <label>Y Values (comma-separated):</label>
            <input type="text" class="form-control" id="yValuesInput" placeholder="e.g., 2,3,5,8">
        `;
    } else if (method === "differentiation") {  
        inputHTML = `
            <label>X Values (comma-separated):</label>
            <input type="text" class="form-control" id="xValuesInput" placeholder="e.g., 1,2,3,4">
            <label>Y Values (comma-separated):</label>
            <input type="text" class="form-control" id="yValuesInput" placeholder="e.g., 2,3,5,8">
        `;
    } else if (method === "taylor_series") {  // ✅ Fixed: Added input fields for Taylor Series
        inputHTML = `
            <label>Function:</label>
            <input type="text" class="form-control" id="functionInput" placeholder="e.g., x**2 + x">
            <label>Initial x (x0):</label>
            <input type="number" class="form-control" id="x0Input" placeholder="e.g., 0">
            <label>Initial y (y0):</label>
            <input type="number" class="form-control" id="y0Input" placeholder="e.g., 1">
            <label>Step Size (h):</label>
            <input type="number" class="form-control" id="hInput" placeholder="e.g., 0.1">
            <label>Order of Expansion:</label>
            <input type="number" class="form-control" id="orderInput" placeholder="e.g., 3">
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
        let rawMatrix = document.getElementById("matrixInput").value.trim().split(';');
        let matrix = rawMatrix.map(row => row.split(',').map(num => parseFloat(num.trim())));
        requestData = {
            matrix: matrix,
            initial_guess: document.getElementById("initialGuessInput").value.split(',').map(Number)
        };
        method = "jacobi";
    } else if (method === "matrix_inversion") {
        let rawMatrix = document.getElementById("matrixInput").value.trim().split(';');
        let matrix = rawMatrix.map(row => row.split(',').map(num => parseFloat(num.trim())));
        requestData = { matrix: matrix };
    } else if (method === "curve_fitting") {
        requestData = {
            x: document.getElementById("xValuesInput").value.split(',').map(Number),
            y: document.getElementById("yValuesInput").value.split(',').map(Number)
        };
    } else if (method === "differentiation") {  
        requestData = {
            x_values: document.getElementById("xValuesInput").value.split(',').map(Number),
            y_values: document.getElementById("yValuesInput").value.split(',').map(Number)
        };
    } else if (method === "taylor_series") {  // ✅ Fixed: Now sends Taylor Series data correctly
        requestData = {
            function: document.getElementById("functionInput").value,
            x0: parseFloat(document.getElementById("x0Input").value),
            y0: parseFloat(document.getElementById("y0Input").value),
            h: parseFloat(document.getElementById("hInput").value),
            order: parseInt(document.getElementById("orderInput").value)
        };
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

