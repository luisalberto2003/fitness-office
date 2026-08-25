import graphviz

g = graphviz.Digraph('DER', format='png')
g.attr(rankdir='LR', bgcolor='white', fontname='Helvetica', splines='ortho')
g.attr('node', shape='none', fontname='Helvetica', fontsize='10')

def entidad(nombre, campos):
    filas = ''.join(
        f'<TR><TD ALIGN="LEFT" PORT="{c.split()[0]}">{c}</TD></TR>' for c in campos
    )
    label = f'''<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="0" CELLPADDING="4">
    <TR><TD BGCOLOR="#111318"><FONT COLOR="white"><B>{nombre}</B></FONT></TD></TR>
    {filas}
    </TABLE>>'''
    g.node(nombre, label=label)

entidad('usuarios', ['PK id', 'nombre', 'email', 'password_hash', 'rol', 'activo'])
entidad('socios', ['PK id', 'FK usuario_id', 'nombres', 'apellidos', 'cedula', 'telefono', 'estado'])
entidad('membresias', ['PK id', 'nombre', 'duracion_dias', 'precio'])
entidad('socio_membresias', ['PK id', 'FK socio_id', 'FK membresia_id', 'fecha_inicio', 'fecha_fin', 'estado'])
entidad('pagos', ['PK id', 'FK socio_membresia_id', 'monto', 'fecha_pago', 'metodo_pago', 'estado'])
entidad('asistencias', ['PK id', 'FK socio_id', 'fecha_hora'])
entidad('categorias_producto', ['PK id', 'nombre'])
entidad('productos', ['PK id', 'FK categoria_id', 'nombre', 'precio', 'stock'])
entidad('ordenes', ['PK id', 'FK usuario_id', 'fecha', 'estado', 'total'])
entidad('detalle_ordenes', ['PK id', 'FK orden_id', 'FK producto_id', 'cantidad', 'precio_unitario', 'subtotal'])

g.edge('usuarios', 'socios', label='1:1')
g.edge('socios', 'socio_membresias', label='1:N')
g.edge('membresias', 'socio_membresias', label='1:N')
g.edge('socio_membresias', 'pagos', label='1:N')
g.edge('socios', 'asistencias', label='1:N')
g.edge('categorias_producto', 'productos', label='1:N')
g.edge('usuarios', 'ordenes', label='1:N')
g.edge('ordenes', 'detalle_ordenes', label='1:N')
g.edge('productos', 'detalle_ordenes', label='1:N')

g.render('der', cleanup=True)
print("ok")
