const cards = document.getElementById('cards')
const templateCard = document.getElementById('template-card').content
const objetos = document.getElementById('objetos')
const templateCarrito = document.getElementById('template-objeto').content
const total = document.getElementById('total')
const templateTotal = document.getElementById('template-total').content
const fragment = document.createDocumentFragment()
let carrito = {}
/*EVENTOS*/
//Evento que detecta que el contenido a sido cargado
document.addEventListener('DOMContentLoaded', () =>{
    fetchData();
})
//Evento que detecta el click en una card (mas adelante en la funcion, especificaremos que sea solo el boton)
cards.addEventListener('click', e =>{
    addCarrito(e)
})
//evento que detecta cuando hacemos click en un elementos del carrito
objetos.addEventListener('click', e =>{
    btnAccion(e)
})
/*FUNCIONES*/

//FUNCION PARA OBTENER DATOS DEL JSON
const fetchData = async() =>{
    try{
        const res = await fetch('api.json')
        const data = await res.json()
        console.log(data)
        pintarCard(data)
    }
    catch(error){
        console.log(error)
    }
}
//FUNCION PARA IMPRIMIR UN CARD POR CADA ELEMENTO DEL JSON
const pintarCard = data => {
    data.forEach(producto => {
        templateCard.querySelector('h3').textContent = producto.title;
        templateCard.querySelector('p').textContent = producto.precio;
        templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        templateCard.querySelector('button').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}
//Función Para detectar a que elemento se hizo click
const addCarrito = e =>{
    //verificamos que se pulse especificamente al boton
    if (e.target.classList.contains('boton-compar')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}
//Funcion para agregar elementos al carrito
const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.boton-compar').dataset.id,
        title: objeto.querySelector('h3').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    pintarCarrito()
}
//Funcion para pintar en el carrito los elementos que se seleccionen
const pintarCarrito = () =>{
    objetos.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('h3').textContent = producto.title
        templateCarrito.getElementById('canti').textContent = producto.cantidad
        templateCarrito.getElementById('mas').dataset.id = producto.id
        templateCarrito.getElementById('menos').dataset.id = producto.id
        templateCarrito.getElementById('precio').textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    objetos.appendChild(fragment)
    pintarTotal()
    localStorage.setItem('carrito', JSON.stringify(carrito))
}
// Funcion Para pintar el total de productos y precio final
const pintarTotal = () =>{
    total.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        total.innerHTML = '<h3>Carrito Vacio</h3> <h4>Comience a comprar</h4>'
        return
    }
    const SumaCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
    const SumaPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)
    templateTotal.getElementById('total-productos').textContent = SumaCantidad
    templateTotal.getElementById('total-precio').textContent = SumaPrecio

    const clone = templateTotal.cloneNode(true)
    fragment.appendChild(clone)
    total.appendChild(fragment)
    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}
//Funcion para detectar que se hizo click sobre un boton para supar o restar productos
const btnAccion = e =>{
    if(e.target.classList.contains('sumar')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    if(e.target.classList.contains('restar')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}