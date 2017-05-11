import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Crearpersona } from '../pages/crearpersona/crearpersona';
import { Listapersonas } from '../pages/listapersonas/listapersonas';
import { SaldoPersonasPage } from '../pages/saldo-personas/saldo-personas';
import { LoginPage } from '../pages/login/login';
import { MenuPage } from '../pages/menu/menu';
import { MovimientosPersonaPage } from '../pages/movimientos-persona/movimientos-persona';
import { FormularioDinamicoPage } from '../pages/formulario-dinamico/formulario-dinamico';

import { AngularFireModule } from 'angularfire2';

//config firebasea
export const firebaseConfig = {
   apiKey: "AIzaSyB5hPK5GKuhtn8fhG_nkaoqTFMqJAgNZUg",
    authDomain: "controlalmuerzos.firebaseapp.com",
    databaseURL: "https://controlalmuerzos.firebaseio.com",
    storageBucket: "controlalmuerzos.appspot.com",
    messagingSenderId: "149741330330"
};

@NgModule({
  declarations: [
    MyApp,
    Crearpersona,
    Listapersonas,
    SaldoPersonasPage,
    MovimientosPersonaPage,
    FormularioDinamicoPage,
    LoginPage,
    MenuPage
  ],
  
  imports: [

  //configuracion de toda la app 
   IonicModule.forRoot(MyApp) ,


  /* IonicModule.forRoot(MyApp, {
      backButtonText: 'Volver atras',
      backButtonIcon:'md-arrow-back',
      iconMode: 'md',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      pageTransition: 'md-transition',
      menuType:'push'
    }),*/

    AngularFireModule.initializeApp(firebaseConfig)
  ],





  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Crearpersona,
    Listapersonas,
    SaldoPersonasPage,
    MovimientosPersonaPage,
    FormularioDinamicoPage,
    LoginPage,
    MenuPage
  ],
  providers: [
     {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
