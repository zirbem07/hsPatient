import {Component, ViewChild} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {ViewController, Content, TextInput} from 'ionic-angular';

import {ChatMessage} from "../../app/chatMessage";
import {SessionService} from '../../services/sessionService';

@Component({
  templateUrl: 'chat.html',
  selector: 'Chat'
})
export class Chat {

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

      this.patient = this.session.patient;
      console.log(session)
      
      this.markMessagesRead();
      this.sentPush = false;

    }

    ionViewDidLoad() {
      this.msgList = [];
      this.scrollToBottom();
    }

    ionViewWillLeave() {

    }

    ionViewDidEnter() {
        this.msgList.length = 0;
        this.session.messages.length = 0;
        if(this.msgList.length == 0){this.getMsg();}
        
    }

    _focus() {
        this.content.resize();
        this.scrollToBottom();
    }

    close() {
      this.viewCtrl.dismiss();
    }

    getMsg() {
      
      this.session.getMessages(this.patient.access_token, this.patient.AccountType, this.patient.user_id)
      .then(res => {
        this.msgList = [];
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
      this.editorMsg = this.editorMsg.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/, '');

      if(this.editorMsg && this.editorMsg != '' ){
        let newMsg: ChatMessage = {
            From: 'patient',
            Timestamp: new Date().toString('MMM dd hh:mm tt'),
            PatientID: this.patient.attributes.PatientID,
            Title: '',
            Message: this.editorMsg,
            ClinicID: this.patient.attributes.ClinicID
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
          console.log(this.session.SendPush(this.patient.attributes.TherapistDeviceToken));
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