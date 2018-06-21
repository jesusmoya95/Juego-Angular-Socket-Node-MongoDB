import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ServicioService {

  private url = environment.url;
  private socket;

  public usuarios: any;
  public usuarios_sala = [];
  public mensajes_chat = [];
  public datos_juego = [{mostrar_partida: false, img_correcta:true}];
  public control_fin_juego = false;
  public score_aciertos = {};
  public score_errores = {};

  constructor() { 
    this.usuarios = [];
    this.socket = io(this.url);
    // Recive la lista de usuarios
    this.socket.on('usuarios', (usuarioslist) => {
      this.mensajes_chat.push({usuario: 'Sistema', imagen:"sistema.png", texto: ('Usuarios conectados: ' + usuarioslist)});
      for (var i = 0; i < usuarioslist.length; i++){
        this.usuarios.push(usuarioslist[i].name);
      }
      console.log('Lista usuarios conectados: ' + this.usuarios);
    })

    // Recive el usuario nuevo
    this.socket.on("nuevo_usuario", (user) =>{
      this.mensajes_chat.push({usuario: 'Sistema', imagen:"sistema.png", texto: ('Se ha unido: ' + user.name)});
      console.log('Este es el nuevo usuario: ' + user.name);
      
    })

    // Recibe usuarios conectados a la misma sala
    //this.socket.on('conexion_sala', function(user){
    //  this.usuarios_sala.push(user);
    //})

    // Recive mensaje chat
    this.socket.on('mensaje_chat',(mensaje) =>{
      this.mensajes_chat.push({usuario: mensaje.usuario, imagen:mensaje.imagen, texto: mensaje.texto});
    })

    // recive los datos del juego
    this.socket.on('datos_juego', (datos) =>{
      if (datos.pregunta != undefined){
        this.datos_juego = [datos];
      }
      else{
        this.datos_juego = [{mostrar_partida: false, img_correcta:true}];
      }
      
      console.log(this.datos_juego[0]);
    })

    // Recive control de fin de juego
    this.socket.on('control_fin', dato =>{
      this.control_fin_juego = true;
      console.log('Control de fin de juego')
    })

    // Recive la puntuación de aciertos de del servidor
    this.socket.on('score_aciertos', dato =>{
      this.score_aciertos = dato;
      console.log('Score aciertos' + dato);
      console.log(dato);
    })

    // Recive la puntuación de fallos del servidor
    this.socket.on('score_fallos', dato =>{
      this.score_errores = dato;
      console.log('Score fallos' + dato);
      console.log(dato);
    })

  }

    

  crear(sala){
    this.socket.emit('nueva_sala', sala)
  }

  unirse(sala){
    this.socket.emit('unirse', sala)
  }

  entrar(nick_name, avatar){
    let user = {name:nick_name, imagen:avatar}
    this.socket.emit('nuevo_usuario', user);
  }
  
  enviar_mensaje(user, avatar, text){
    let mensaje = {usuario:user, imagen:avatar, texto:text};
    this.socket.emit('mensaje_chat', mensaje);
  }


  empezar_partida(){
    this.socket.emit('empezar_partida', 'nada');
  }

  siguiente(){
    this.socket.emit('siguiente', 'nada');
    console.log(this.datos_juego[0])
  }


  imagen_seleccionada(user, img){
    let partida = {usuario: user, imagen: img};
    this.socket.emit('seleccion',partida);
  }


  fin(){
    this.socket.emit('fin_juego', 'nada');
  }

  
}
