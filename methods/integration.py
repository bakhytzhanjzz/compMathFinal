import sympy as sp

def simpsons_rule(func, a, b, n):
    x = sp.symbols('x')
    try:
        f = sp.lambdify(x, sp.sympify(func))
    except Exception as e:
        return {'error': f'Invalid function: {e}'}

    if n % 3 != 0:
        return {'error': 'n must be a multiple of 3'}

    h = (b - a) / n
    x_vals = [a + i * h for i in range(n + 1)]
    y_vals = [f(xi) for xi in x_vals]

    integral = (3 * h / 8) * (y_vals[0] + 3 * sum(y_vals[1:n:3]) + 3 * sum(y_vals[2:n-1:3]) + 2 * sum(y_vals[3:n-2:3]) + y_vals[-1])

    return {'integral': integral}
