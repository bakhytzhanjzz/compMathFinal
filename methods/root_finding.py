import numpy as np
import sympy as sp

def false_position(func, interval, tol=1e-6, max_iter=100):
    x = sp.symbols('x')
    f = sp.lambdify(x, func)
    a, b = interval
    for _ in range(max_iter):
        fa, fb = f(a), f(b)
        if fa * fb > 0:
            return {'error': 'Invalid interval'}
        c = (a * fb - b * fa) / (fb - fa)
        fc = f(c)
        if abs(fc) < tol:
            return {'root': c, 'iterations': _}
        if fa * fc < 0:
            b = c
        else:
            a = c
    return {'root': c, 'iterations': max_iter, 'warning': 'Max iterations reached'}

def newton_raphson(func, x0, tol=1e-6, max_iter=100):
    x = sp.symbols('x')
    f = sp.lambdify(x, func)
    df = sp.lambdify(x, sp.diff(func, x))
    for _ in range(max_iter):
        fx0 = f(x0)
        dfx0 = df(x0)
        if abs(fx0) < tol:
            return {'root': x0, 'iterations': _}
        if dfx0 == 0:
            return {'error': 'Derivative zero'}
        x0 = x0 - fx0 / dfx0
    return {'root': x0, 'iterations': max_iter, 'warning': 'Max iterations reached'}
