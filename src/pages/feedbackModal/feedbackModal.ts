// import { Component } from '@angular/core';
// import { ViewController } from 'ionic-angular';

// @Component({
//   templateUrl: 'feedbackModal.html',
//   selector: 'FeedbackModal'
// })
// export class FeedbackModal {

//  message: string;
//  themeColor: any;
//  logoLink: any;

//  constructor(public viewCtrl: ViewController) {
//     this.logoLink = window.localStorage.getItem("logoLink") || "./assets/logo.png";
//     this.themeColor = window.localStorage.getItem("clinicID") || "primary";
//  }

//  close() {
//    this.viewCtrl.dismiss();
//  }

//  submitFeedback(message) {
//    let data = { 'message': this.message };
//    this.viewCtrl.dismiss(data);
//  }

// }

import {Component, ViewChild} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {ViewController, Content, TextInput} from 'ionic-angular';

import {ChatMessage} from "../../app/chatMessage";
import {SessionService} from '../../services/sessionService';

@Component({
  templateUrl: 'feedbackModal.html',
  selector: 'FeedbackModal',
  providers: [SessionService]

})
export class FeedbackModal {

    @ViewChild(Content) content: Content;
    @ViewChild('chat_input') messageInput: TextInput;
    msgList: ChatMessage[] = [];
    From: string;
    Timestamp: string;
    Message: string;
    editorMsg: string = '';
    patient: any;
    sentPush: boolean;
    

    constructor(public navParams: NavParams, private session: SessionService, public viewCtrl: ViewController) {

      this.patient = navParams.get('patient')
      console.log(session)
      this.getMsg();
      this.markMessagesRead();
      this.sentPush = false;

    }

    ionViewDidLoad() {
      this.scrollToBottom();
    }

    ionViewWillLeave() {

    }

    ionViewDidEnter() {
        
    }

    _focus() {
        this.content.resize();
        this.scrollToBottom();
    }

    close() {
      this.viewCtrl.dismiss();
    }

    getMsg() {
      console.log(this.session.messages);
      this.session.getMessages(this.patient.access_token, this.patient.AccountType, this.patient.user_id)
      .then(res => {
        this.msgList = this.session.messages;
        this.scrollToBottom();
      })
    }

    markMessagesRead(){
      var messageCount;
      if(this.patient.attributes.MessagesForTherapist){
        messageCount = this.patient.attributes.MessagesForTherapist;
      }
      else{
        messageCount = 0;
      }
        this.session.updateMessages(this.patient, this.patient.access_token, this.patient.AccountType, this.patient.attributes.document_id, messageCount);
    }

    sendMsg() {
      if(this.editorMsg && this.editorMsg != ""){
        const id = Date.now().toString();
        let newMsg: ChatMessage = {
            From: 'patient',
            Timestamp: new Date().toString('MMM dd hh:mm tt'),
            PatientID: 'test',
            Title: '',
            Message: this.editorMsg,
            ClinicID: '1'
        };

        this.pushNewMsg(newMsg);

        this.session.SendMessage(this.patient.access_token, this.patient.AccountType, this.editorMsg, '', this.patient.attributes.PatientID, this.patient.attributes.ClinicID, new Date().toString('MMM dd hh:mm tt'))
        //add 1 to MessagesForTherapist
        var messageCount;
        if(this.patient.attributes.MessagesForTherapist){
          messageCount = this.patient.attributes.MessagesForTherapist + 1;
        }
        else{
          messageCount = 1;
        }
        this.session.updateMessages(this.patient, this.patient.access_token, this.patient.AccountType, this.patient.attributes.document_id, messageCount);

        this.editorMsg = '';

        if(this.sentPush == false){
          this.session.SendPush(this.patient.attributes.TherapistDeviceToken);
          this.sentPush = true;
        }
      }

    }

    pushNewMsg(msg: ChatMessage) {
        console.log(msg)

        this.msgList.push(msg);


        this.scrollToBottom();
    }

    scrollToBottom() {
        setTimeout(() => {
            if (this.content.scrollToBottom) {
                this.content.scrollToBottom();
            }
        }, 400)
    }
}