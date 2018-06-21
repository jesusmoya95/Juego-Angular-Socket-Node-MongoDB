import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../servicio.service';
import { environment } from '../../environments/environment';
import { OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-imagenes',
  templateUrl: './imagenes.component.html',
  styleUrls: ['./imagenes.component.css']
})
export class ImagenesComponent implements OnInit, OnDestroy {

  constructor(public servicio: ServicioService  ) { }
  


  ngOnDestroy(){
    this.nick_name_dato = '';
    this.nick_name_error  = '';
    this.sesion_iniciada = false;
    this.sala_dato  = '';
    this.sala_unirse_dato  = '';
    this.mostrar_usuario  = false;
    this.mostrar_sesion= true;
    this.mostrar_sala = false;
    this.mostrar_empezar = false;
    this.mensaje  = '';
    this.usuarios = this.servicio.usuarios
    this.mensaje_chat = this.servicio.mensajes_chat;
    this.datos_juego = this.servicio.datos_juego;
    this.seleccion = true;
    this.preguntaaa = true;
    this.acierto = false;
    this.respuesta = '';
    this.boton_siguiente = false;
    this.persona = false;
    this.jefe = false;
    this.contador_pregungas = 1;
    this.boton_fin = false;
    this.imagen = environment.imagen;

  }


  ngOnInit( ) {

    this.nick_name_dato = '';
    this.nick_name_error  = '';
    this.sesion_iniciada = false;
    this.sala_dato  = '';
    this.sala_unirse_dato  = '';
    this.mostrar_usuario  = false;
    this.mostrar_sesion= true;
    this.mostrar_sala = false;
    this.mostrar_empezar = false;
    this.mensaje  = '';
    this.usuarios = this.servicio.usuarios
    this.mensaje_chat = this.servicio.mensajes_chat;
    this.datos_juego = this.servicio.datos_juego;
    this.seleccion = true;
    this.preguntaaa = true;
    this.acierto = false;
    this.respuesta = '';
    this.boton_siguiente = false;
    this.persona = false;
    this.jefe = false;
    this.contador_pregungas = 1;
    this.boton_fin = false;
    this.imagen = environment.imagen;
    this.servicio.datos_juego[0].mostrar_partida = false;
  }

  /* VARIABLES*/
  nick_name_dato: string = '';
  nick_name_error: string = '';
  sesion_iniciada = false;
  sala_dato: string = '';
  sala_unirse_dato: string = '';
  mostrar_usuario: boolean = false;
  mostrar_sesion: boolean = true;
  mostrar_sala: boolean = false;
  mostrar_empezar: boolean = false;
  mensaje: string = '';
  usuarios = this.servicio.usuarios
  mensaje_chat = this.servicio.mensajes_chat;
  datos_juego = this.servicio.datos_juego;
  seleccion = true;
  preguntaaa = true;
  acierto = false;
  respuesta = '';
  boton_siguiente = false;
  persona = false;
  jefe = false;
  contador_pregungas = 1;
  boton_fin = false;
  imagen = environment.imagen;
  avatar_seleccionado = "avatar1.png";

  /*METODOS*/

  select_avatar(avatar){
    this.avatar_seleccionado = avatar;
  }

  entrar(){
    if (this.nick_name_dato != ''){
      this.servicio.entrar(this.nick_name_dato, this.avatar_seleccionado);
      this.mostrar_usuario = true;
      this.mostrar_sesion = false;
      this.mostrar_sala = true;
      this.mostrar_empezar = false;
      this.sesion_iniciada = true;
      this.persona = true;
    }
    else{
      this.nick_name_error = 'Nombre no válido'
    }
  }

  crear(){
    //this.servicio.crear(this.sala_dato);
    this.mostrar_usuario = true;
    this.mostrar_sesion = false;
    //this.mostrar_sala = false;
    this.mostrar_empezar = true;
    this.jefe = true;
    this.persona = false;
  }

  unirse(){
    //this.servicio.unirse(this.sala_unirse_dato)
    this.mostrar_usuario = true;
    this.mostrar_sesion = false;
    //this.mostrar_sala = false;
    this.mostrar_empezar = false;
    this.persona = false;
  }

  enviar_mensaje(){
    if (this.sesion_iniciada && this.mensaje != ""){
      console.log(this.mensaje);
      this.servicio.enviar_mensaje(this.nick_name_dato, this.avatar_seleccionado, this.mensaje);
      this.mensaje = '';
    }
  }

  empezar(){
    if (this.sesion_iniciada){
      this.servicio.empezar_partida();
      console.log(this.servicio.datos_juego)
      this.mostrar_empezar = false;
      this.seleccion = true;
    }
  }

  siguiente(){
    if (this.contador_pregungas < 7){
      this.servicio.siguiente();
      console.log(this.servicio.datos_juego);
      this.preguntaaa = true;
      this.boton_siguiente = false;
      this.contador_pregungas++;
    }
    else{
      this.boton_siguiente = false;
      this.boton_fin = true;
    }
    
  }

  imagen_selec_a(){
    if (this.seleccion){
      this.servicio.imagen_seleccionada(this.nick_name_dato, 'a');
      this.seleccion = false;
      this.es_correcto('a');
      this.preguntaaa = false;
    } 
    
  }
  imagen_selec_b(){
    if (this.seleccion){
      this.servicio.imagen_seleccionada(this.nick_name_dato, 'b');
      this.seleccion = false;
      this.es_correcto('b');
      this.preguntaaa = false;
    }
    
  }
  imagen_selec_c(){
    if (this.seleccion){
      this.servicio.imagen_seleccionada(this.nick_name_dato, 'c');
      this.seleccion = false;
      this.es_correcto('c');
      this.preguntaaa = false;
    }
    
  }
  imagen_selec_d(){
    if (this.seleccion){
      this.servicio.imagen_seleccionada(this.nick_name_dato, 'd');
      this.seleccion = false;
      this.es_correcto('d');
      this.preguntaaa = false;
    }
    
  }

  es_correcto(a){
    this.preguntaaa = false;
    if (a == this.servicio.datos_juego[0].img_correcta){
      this.respuesta = 'Es correcto';
      this.acierto = true;
      
    }
    else{
      this.respuesta = 'Has fallado';
      this.acierto= true;
      
    }
  }

  ok(){
    this.acierto = false;
    this.preguntaaa = false;
    this.seleccion = true;
    if (this.jefe){
      this.boton_siguiente = true;
    }
    else{
      this.preguntaaa = true;
      this.servicio.datos_juego = [{mostrar_partida: false, img_correcta:true}];
    }
  }

  fin(){
    this.servicio.fin();
    console.log('Boton fin pulsado;')
    this.boton_fin = false;
  }
 

}
