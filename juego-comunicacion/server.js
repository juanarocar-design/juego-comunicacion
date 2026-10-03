const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/jugador', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/jugador.html'));
});

// Banco de 40 preguntas sobre comunicación
const bancoPreguntas = [
  { id: 1, pregunta: "¿Cuál es una barrera física de la comunicación?", respuestas: ["Ruido ambiental", "Mala señal", "Distancia física", "Paredes/Bloqueos"], correcta: 0 },
  { id: 2, pregunta: "¿Qué caracteriza a la escucha activa?", respuestas: ["Hacer preguntas", "Mantener contacto visual", "No interrumpir", "Parafrasear"], correcta: 2 },
  { id: 3, pregunta: "¿Qué genera mala interpretación en chats?", respuestas: ["Falta de tono de voz", "Mensajes muy cortos", "Uso excesivo de emojis", "Escribir en mayúsculas"], correcta: 0 },
  { id: 4, pregunta: "Ejemplo de ruido semántico:", respuestas: ["Uso de tecnicismos", "Idiomas diferentes", "Ambigüedad en palabras", "Traducción errónea"], correcta: 0 },
  { id: 5, pregunta: "¿Qué es un 'Mensaje YO' en asertividad?", respuestas: ["Expresar el sentir propio", "Sin culpar al otro", "Hablar con claridad", "Pedir un cambio con respeto"], correcta: 0 },
  { id: 6, pregunta: "¿Cuál es una barrera psicológica?", respuestas: ["Prejuicios", "Estrés/Ansiedad", "Ego/Orgullo", "Mal genio"], correcta: 1 },
  { id: 7, pregunta: "¿Qué elemento es clave en la comunicación no verbal?", respuestas: ["Postura corporal", "Contacto visual", "Gestos faciales", "Tono de voz"], correcta: 0 },
  { id: 8, pregunta: "Causa común de conflicto en equipos:", respuestas: ["Asumir sin preguntar", "Falta de claridad", "Mala distribución de tareas", "Falta de feedback"], correcta: 0 },
  { id: 9, pregunta: "¿Qué busca el feedback asertivo?", respuestas: ["Mejorar procesos", "Enfocarse en acciones", "Ser constructivo", "Mantener respeto"], correcta: 2 },
  { id: 10, pregunta: "¿Qué es la empatía en comunicación?", respuestas: ["Ponerse en el lugar del otro", "Comprender emociones", "Escuchar sin juzgar", "Validar el sentir del otro"], correcta: 0 },
  { id: 11, pregunta: "¿Qué evita el sesgo de confirmación?", respuestas: ["Validar datos", "Escuchar posturas opuestas", "Mantener mente abierta", "Preguntar el porqué"], correcta: 1 },
  { id: 12, pregunta: "¿Qué es el ruido fisiológico?", respuestas: ["Dolor de cabeza", "Cansancio extremo", "Problemas auditivos", "Hambre"], correcta: 1 },
  { id: 13, pregunta: "Efecto de la sobrecarga de información:", respuestas: ["Saturación mental", "Pérdida de datos clave", "Confusión", "Desinterés"], correcta: 0 },
  { id: 14, pregunta: "Una regla del canal formal en empresas:", respuestas: ["Seguir conducto regular", "Usar correos oficiales", "Dejar registro escrito", "Ser claro y conciso"], correcta: 2 },
  { id: 15, pregunta: "¿Qué destruye la comunicación asertiva?", respuestas: ["Sarcasmo", "Pasivo-agresividad", "Gritos/Insultos", "Evasión"], correcta: 1 },
  { id: 16, pregunta: "¿Qué es la kinesia?", respuestas: ["Lenguaje corporal", "Movimiento de manos", "Expresión facial", "Postura al hablar"], correcta: 0 },
  { id: 17, pregunta: "¿Qué estudia la proxémica?", respuestas: ["Distancia personal", "Uso del espacio", "Contacto físico", "Límites territoriales"], correcta: 1 },
  { id: 18, pregunta: "¿Qué es el paralenguaje?", respuestas: ["Tono e intensidad de voz", "Ritmo al hablar", "Pausas y silencios", "Velocidad de la voz"], correcta: 0 },
  { id: 19, pregunta: "Riesgo del rumor en organizaciones:", respuestas: ["Desinformación", "Clima laboral tóxico", "Pérdida de confianza", "Pánico inmerecido"], correcta: 0 },
  { id: 20, pregunta: "Mecanismo para confirmar recepción de mensaje:", respuestas: ["Pedir confirmación", "Retroalimentación", "Repetir la orden", "Resumir acuerdos"], correcta: 1 },
  { id: 21, pregunta: "¿Qué genera la falta de asertividad?", respuestas: ["Resentimiento", "Acumulación de molestias", "Malentendidos", "Falta de límites"], correcta: 1 },
  { id: 22, pregunta: "Característica de un mal emisor:", respuestas: ["Ser ambiguo", "Hablar muy rápido", "No considerar al oyente", "Desorganización"], correcta: 0 },
  { id: 23, pregunta: "Característica de un mal receptor:", respuestas: ["Interrumpir", "Estar distraído", "Juzgar antes de tiempo", "Falta de atención"], correcta: 0 },
  { id: 24, pregunta: "¿Cómo superar la barrera del idioma?", respuestas: ["Usar intérpretes", "Lenguaje sencillo", "Apoyos visuales", "Traductor"], correcta: 2 },
  { id: 25, pregunta: "Técnica del 'Sándwich' en feedback:", respuestas: ["Elogio - Crítica - Elogio", "Positivo - Corrección - Positivo", "Empatía - Ajuste - Motivación", "Suavizar el impacto"], correcta: 0 },
  { id: 26, pregunta: "¿Qué es la comunicación descendente?", respuestas: ["De jefes a empleados", "Instrucciones de mando", "Políticas corporativas", "Anuncios oficiales"], correcta: 0 },
  { id: 27, pregunta: "¿Qué es la comunicación ascendente?", respuestas: ["De empleados a jefes", "Reportes de avance", "Sugerencias y quejas", "Feedback al líder"], correcta: 0 },
  { id: 28, pregunta: "¿Qué es la comunicación horizontal?", respuestas: ["Entre compañeros del mismo nivel", "Trabajo en equipo", "Coordinación entre áreas", "Diálogo de pares"], correcta: 0 },
  { id: 29, pregunta: "Error común en reuniones:", respuestas: ["Falta de orden del día", "Hablar al mismo tiempo", "Extenderse del tiempo", "No definir acuerdos"], correcta: 0 },
  { id: 30, pregunta: "¿Qué hacer si alguien se pone a la defensiva?", respuestas: ["Bajar el tono", "Demostrar empatía", "Validar su emoción", "Hacer una pausa"], correcta: 0 },
  { id: 31, pregunta: "Principal problema de la comunicación pasiva:", respuestas: ["No expresar necesidades", "Aceptar todo por miedo", "Guardar silencio", "Falta de límites"], correcta: 0 },
  { id: 32, pregunta: "Principal problema de la comunicación agresiva:", respuestas: ["Imponer ideas", "Falta de respeto", "Generar rechazo", "Atacar a la persona"], correcta: 0 },
  { id: 33, pregunta: "Ventaja de la comunicación escrita:", respuestas: ["Queda registro", "Permite revisar antes de enviar", "Estructura clara", "Mayor precisión"], correcta: 0 },
  { id: 34, pregunta: "Desventaja de la comunicación escrita:", respuestas: ["No transmite emoción fácilmente", "Lenta respuesta", "Posible malentendido", "Falta de calidez"], correcta: 0 },
  { id: 35, pregunta: "Regla de oro de la escucha:", respuestas: ["Escuchar para entender, no para responder", "Atención plena", "Silencio mental", "Enfoque total"], correcta: 0 },
  { id: 36, pregunta: "¿Qué es el sesgo de negatividad?", respuestas: ["Darle más peso a lo malo", "Malinterpretar intenciones", "Esperar lo peor", "Prejuicios defensivos"], correcta: 0 },
  { id: 37, pregunta: "¿Qué facilita la resolución de conflictos?", respuestas: ["Atacar el problema, no a la persona", "Buscar soluciones mutuas", "Negociar", "Diálogo abierto"], correcta: 0 },
  { id: 38, pregunta: "Un filtro mental es:", respuestas: ["Experiencias previas", "Creencias personales", "Cultura", "Expectativas"], correcta: 0 },
  { id: 39, pregunta: "Señal de escucha atenta:", respuestas: ["Asentir con la cabeza", "Tomar notas", "Mantener postura abierta", "Contacto visual"], correcta: 0 },
  { id: 40, pregunta: "Paso inicial ante un malentendido:", respuestas: ["Preguntar y aclarar", "No asumir", "Verificar la información", "Hablar directamente"], correcta: 0 }
];

function obtenerPreguntasAleatorias(cantidad = 10) {
  const copia = [...bancoPreguntas];
  copia.sort(() => Math.random() - 0.5);
  return copia.slice(0, cantidad);
}

let preguntasSeleccionadas = [];
let indicePregunta = 0;
let score1 = 0;
let score2 = 0;
let turnoActual = null;

function iniciarPartida() {
  preguntasSeleccionadas = obtenerPreguntasAleatorias(10);
  indicePregunta = 0;
  score1 = 0;
  score2 = 0;
  turnoActual = null;
}

iniciarPartida();

io.on('connection', (socket) => {
  socket.emit('updateModerador', {
    pregunta: preguntasSeleccionadas[indicePregunta],
    preguntaNumero: indicePregunta + 1,
    totalPreguntas: 10,
    score1,
    score2,
    turno: turnoActual
  });

  socket.emit('updateJugador', {
    preguntaNumero: indicePregunta + 1,
    totalPreguntas: 10,
    opciones: preguntasSeleccionadas[indicePregunta] ? preguntasSeleccionadas[indicePregunta].respuestas : [],
    turno: turnoActual,
    miEquipo: socket.data.team
  });

  socket.on('selectTeam', (team) => {
    socket.data.team = team;
    socket.emit('teamAssigned', team);
  });

  socket.on('pedirTurno', () => {
    if (!turnoActual && socket.data.team) {
      turnoActual = socket.data.team;
      io.emit('turnoAsignado', turnoActual);
    }
  });

  socket.on('enviarRespuesta', (opcionIndice) => {
    if (socket.data.team === turnoActual) {
      const preguntaActual = preguntasSeleccionadas[indicePregunta];
      const esCorrecta = opcionIndice === preguntaActual.correcta;

      if (esCorrecta) {
        if (socket.data.team === 'Equipo 1') score1 += 10;
        if (socket.data.team === 'Equipo 2') score2 += 10;
      }

      io.emit('resultadoRespuesta', {
        equipo: socket.data.team,
        esCorrecta,
        respuestaCorrecta: preguntaActual.respuestas[preguntaActual.correcta],
        score1,
        score2
      });

      turnoActual = null;
    }
  });

  socket.on('siguientePregunta', () => {
    if (indicePregunta < preguntasSeleccionadas.length - 1) {
      indicePregunta++;
      turnoActual = null;
      
      io.emit('updateModerador', {
        pregunta: preguntasSeleccionadas[indicePregunta],
        preguntaNumero: indicePregunta + 1,
        totalPreguntas: 10,
        score1,
        score2,
        turno: null
      });

      io.emit('updateJugador', {
        preguntaNumero: indicePregunta + 1,
        totalPreguntas: 10,
        opciones: preguntasSeleccionadas[indicePregunta].respuestas,
        turno: null
      });
    } else {
      io.emit('finJuego', { score1, score2 });
    }
  });

  socket.on('reiniciarJuego', () => {
    iniciarPartida();
    io.emit('juegoReiniciado');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🌐 Servidor activo en http://localhost:${PORT}`);
  console.log(`📱 Vista Jugador en http://localhost:${PORT}/jugador`);
});