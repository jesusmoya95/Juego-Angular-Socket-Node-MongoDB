var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


/* Para enviar el archivo index.html al cliente*/
app.get('/', function(req, res){
  res.sendFile(__dirname +'/public');  
});

app.use(express.static('public'));


var preguntas = [
  {
    mostrar_partida: true,
    pregunta: '1- Elige la imagen que continua la serie', 
    img_pregunta: 'pregunta_1_img_pregunta.png', 
    img_a: 'pregunta_1_img_a.png', 
    img_b: 'pregunta_1_img_b.png', 
    img_c: 'pregunta_1_img_c.png', 
    img_d: 'pregunta_1_img_d.png', 
    img_correcta: 'c'
  },{
    mostrar_partida: true,
    pregunta: '2- Elige la imagen que completa la imagen', 
    img_pregunta: 'pregunta_2_img_pregunta.png', 
    img_a: 'pregunta_2_img_a.png', 
    img_b: 'pregunta_2_img_b.png', 
    img_c: 'pregunta_2_img_c.png', 
    img_d: 'pregunta_2_img_d.png',
    img_correcta: 'b'
  },{
    mostrar_partida: true,
    pregunta: '3- Elige la imagen que continua la serie',
    img_pregunta: 'pregunta_3_img_pregunta.png', 
    img_a: 'pregunta_3_img_a.png', 
    img_b: 'pregunta_3_img_b.png', 
    img_c: 'pregunta_3_img_c.png', 
    img_d: 'pregunta_3_img_d.png',
    img_correcta: 'b'
  },{
    mostrar_partida: true,
    pregunta: '4- Elige la imagen que continua la serie', 
    img_pregunta: 'pregunta_4_img_pregunta.png',
    img_a: 'pregunta_4_img_a.png', 
    img_b: 'pregunta_4_img_b.png', 
    img_c: 'pregunta_4_img_c.png', 
    img_d: 'pregunta_4_img_d.png',
    img_correcta: 'a'
  },{
    mostrar_partida: true,
    pregunta: '5- Elige la imagen que es igual a la imagen de muestra', 
    img_pregunta: 'pregunta_5_img_pregunta.png', 
    img_a: 'pregunta_5_img_a.png', 
    img_b: 'pregunta_5_img_b.png', 
    img_c: 'pregunta_5_img_c.png', 
    img_d: 'pregunta_5_img_d.png',
    img_correcta: 'd'
  },{
    mostrar_partida: true,
    pregunta: '6- Elige la imagen que encaja en la imagen de mnuestra', 
    img_pregunta: 'pregunta_6_img_pregunta.png',
    img_a: 'pregunta_6_img_a.png', 
    img_b: 'pregunta_6_img_b.png', 
    img_c: 'pregunta_6_img_c.png', 
    img_d: 'pregunta_6_img_d.png',
    img_correcta: 'b'
  },{
    mostrar_partida: true,
    pregunta: '7- Elige la imagen que continua la serie', 
    img_pregunta: 'pregunta_7_img_pregunta.png', 
    img_a: 'pregunta_7_img_a.png', 
    img_b: 'pregunta_7_img_b.png',
    img_c: 'pregunta_7_img_c.png', 
    img_d: 'pregunta_7_img_d.png',
    img_correcta: 'c'
  }
]



var usuarios = [];
var pregunta = 0;
var aciertos = {};
var errores = {};


/*Conexiones*/
io.on('connection', function(socket){
    console.log('Se ha conectado un usuario');
  

    /*Recive el nick del usuario que se ha conectado*/
    socket.on("nuevo_usuario", function(user){
      socket.usuario = user.name;
      // Añade el nuevo usuario a la lista usuarios
      usuarios.push(user.name);

      console.log("nuevo usuario registrado: " + usuarios);

      // Envia al cliente nuevo la lista de usuarios
      socket.emit('usuarios', usuarios);

      // Envía a los demás clientes el cliente nuevo
      socket.broadcast.emit("nuevo_usuario", user);

      // Recive el nombre de la nueva sala
      socket.on('nueva_sala', function(sala){
        socket.join(sala);
        console.log('Se ha creado una nueva sala: ' + sala)
      })

      // Se conecta a una sala
      socket.on('unirse', function(sala){
        socket.join(sala);
        console.log('Se ha unido a la sala: ' + sala);
        socket.to(sala).emit('conexion_sala', user);
      })
      
      // Recive menaje de chat y lo envía
      socket.on('mensaje_chat', function(mensaje){
        io.emit('mensaje_chat', mensaje);
      })
      
      // Recive mensaje de empezar partida y envía la primera pregunta
      socket.on('empezar_partida', function(nada){
        pregunta = 0;
        io.emit('datos_juego', preguntas[pregunta]);
        pregunta++;
      })
      
      // Recive enviar siguiente pregunta yenvia la siguiente pregunta
      socket.on('siguiente', function(nada){
        if (pregunta < 7){
          console.log('Se han enviado datos al cliente');
          io.emit('datos_juego', preguntas[pregunta]);
          pregunta++;
          console.log('contador pregunta: ' + pregunta);
        }
      })

      socket.emit('siguiente_pregunta', function(){
        io.emit('siguiente_pregunta', preguntas[pregunta])
      })
        
      // Recive mensaje para apuntar la respuesta de cada jugador en cada pregunta
      socket.on('seleccion', function(partida){
        if (partida.imagen == preguntas[pregunta-1].img_correcta){
          let user = partida.usuario;
          if (aciertos[user] != undefined){
            aciertos[user] += 1;
            console.log('El usuario: ' + partida.usuario + ' ha acertado');
            console.log(aciertos)
          }
          else{
            aciertos[user] = 1
            console.log('El usuario: ' + partida.usuario + ' ha acertado la primera vez');
            console.log(aciertos);
          }
          
        }
        else{
          let user = partida.usuario;
          if (errores[user] != undefined){
            errores[user] += 1;
            console.log('El usuario: ' + partida.usuario + ' ha fallado');
          }
          else{
            errores[user] = 1
            console.log('El usuario: ' + partida.usuario + ' ha fallado la primera vez');
          }
        }
      })

      // recive que ha finalizado el juego y avisa a los cliente
      // envía la puntiación a los clientes.
      socket.on('fin_juego', function(nada){
        io.emit('control_fin', 'nada');
        io.emit('score_aciertos', aciertos);
        io.emit('score_fallos', errores);
        console.log(aciertos);
        console.log(errores);
        
      })

      

    })
  

  
  
    socket.on('disconnect', function(){
      console.log(usuarios);
      usuarios = usuarios.filter(usuario => usuario != socket.usuario);
      
      console.log('Se ha desconectado un usuario: ', socket.usuario);

    });
  });
  
  
  puerto =  process.env.PORT || 3000;
  /*Puerto por el que se conecta al servidor*/
  http.listen(puerto, function(){
    console.log('listening on *:'+puerto);
  });     