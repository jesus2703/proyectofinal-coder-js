// consultamos las variables que vamos a utilizar 

const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
const confirmarCompra = document.getElementById("confirmar-compra")
const templateCard = document.getElementById("template-card").content
const templateFooter = document.getElementById("template-footer").content
const templateCarrito = document.getElementById("template-carrito").content
const fragment = document.createDocumentFragment()


// creamos el objeto carrito

let carrito = {}

// Esperamos que cargue todo el contenido del DOM y pintamos carrito en caso de que exista informacion

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
        pintarCarrito()     
    } 
})

// Creamos los eventos

cards.addEventListener("click", (e) => {
    agregarCarrito(e)
})

items.addEventListener("click", (e) => {
    btnAccion(e)
})

// traemos los datos de la api.json

const fetchData = async () => {
    try {
        const res = await fetch("api.json")
        const data = await res.json()
        pintarCard(data)
    } catch (error) {
        console.log(error)
        
    }
}

// pintamos los datos en las cards

const pintarCard = (data) => {
    data.forEach(producto=> {
        templateCard.querySelector("h5").textContent = producto.title
        templateCard.querySelector("p").textContent = producto.precio
        templateCard.querySelector("img").setAttribute("src", producto.img)
        templateCard.querySelector(".btn-dark").dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
        
    })
    cards.appendChild(fragment)
}

const agregarCarrito = e => {
   
    if (e.target.classList.contains("btn-dark")) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector(".btn-dark").dataset.id,
        title: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1
    }

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
        
    }

    carrito[producto.id] = {...producto}
    pintarCarrito()
  
}

// pintamos el carrito

const pintarCarrito = () =>{
    items.innerHTML = ""
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector("th").textContent = producto.id
        templateCarrito.querySelectorAll("td")[0].textContent = producto.title
        templateCarrito.querySelectorAll("td")[1].textContent = producto.precio
        templateCarrito.querySelectorAll("td")[2].textContent = producto.cantidad
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()

    // almacenamos el carrito en el localstorage

    localStorage.setItem("carrito", JSON.stringify(carrito))

}

// pintamos la informacion del footer

const pintarFooter = () => {
    footer.innerHTML = ""
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito Vacio-Comience a comprar</th>
        `   
        return 
    }

    // creamos las formulas para cantidad y precio

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc+cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc+cantidad*precio,0)

    templateFooter.querySelectorAll("td")[0].textContent = nCantidad
    templateFooter.querySelector("span").textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    // vaciamos el carrito

    const vaciarCarrito = document.getElementById("vaciar-carrito")
    vaciarCarrito.addEventListener("click", () => {
        carrito = {}
        pintarCarrito()
    })
}

// aumentar y disminuir cantidades

const btnAccion = e => {

   if (e.target.classList.contains("btn-info")) {

    const producto = carrito[e.target.dataset.id]
    producto.cantidad++
    carrito[e.target.dataset.id] = { ...producto}
    pintarCarrito()
    
   }

   if (e.target.classList.contains("btn-danger")) {

    const producto = carrito[e.target.dataset.id]
    producto.cantidad--
    if (producto.cantidad === 0) {
        delete carrito[e.target.dataset.id]  
    }
    pintarCarrito()
    
   }

   e.stopPropagation()
}

// confirmar compra

confirmarCompra.addEventListener("click", () => {
    if (Object.keys(carrito).length === 0) {

        Swal.fire(
            'Carrito Vacio!!!',
            'Debe agregar productos',
            'error'
          )
        
    } else {
        Swal.fire(
            'Muchas Gracias!!!',
            'Su compra ha sido exitosa',
            'success'
          )
          carrito = {}
          pintarCarrito()
    }
})
