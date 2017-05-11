import {Component} from '@angular/core';
import {LoadingController,ToastController,NavController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2';
import { MenuPage } from '../menu/menu';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  menu = MenuPage
  nav: NavController;


  formularioLogin : FormGroup;

   constructor(public database: AngularFireDatabase,
              public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public navCtrl: NavController) {

     this.formularioLogin = this.formBuilder.group({
       txtCorreo: ['odmera77@hotmail.com', Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])],  
       txtClave: ['12345678', Validators.compose([Validators.required])],
    });

    this.nav=navCtrl;

  }

  iniciarSesion() : void{

    let loader = this.loadingCtrl.create();
    loader.present();
   
     firebase.auth().signInWithEmailAndPassword(this.formularioLogin.value.txtCorreo, 
          this.formularioLogin.value.txtClave)
    .then((success) => {
      console.log("iniciarSesion bien: " + JSON.stringify(success));
      if(loader)
      loader.dismiss();
      this.nav.setRoot(MenuPage);

    },(error)=>  {
      alert(error);
      if(loader)
      loader.dismiss();
      console.log("iniciarSesion mal: " + JSON.stringify(error));
     /*ar errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
          alert('Contraseña incorrecta.');
      }
      else if(errorCode === 'auth/email-already-in-use'){
        alert('El correo ya esta en uso');
      }
      else {
        alert(errorMessage);
      }*/

     });
    // loader.dismiss();

  }

  registrarUsuario(): void{

    let loader = this.loadingCtrl.create();
    loader.present();

    firebase.auth().createUserWithEmailAndPassword(this.formularioLogin.value.txtCorreo, 
          this.formularioLogin.value.txtClave)
    .then((success) => {
      console.log("registrarUsuario bien: " + JSON.stringify(success));
      if(loader)
      loader.dismiss();
      this.nav.setRoot(MenuPage);

     },(error) => {

      alert(error);
      if(loader)
      loader.dismiss();
      console.log("registrarUsuario mal: " + JSON.stringify(error));
     
      /*
      var errorMessage = error.message;
      var errorCode = error.code;
      if(errorCode === 'auth/wrong-password') {
          alert('Contraseña incorrecta.');
      }
      else if(errorCode === 'auth/email-already-in-use'){
        alert('El correo ya esta en uso');
      }
      else {
        alert(errorMessage);
      }*/

     });


  }



 

}
