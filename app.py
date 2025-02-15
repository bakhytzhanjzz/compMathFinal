from flask import Flask, render_template, request, jsonify
import methods.root_finding as rf
import methods.matrix_methods as mm
import methods.differentiation as diff
import methods.integration as integ
import methods.curve_fitting as cf
import methods.taylor_series as ts
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/root_finding', methods=['POST'])
def root_finding():
    data = request.json
    method = data.get('method')
    function = data.get('function')
    interval = data.get('interval', [0, 1])

    if not function or not method:
        return jsonify({'error': 'Missing function or method'}), 400

    if method == 'false_position':
        result = rf.false_position(function, interval)
    elif method == 'newton_raphson':
        result = rf.newton_raphson(function, interval[0])
    else:
        return jsonify({'error': 'Invalid method'}), 400

    return jsonify(result)


@app.route('/jacobi', methods=['POST'])
def jacobi_method():
    data = request.json
    matrix = np.array(data.get('matrix'))
    initial_guess = np.array(data.get('initial_guess'))

    if matrix is None or initial_guess is None:
        return jsonify({'error': 'Missing matrix or initial guess'}), 400

    result = mm.jacobi_method(matrix, initial_guess)
    return jsonify(result)



@app.route('/matrix_inversion', methods=['POST'])
def matrix_inversion():
    data = request.json
    matrix = np.array(data.get('matrix'))

    if matrix is None:
        return jsonify({'error': 'Missing matrix input'}), 400

    result = mm.iterative_matrix_inversion(matrix)
    return jsonify(result)


@app.route('/curve_fitting', methods=['POST'])
def curve_fitting():
    data = request.json
    x = data.get('x')
    y = data.get('y')

    if x is None or y is None:
        return jsonify({'error': 'Missing x or y values'}), 400

    result = cf.least_squares_fit(x, y)
    return jsonify(result)


@app.route('/differentiation', methods=['POST'])
def differentiation():
    data = request.json
    x_values = data.get('x_values')
    y_values = data.get('y_values')

    if x_values is None or y_values is None:
        return jsonify({'error': 'Missing x or y values'}), 400

    result = diff.forward_difference(x_values, y_values)
    return jsonify(result)


@app.route('/taylor_series', methods=['POST'])
def taylor_series():
    data = request.json
    function = data.get('function')
    x0 = data.get('x0')
    y0 = data.get('y0')
    h = data.get('h')
    order = data.get('order', 3)

    if function is None or x0 is None or y0 is None or h is None:
        return jsonify({'error': 'Missing required parameters'}), 400

    result = ts.taylor_series(function, x0, y0, h, order)
    return jsonify(result)


@app.route('/integration', methods=['POST'])
def integration():
    data = request.json
    print("Received Integration Data:", data) 

    function = data.get('function')
    a = data.get('a')
    b = data.get('b')
    n = data.get('n')

    if function is None or a is None or b is None or n is None:
        return jsonify({'error': 'Missing required parameters'}), 400

    result = integ.simpsons_rule(function, a, b, n)
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
