/*
 * Modelo
 */
var Modelo = function () {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaBorrada = new Evento(this);
  this.todasPreguntasBorradas = new Evento(this);
  this.preguntaEditada = new Evento(this);
  this.preguntasInicializadas = new Evento(this);
  this.votoAgregado = new Evento(this);
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function () {
    return this.preguntas.length ? this.ultimoId = this.preguntas[this.preguntas.length - 1].id : 0;
  },

  obtenerPregunta: function(id){
    return this.preguntas.map(pregunta => pregunta.id).indexOf(id);
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function (nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    var nuevaPregunta = {
      'textoPregunta': nombre,
      'id': id,
      'cantidadPorRespuesta': respuestas
    };
    this.preguntas.push(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar();
  },

  borrarPregunta: function (id) {
    //filtra el arreglo de objetos 
    let pregunta = this.obtenerPregunta(id);
    this.preguntas.splice(pregunta, 1);
    this.guardar();
    this.preguntaBorrada.notificar();
  },

  borrarTodo: function () {
    this.preguntas = [];
    this.ultimoId = 0;
    this.guardar();
    this.todasPreguntasBorradas.notificar();
  },

  editarPregunta: function (id, nuevaPregunta) {
    let pregunta = this.obtenerPregunta(id);
    this.preguntas[pregunta].textoPregunta = nuevaPregunta;
    this.guardar();
    this.preguntaEditada.notificar();
  },

  agregarVoto: function (nombrePregunta,respuestaSeleccionada) { 
    let respuestas = this.preguntas.find(pregunta => pregunta.textoPregunta === nombrePregunta).cantidadPorRespuesta;
    let respuesta = respuestas.find(respuesta => respuesta.textoRespuesta == respuestaSeleccionada);
    respuesta.cantidad++;
    this.guardar();
    this.votoAgregado.notificar();
  },
  //se guardan las preguntas
  guardar: function () {
    localStorage.setItem('preguntas', JSON.stringify(this.preguntas));
    localStorage.setItem('ultimoId', this.obtenerUltimoId());
  },

  inicializarPreguntas: function () {
    let ultimoId = localStorage.getItem('ultimoId')*1;

    if (ultimoId >= 1){
      this.ultimoId = ultimoId;
      this.preguntas = JSON.parse(localStorage.getItem('preguntas'));
    }
    this.preguntasInicializadas.notificar();
  },

};