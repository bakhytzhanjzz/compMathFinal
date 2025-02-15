import numpy as np

def forward_difference(x_values, y_values):
    try:
        x_values = np.array(x_values, dtype=float)
        y_values = np.array(y_values, dtype=float)

        if len(x_values) != len(y_values):
            return {'error': 'x and y values must have the same length'}

        n = len(x_values)
        derivatives = []

        for i in range(n - 1):
            dx = x_values[i + 1] - x_values[i]
            dy = y_values[i + 1] - y_values[i]
            derivatives.append(dy / dx)

        return {'derivatives': derivatives}

    except Exception as e:
        return {'error': f'Failed to compute forward difference: {e}'}
