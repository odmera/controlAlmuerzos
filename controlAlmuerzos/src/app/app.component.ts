
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,LoadingController,NavController  } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { MenuPage } from '../pages/menu/menu';
import { LoginPage } from '../pages/login/login';
import * as firebase from 'firebase';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
              public loadingCtrl: LoadingController) {
    
    firebase.initializeApp({
     apiKey: "AIzaSyB5hPK5GKuhtn8fhG_nkaoqTFMqJAgNZUg",
     authDomain: "controlalmuerzos.firebaseapp.com",
     databaseURL: "https://controlalmuerzos.firebaseio.com",
     storageBucket: "controlalmuerzos.appspot.com",
     messagingSenderId: "149741330330"
    });
    

    this.initializeApp();

  }

  listenToUserStatusUpdate(loader: any) {
    firebase.auth().onAuthStateChanged((user) => {
    if(loader)
    loader.dismiss();
    console.log("The User:", user);
    if (user) {
       this.nav.setRoot(MenuPage);
    } else {
       this.nav.setRoot(LoginPage);
    }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
    
      StatusBar.styleDefault();
      StatusBar.overlaysWebView(false); // let status bar overlay webview
      StatusBar.backgroundColorByHexString('#2E2EFE'); // set status bar to white
      //StatusBar.backgroundColorByName('black')
      Splashscreen.hide();

    let loader = this.loadingCtrl.create();
    loader.present();
    this.listenToUserStatusUpdate(loader);
    let fireBaseUser = firebase.auth().currentUser;
    console.log(fireBaseUser);
    this.rootPage = fireBaseUser ? MenuPage : LoginPage;

    });
  }

}
