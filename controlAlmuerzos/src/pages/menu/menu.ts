import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,NavController } from 'ionic-angular';


import { Crearpersona } from '../crearpersona/crearpersona';
import { Listapersonas } from '../listapersonas/listapersonas';
import { SaldoPersonasPage } from '../saldo-personas/saldo-personas';
import { FormularioDinamicoPage } from '../formulario-dinamico/formulario-dinamico';
import { LoginPage } from '../login/login';

import * as firebase from 'firebase';




/*
  Generated class for the Menu page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  //@ViewChild(Nav) nav: Nav;

  nav: NavController;

  //rootPage = Crearpersona;

  tab1Root = Crearpersona;
  tab2Root = Listapersonas;
  tab3Root = SaldoPersonasPage;
  tab4Root = FormularioDinamicoPage

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
              public navCtrl: NavController) {
    this.nav=navCtrl;
  }

  cerrarSesion():void{

    firebase.auth().signOut()
      .then(() => {
         this.nav.push(LoginPage);
        }, function(error) {
          alert("No se cerro" + error)

        });

  }

   

}
