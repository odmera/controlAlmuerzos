import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the MovimientosPersona page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-movimientos-persona',
  templateUrl: 'movimientos-persona.html'
})
export class MovimientosPersonaPage {

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams) {

  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MovimientosPersonaPage');
  }

}
