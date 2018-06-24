/*
    Demostración de Web Scraping con Javascript y Expresiones Regulares.
    Autor: Julio J. - @jjyepez
    Fecha: 24/06/2018
*/

// --- si quieres probar con otros criterios de filtrado, remplaza la URL obtenida en ML en la sig linea --- jjy
const urlML = "https://videojuegos.mercadolibre.com.co/juego-ps4_Envio_Gratis_DisplayType_LF_OrderId_PRICE*DESC_Discount_40-100"

iniciar()

function iniciar(){
    traerHTML( urlML )
    actualizarFecha()
}

function traerHTML( urlML ){
    // --- servicio propio para superar restricciones CORS ... by jjyepez
    const URL   = "https://noesishosting.com/sw/cors/?a=cors&url=" + urlML

    // --- traer el HTML del sitio web
    fetch( URL )
    .then( rsp => rsp.text() )
    .then( rslt => {
    const jsonDatosExtraidos = procesarResultados( rslt )
    renderDatosExtraidos( jsonDatosExtraidos )
    })
    .catch( err => { console.log( err ) })
}

// --- procesar con RegExp
function procesarResultados( html ){
    const jsonDatos = []
    var   matches   = null

    // --- RegExp by jjyepez
    const expresionRegular = new RegExp( 
        "<img(?:.*?)alt=\'(.*?)\'(?:.*?)src=\'(.*?)\'(?:.*?)<a(?:.*?)href=\"(.*?)\"(?:.*?)<del>(.*?)</del>(?:.*?)fraction\">(.*?)</span>?(?:.*?)discount(?:.*?)>(.*?\%)"
    , "g" )

    do {
        // --- extrayendo datos
        matches = expresionRegular.exec( html )
        jsonDatos.push( matches )

    }
    while ( matches !== null )
    return jsonDatos
}

function renderDatosExtraidos( datos ){
    const $divResultados = document.getElementById('resultados')
          $divResultados.innerHTML = ''
    datos.forEach( reg => {
        if( reg ){
            const $card = document.createElement('div')
                $card.classList.add('card')
                $card.addEventListener('click', ()=>{
                    window.open(reg[3])
                })
                $card.innerHTML = `
                    <div class="thumb" >
                        <img src="${reg[2]}"/>
                    </div>
                    <div class="titulo">${reg[1]}</div>
                    <div class="precio-ant">
                        <div class="precio">${reg[4]}</div>
                        <div class="dcto"  >-${reg[6]} OFF</div>
                    </div>
                    <div class="oferta">$ ${reg[5]}</div>
                `
            $divResultados.appendChild( $card )
        }
    })
}

function actualizarFecha() {
    const hoy = new Date()
    const $fecha = document.getElementById('fecha')
          $fecha.innerHTML = `Actualizado al: ${('0'+hoy.getDate()).substr(-2)}/${('0'+(hoy.getMonth()+1)).substr(-2)}/${hoy.getFullYear()}`
}