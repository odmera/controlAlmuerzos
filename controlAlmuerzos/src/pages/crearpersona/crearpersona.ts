import {Component} from '@angular/core';
import {Camera} from 'ionic-native';
import {NavController,AlertController,LoadingController,ToastController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2';
import { UUID } from 'angular2-uuid';
import { Persona } from '../modelos/persona';

@Component({
  selector: 'page-crearpersona',
  templateUrl: 'crearpersona.html'
})
export class Crearpersona {

  formularioPersona : FormGroup;

  cameraData: string;
  fotoCargada: boolean;
  cameraUrl: string;
  fotoSelect: boolean;
  imagenPordefecto : boolean = true;
  nav: NavController;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public database: AngularFireDatabase,
              public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {
     this.nav=navCtrl;

     this.fotoCargada = false;

     this.formularioPersona = this.formBuilder.group({
       txtNombre: ['', Validators.required],
       txtApellido: ['', Validators.required],
       txtTelefono: [''],
       txtCorreo: ['', Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')],
    });
     

  }


  guardar(): void  {
    let loader = this.loadingCtrl.create({
      content: 'Grabando registro...',
    });

    loader.present().then(() => {
      this.guardarPersona();
      loader.dismiss();
      this.mostrarToast();
    });
  }


 
  guardarPersona() : void {

     let pers =  new Persona();
     pers.id =  UUID.UUID();
     pers.nombre = this.formularioPersona.value.txtNombre;
     pers.apellido =  this.formularioPersona.value.txtApellido;
     pers.telefono = this.formularioPersona.value.txtTelefono;
     pers.correo =  this.formularioPersona.value.txtCorreo;
     pers.usuario=  firebase.auth().currentUser.email;
     pers.habilitado = true;


     var personaFirebaseRef = firebase.database().ref("persona");  
     var idpersona =personaFirebaseRef.push(pers).key;


     if(this.cameraData != null || this.cameraUrl != null){

        var refernciaArchivo = firebase.storage().ref('fotosPersonas/' + 'foto' + new Date().getTime());

        var uploadTask;
        if(this.cameraData != null){
          uploadTask = refernciaArchivo.putString(this.cameraData, 'base64', {contentType: 'image/jpeg'});
        }
        else if(this.cameraUrl != null){
          uploadTask = refernciaArchivo.putString(this.cameraUrl,'base64', {contentType: 'image/jpeg'});
        }

        uploadTask.on('state_changed', function(snapshot){
   
        }, function(error) {
          alert("erorr " + error);
        }, function() {
       
          var downloadURL = uploadTask.snapshot.downloadURL;

          //se estable la url de la foto a la persona (se hace update a firebase)
          pers.foto = downloadURL;
          var personaFirebaseRefActuali = firebase.database().ref("persona/" + idpersona);  
          personaFirebaseRefActuali.update(pers);
        });

     }

   }

 
 selectFromGallery(): void {
   var options = {
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      //destinationType: Camera.DestinationType.FILE_URI,
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 250,
      targetHeight: 250,
      quality : 100, //Calidad
      allowEdit : true //Permitir editar
    };
    Camera.getPicture(options).then((imageData) => {
      this.cameraUrl = imageData;
      this.fotoSelect = true;
      this.fotoCargada = false;
      this.imagenPordefecto=false;
    }, (err) => {
     alert("erorr " + err);
    });
  }

  openCamera(): void {
    var options = {
      sourceType: Camera.PictureSourceType.CAMERA,
      destinationType: Camera.DestinationType.DATA_URL,
      quality : 75,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 250,
      targetHeight: 250,
      saveToPhotoAlbum: false
    };
    Camera.getPicture(options).then((imageData) => {
       this.cameraData = imageData;
      this.fotoCargada = true;
      this.fotoSelect = false;
      this.imagenPordefecto=false;
    }, (err) => {
      alert("erorr " + err);
    });
  }

  mostrarAlerta() : void{
  let alert = this.alertCtrl.create({
    title: 'Persona',
    subTitle: 'Persona grabada',
    buttons: ['Ok']
  });
  alert.present();
}

 mostrarToast(): void {
    let toast = this.toastCtrl.create({
      message: 'Se guardado el registro con exito.',
      duration: 4000
    });
    toast.present();

  }


}
