import sympy as sp

def taylor_series(func, x0, y0, h, order=3):
    x = sp.symbols('x')
    f = sp.sympify(func)
    derivatives = [f]
    
    for _ in range(order):
        derivatives.append(sp.diff(derivatives[-1], x))
    
    y_approx = sum((derivatives[i].subs(x, x0) * (h**i) / sp.factorial(i) for i in range(order)))
    return {'approximation': float(y_approx)}
