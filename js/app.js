const listaProductos = document.getElementById('lista-productos');
const formularioProducto = document.getElementById('formulario-producto');
const nombreProductoInput = document.getElementById('product_name');
const precioProductoInput = document.getElementById('product_price');

// Función para obtener y listar todos los productos de la API
async function obtenerProductos() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/product'); 
        const productos = await response.json();

        // Limpiamos el contenedor antes de volver a listar los productos
        listaProductos.innerHTML = '';

        // Iteramos sobre cada producto y los mostramos
        productos.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');
            productoDiv.innerHTML = `
                <span>${producto.name} - $${producto.price}</span>
                <button class="delete-btn" data-id="${producto.id}">Eliminar</button>
            `;
            listaProductos.appendChild(productoDiv);
        });

        // Añadimos evento a los botones de eliminar
        document.querySelectorAll('.delete-btn').forEach(boton => {
            boton.addEventListener('click', eliminarProducto);
        });
    } catch (error) {
        console.error('Error al obtener los productos:', error.message);
    }
}

// Función para eliminar un producto
async function eliminarProducto(event) {
    const idProducto = event.target.getAttribute('data-id');
    try {
        await fetch(`http://localhost:8080/api/v1/product/delete/${idProducto}`, {
            method: 'DELETE'
        });
        // Recargamos la lista de productos
        obtenerProductos();
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
    }
}

// Función para añadir un nuevo producto
async function añadirProducto(event) {
    event.preventDefault();

    const nuevoProducto = {
        name: nombreProductoInput.value,
        price: parseFloat(precioProductoInput.value)
    };

    try {
        await fetch('http://localhost:8080/api/v1/product/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoProducto)
        });

        // Limpiamos los inputs del formulario
        nombreProductoInput.value = '';
        precioProductoInput.value = '';

        obtenerProductos();
    } catch (error) {
        console.error('Error al añadir el producto:', error.message);
    }
}

formularioProducto.addEventListener('submit', añadirProducto);

// Inicializamos la lista de productos al cargar la página
obtenerProductos();
