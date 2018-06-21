import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ServicioService } from './servicio.service';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CuerpoComponent } from './cuerpo/cuerpo.component';
import { ImagenesComponent } from './imagenes/imagenes.component';


import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './chat/chat.component'; // <-- NgModel lives here




const appRoutes: Routes = [
  { path: '', component: CuerpoComponent },
  { path: 'imagenes', component: ImagenesComponent },
  { path: '*', component: CuerpoComponent }
]





@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CuerpoComponent,
    ImagenesComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot( 
      appRoutes,
      { enableTracing: true }),
    FormsModule
  ],
  providers: [ServicioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
