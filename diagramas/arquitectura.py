import graphviz

g = graphviz.Digraph('Arquitectura', format='png')
g.attr(rankdir='LR', bgcolor='white', fontname='Helvetica', nodesep='0.6', ranksep='0.8')
g.attr('node', fontname='Helvetica', fontsize='11', style='filled', fontcolor='white', shape='box', margin='0.25,0.15')

with g.subgraph(name='cluster_cliente') as c:
    c.attr(label='Cliente', style='rounded', color='#111318', fontcolor='#111318')
    c.node('navegador', 'Navegador Web\n(React.js SPA)', fillcolor='#e11d2a')

with g.subgraph(name='cluster_servidor') as s:
    s.attr(label='Servidor de Aplicación', style='rounded', color='#111318', fontcolor='#111318')
    s.node('api', 'API RESTful\n(Node.js + Express)', fillcolor='#111318')
    s.node('auth', 'Middleware JWT\n(Autenticación y Roles)', fillcolor='#111318')
    s.node('logica', 'Lógica de Negocio\n(Socios, Membresías,\nInventario, Órdenes)', fillcolor='#111318')

with g.subgraph(name='cluster_datos') as d:
    d.attr(label='Base de Datos', style='rounded', color='#111318', fontcolor='#111318')
    d.node('bd', 'PostgreSQL\n(Modelo Relacional 3FN)', fillcolor='#4b5563')

g.node('cloud', 'Despliegue Cloud\n(Vercel / Railway)', shape='folder', style='filled', fillcolor='#9ca3af', fontcolor='#111318')

g.edge('navegador', 'api', label='HTTPS / JSON')
g.edge('api', 'auth')
g.edge('auth', 'logica')
g.edge('logica', 'bd', label='Sequelize ORM')
g.edge('cloud', 'navegador', style='dashed', label='sirve')
g.edge('cloud', 'api', style='dashed', label='hospeda')

g.render('arquitectura', cleanup=True)
print("ok")
