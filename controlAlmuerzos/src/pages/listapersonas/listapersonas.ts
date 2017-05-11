import { Component } from '@angular/core';
import { NavController, NavParams,AlertController,LoadingController,ToastController,ActionSheetController } from 'ionic-angular';
import * as firebase from 'firebase';


@Component({
  selector: 'page-listapersonas',
  templateUrl: 'listapersonas.html'
})
export class Listapersonas {
  
  personaRef: any;
  personaList: any;
  loadedpersonaList: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public actionSheetCtrl: ActionSheetController) {

    this.initializeItems();

    firebase.auth().onAuthStateChanged((user) => {
    console.log("The User:", user);
    });

    let fireBaseUser = firebase.auth().currentUser;
    if(fireBaseUser != null){
      console.log(fireBaseUser.email);
    }
    

    this.personaRef = firebase.database().ref('/persona');
    this.personaRef.orderByChild("usuario").equalTo(fireBaseUser.email).on('value', personaList => {
      let countries = [];
      personaList.forEach( persona => {
        countries.push(persona.val());
      });

      this.personaList = countries;
      this.loadedpersonaList = countries;
    });

  }


  abonar(itemPer){
 
        let usuario = firebase.auth().currentUser.email;
        let prompt = this.alertCtrl.create({
            title: 'Movimientos',
            subTitle:'' +itemPer.nombre+ " " +itemPer.apellido,
            mode:'md',
            inputs: [
            {
              type: 'radio',
              label: 'Cobro',
              value: '1',
              checked: true
            },
             {
              type: 'radio',
              label: 'Abono',
              value: '2',
            }
            ],
            buttons: [
                {
                    text: 'Cancelar'
                },
                {
                    text: 'Aceptar',
                    handler: dataTipoPago => {
                       
                       var tipoPago = dataTipoPago; // 1= cobro, 2 abono

                       let alertPago = this.alertCtrl.create();
                       alertPago.setTitle('Movimiento');
                       alertPago.setSubTitle('' +itemPer.nombre+ " " +itemPer.apellido);
                       alertPago.addInput({
                          type:'number',
                          name: 'valor',
                          placeholder: 'Valor'
                        });

                        alertPago.addInput({
                          type:'date',
                          name: 'fecha',
                          placeholder: 'Fecha'
                        });

                        alertPago.addInput({
                          type:'text',
                          name: 'observacion',
                          placeholder: 'observaciones'
                          
                        });

                        alertPago.addButton('Cancelar');
                        alertPago.addButton({
                          text   : 'Guardar',
                          handler: data => {
                            
                            if(data.valor == null || data.valor == '' || 
                               data.fecha == null || data.fecha == ''|| 
                               data.observacion == null || data.observacion == '' ){
                               alert("Debe llenar todos los datos")
                               return false;
                            }
                            else{

                             var objectPago = {
                                idpersona:itemPer.id,
                                tipopago:dataTipoPago,
                                valor: data.valor,
                                fecha: data.fecha,
                                fechalong: new Date(data.fecha).getTime(),
                                observacion: data.observacion,
                                usuario:usuario
                              };
           
                              let loader = this.loadingCtrl.create({
                                content: 'Grabando registro...',
                              });

                              loader.present().then(() => {
                                var pago = firebase.database().ref("pago");  
                                pago.push(objectPago);
                                loader.dismiss();
                                this.mostrarToast();
                               });

                            }
  
                          }
                        });
                        alertPago.present();  
 
                    }
                }
            ]
        });
        prompt.present();       
    }

  eliminar(itemPer){

      let alert = this.alertCtrl.create({
      title: 'Esta seguro de eliminar?',
      message: 'Se eliminarán todos los movimientos de esta persona',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: () => {

            let loader = this.loadingCtrl.create({
                content: 'Grabando registro...',
            });

            loader.present().then(() => {

                
                var personaRefEliminar = firebase.database().ref("/persona/id/" + itemPer.id);  

                console.log(personaRefEliminar.key);
                personaRefEliminar.remove();

                loader.dismiss();
                this.mostrarToast();
    
             });

           
            //personaRefEliminar.orderByChild("idpersona").equalTo(itemPer.id).remove();
          }
        }
      ]
      });
      alert.present();
  }


  showOptions(item) {
  let actionSheet = this.actionSheetCtrl.create({
    title: 'Que desea hacer?',
    buttons: [
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: () => {
          alert(item.id);
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  actionSheet.present();
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
    var busqueda = v.nombre + " " + v.apellido 
    if(busqueda && q) {
      if (busqueda.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    }

  });

}

 mostrarToast() {
    let toast = this.toastCtrl.create({
      message: 'Se guardado el registro con exito.',
      duration: 4000
    });
    toast.present();

  }


}




