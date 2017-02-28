import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { SessionService } from '../../services/sessionService';
import { LoginPage } from '../login/login'
import { PrivacyPolicy } from '../privacyPolicy/privacyPolicy'

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController, private session: SessionService) {

  }

  logout() {
    this.session.logout(this.session.patient.access_token)
      .then(data => this.navCtrl.setRoot(LoginPage))
  }

  privacyPolicy() {
    this.navCtrl.push(PrivacyPolicy);
  }

}
