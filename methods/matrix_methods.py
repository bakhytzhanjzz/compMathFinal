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
    try:
        A = np.array(A, dtype=float)
        n = A.shape[0]

        if A.shape[0] != A.shape[1]:
            return {'error': 'Matrix must be square'}

        if abs(np.linalg.det(A)) < 1e-10:
            return {'error': 'Matrix is singular or nearly singular'}

        alpha = 1.0 / np.linalg.norm(A, 1)
        X = alpha * np.eye(n)
        
        I = np.eye(n)
        
        for i in range(max_iter):
            X_new = X @ (2 * I - A @ X)
            
            error = np.linalg.norm(I - A @ X_new, ord=np.inf)
            if error < tol:
                return {'inverse': X_new.tolist(), 'iterations': i+1, 'error': float(error)}

            if np.any(np.isnan(X_new)) or np.any(np.isinf(X_new)):
                return {'error': 'Iteration diverged', 'iterations': i+1}
            
            X = X_new

        error = np.linalg.norm(I - A @ X, ord=np.inf)
        return {'inverse': X.tolist(), 'iterations': max_iter, 'warning': 'Max iterations reached', 'error': float(error)}

    except Exception as e:
        return {'error': f'Failed to compute inverse: {str(e)}'}