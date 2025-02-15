import numpy as np
import sympy as sp

def least_squares_fit(x, y):
    A = np.vstack([x, np.ones(len(x))]).T
    m, c = np.linalg.lstsq(A, y, rcond=None)[0]
    return {'slope': m, 'intercept': c}
