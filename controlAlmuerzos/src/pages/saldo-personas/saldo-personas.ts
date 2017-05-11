import { Component } from '@angular/core';
import { NavController, NavParams,AlertController,LoadingController,ToastController } from 'ionic-angular';
import * as firebase from 'firebase';
import { Persona } from '../modelos/persona';
import { Saldo } from '../modelos/saldo';
import { MovimientosPersonaPage } from '../movimientos-persona/movimientos-persona';

/*
  Generated class for the SaldoPersonas page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-saldo-personas',
  templateUrl: 'saldo-personas.html'
})
export class SaldoPersonasPage {

  personaRef: any;
  pagoRef: any;

  personaList: any;
  loadedpersonaList: any;
  nav: NavController;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {

        this.nav=navCtrl;

        this.initializeItems();

        firebase.auth().onAuthStateChanged((user) => {
        console.log("The User:", user);
        });

        let fireBaseUser = firebase.auth().currentUser;
        if(fireBaseUser != null){
          console.log(fireBaseUser.email);
        }

        this.personaRef = firebase.database().ref('/persona');
        this.personaRef.orderByChild("usuario").equalTo(fireBaseUser.email).on('value', personaLista => {
     
        let listaSaldoPersona = [];

        personaLista.forEach( personaFor => {

          let obtectSaldo =  new Saldo();
          obtectSaldo.persona = personaFor.val();
          obtectSaldo.saldo = 0;

          var idpersona =personaFor.val().id;
          
          //consulto los pago por persona
          this.pagoRef = firebase.database().ref('/pago');
          this.pagoRef.orderByChild("idpersona").equalTo(idpersona).on('value', itemsPago => {

             let cobro:number = 0;
             let abono:number = 0;
             
             itemsPago.forEach( pago => {

                var tipoPago = pago.val().tipopago

                if( tipoPago =='1'){ //cobro
                  cobro = cobro + parseInt(pago.val().valor);
                }
                else if(tipoPago =='2'){ //abono
                  abono = abono + parseInt(pago.val().valor);
                }
             });

             obtectSaldo.saldo = cobro - abono;

          });
          
          listaSaldoPersona.push(obtectSaldo);

      });

      this.personaList = listaSaldoPersona;
      this.loadedpersonaList = listaSaldoPersona;
    });


  }

  initializeItems(): void {
   this.personaList = this.loadedpersonaList;
  }

  getItems(searchbar) {
  // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;


    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.personaList = this.personaList.filter((v) => {
      var busqueda = v.persona.nombre + " " + v.persona.apellido 
      if(busqueda && q) {
        if (busqueda.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }

    });

}

 verCobrosAbonosPersona(item){
   this.nav.push(MovimientosPersonaPage);
 }

     

}
