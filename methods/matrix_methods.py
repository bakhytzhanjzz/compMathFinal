import numpy as np

def jacobi_method(A, x0, tol=1e-6, max_iter=100):
    n = len(A)
    x = np.array(x0, dtype=float)
    
    for _ in range(max_iter):
        x_new = np.zeros_like(x)
        
        for i in range(n):
            s = sum(A[i][j] * x[j] for j in range(n) if j != i)
            x_new[i] = (A[i][-1] - s) / A[i][i]
        
        if np.linalg.norm(x_new - x, ord=np.inf) < tol:
            return {'solution': x_new.tolist(), 'iterations': _}
        
        x = x_new
    
    return {'solution': x.tolist(), 'iterations': max_iter, 'warning': 'Max iterations reached'}


def iterative_matrix_inversion(A, tol=1e-6, max_iter=100):
    I = np.eye(len(A))
    X = np.linalg.inv(A + I) - I  # Initial approximation
    for _ in range(max_iter):
        X_new = X @ (2 * I - A @ X)
        if np.linalg.norm(X_new - X, ord=np.inf) < tol:
            return {'inverse': X_new.tolist(), 'iterations': _}
        X = X_new
    return {'inverse': X.tolist(), 'iterations': max_iter, 'warning': 'Max iterations reached'}
