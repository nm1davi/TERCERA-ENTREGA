Profe cree la app.js y para ejecutar nodemon, utilice el siguiente comando =>  nodemon --ignore productos.json app.js. Porque si no sigue corriendo el servidor una y otra vez sin que yo realice ningún 
tipo de cambio, entonces investigue y encontré esa solución.

Explicación de la App
Primero crea un archivo JSON con algunos productos que yo invente.
Luego levanto el servidor una vez que ya están creados los productos
Cuando voy a: http://localhost:8080/products me muestra todos los productos creados 
Cuando voy a: http://localhost:8080/products/ (número de id) encuentra el producto con ese ID y me lo trae
Cuando voy a: http://localhost:8080/products?limit= (número de productos que quiero traer) me trae la cantidad de productos que yo quiero, es decir, si pongo 1 me trae un producto, si pongo 2 me trae 2 productos
y así sucesivamente.
