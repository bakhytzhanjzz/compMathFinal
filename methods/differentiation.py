def forward_difference(x, y):
    dy_dx = (y[1] - y[0]) / (x[1] - x[0])
    return {'derivative': dy_dx}
