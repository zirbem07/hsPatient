import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { VaultID } from '../app/vaultIDs';
import { Patient } from '../app/patient';
import { ChatMessage } from '../app/chatMessage';


@Injectable()
export class SessionService {
    private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    public patient: Patient;
    public messages: ChatMessage[] = [];
    public lastCompleted: any;
    constructor(public http: Http){ }
    
    
    login(email: string, password: string): Promise<any> {
        return this.http
            .post('https://api.truevault.com/v1/auth/login', this.formatData({'username': email, 'password': password, 'account_id': '686fb6aa-f671-4532-94ac-29d69d0d1e5a'}), {headers: this.headers})
            .toPromise()
            .then(res => {
                this.patient = new Patient(res.json().user)
            })
            .catch(this.handleError);
    };

    logout(access_token: string): Promise<any> {
        const url = 'https://api.truevault.com/v1/auth/logout'
        const headers = new Headers({
          'Authorization': 'Basic ' + btoa(access_token + ':') 
        })
        return this.http
            .post(url, {}, {headers: headers})
            .toPromise();
    }

    verifyUser(email: String): Promise<any> {
        const url = 'https://healthconnection.io/hcPassword/php/verifyUser.php'
        return this.http
            .post(url, {email: email}, {})
            .toPromise();
    }

    getUserInfo(id: string, access_token: string): Promise<any> {
        const url = 'https://api.truevault.com/v1/users/' + id + '?full=true';
        const headers = new Headers({
            'Authorization': 'Basic ' + btoa(access_token + ':'),
            'Content-Type': 'application/x-www-form-urlencoded'
        })
        return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then(res => {
                var data = JSON.parse(atob(res.json().user.attributes));
                this.patient.TherapistID = data.TherapistID;
                this.patient.AccountType = data.AccountType;
            });
    }

    getUserAttributes(token: string, accountType: string, userID:string ): Promise<any>{
        const url = 'https://api.truevault.com/v1/vaults/' + VaultID[accountType].PatientVault + '/search'
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(token + ':')
        })
        var queryParams = JSON.stringify({
            "filter": {
              "PatientID": {
                "type": "eq",
                "value": userID
              }
            },
            "full_document": true,
            "schema_id": VaultID[accountType].PatientSchema
          });

          return this.http
            .post(url, this.formatData({search_option: btoa(queryParams)}), {headers: headers})
            .toPromise()
            .then(res => {
                console.log(res.json().data)
                var data = JSON.parse(atob(res.json().data.documents[0].document));
                data.document_id = res.json().data.documents[0].document_id;
                this.patient.attributes = data;
            });
    }
 
    getPatientLog(token: string, accountType: string, patientLogId: string): Promise<any> {

        const url = 'https://api.truevault.com/v1/vaults/'+ VaultID[accountType].PatientLogVault +'/documents/' + patientLogId;
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(token + ':')
        })
        return this.http
            .get(url, {headers: headers})
            .toPromise()
            
    }

    updatePatientLog(token: string, accountType: string, patientLogId: string): Promise<any> {

        const url = 'https://api.truevault.com/v1/vaults/'+ VaultID[accountType].PatientLogVault +'/documents/' + patientLogId;
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(token + ':')
        })


        return this.http
            .put(url, this.formatData({document: btoa(JSON.stringify(this.patient.patientLog))}), {headers: headers})
            .toPromise()
    }

    updateLastActive(token: string, accountType: string, userID: string): Promise<any> {
        const url = 'https://api.truevault.com/v1/vaults/'+ VaultID[accountType].PatientVault +'/documents/' + userID
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(token + ':')
        })

        this.patient.attributes.LastActive = Date.today().toString("yyyy-MM-dd");
        this.patient.attributes.Activated = true;

        return this.http
            .put(url, this.formatData({document: btoa(JSON.stringify(this.patient.attributes)), schema_id: VaultID[accountType].PatientSchema}), {headers: headers})
            .toPromise()
            
    }

    updateMessages(patient: Patient, token: string, accountType: string, userID: string, messagesForTherapist: number): Promise<any> {
        const url = 'https://api.truevault.com/v1/vaults/'+ VaultID[accountType].PatientVault +'/documents/' + userID
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(token + ':')
        })
        
        console.log(patient);

        patient.attributes.MessagesForPatient = 0;
        patient.attributes.MessagesForTherapist = messagesForTherapist;

        return this.http
            .put(url, this.formatData({document: btoa(JSON.stringify(patient.attributes)), schema_id: VaultID[accountType].PatientSchema}), {headers: headers})
            .toPromise()
            
    }

    saveDeviceToken(token: string, accountType: string, userID: string, deviceToken: string){
        const url = 'https://api.truevault.com/v1/vaults/'+ VaultID[accountType].PatientVault +'/documents/' + userID
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(token + ':')
        })

        this.patient.attributes.deviceToken = deviceToken
        return this.http
            .put(url, this.formatData({document: btoa(JSON.stringify(this.patient.attributes)), schema_id: VaultID[accountType].PatientSchema}), {headers: headers})
            .toPromise()
    }

    sqlDeviceTokenSave(deviceToken: string){
        this.http
            .post("https://healthconnection.io/testAPI/web/index.php/api/v1/deviceToken", {UserID: this.patient.user_id, DeviceToken: deviceToken})
            .toPromise()
            .then(data => {
                console.log(data);
            })
    }

    sqlDeviceTokenGet(): Promise<any>{
        return this.http
            .get("https://healthconnection.io/testAPI/web/index.php/api/v1/deviceToken/" + this.patient.attributes.TherapistID)
            .toPromise();
    }

    forgotPassword(email: string): Promise<any> {
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        })
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( let i=0; i < 10; i++ ) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return this.http
            .post("https://healthconnection.io/testAPI/web/index.php/api/v1/passwordReset", {Email: email, Code: text})
            .toPromise()
            .then(data => {
                this.http
                    .post('https://healthconnection.io/app/php/sendPatientResetEmail.php', 
                            {email: email, url: 'https://healthconnection.io/hcPassword/index.html#/resetPasswordCodePatient/' + text, template: 'patient-password-reset'},
                            {headers: headers})
                    .toPromise()
            })
    }

    getActivationCode(email: string): Promise<any> {
        return this.http
            .get("https://healthconnection.io/hcAPI/web/index.php/api/v1/activateAccountByEmail/" +  email)
            .toPromise()
    }

    verifyCode(code: string): Promise<any> {

        return this.http
            .get("https://healthconnection.io/hcAPI/web/index.php/api/v1/activateAccount/" + code)
            .toPromise()
    }

    checkBranding(clinicID: number) {
        this.http
            .get("https://healthconnection.io/hcAPI/web/index.php/api/v1/branding/" +  clinicID)
            .toPromise().then(brandingData => {
                brandingData = brandingData.json();
                console.log(brandingData)
                if(brandingData[0]){
                    window.localStorage.setItem("logoLink", brandingData[0].LogoLink)
                    window.localStorage.setItem("clinicID", brandingData[0].ClinicID)
                }
            })
    }

    SubmitFeedback(token: string, accountType: string, message: string, exerciseName: string, patientID: string, clinicID: number, timeStamp: string){
        console.log('feedback');
        console.log(message)
        console.log(exerciseName)
        console.log(patientID)
        console.log(clinicID)
        console.log(timeStamp)
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(token + ':')
        })
        const url = 'https://api.truevault.com/v1/vaults/' + VaultID[accountType].FeedbackVault + '/documents'
        var data = JSON.stringify({
            Seen: false,
            ExerciseName: exerciseName,
            PatientID: patientID,
            ClinicID: clinicID,
            Message: message,
            Timestamp: timeStamp
        });

        return this.http
            .post(url, this.formatData({document: btoa(data), schema_id: VaultID[accountType].FeedbackSchema}), {headers: headers})
            .toPromise()
            .then(res => {
                console.log(res)
            });
    }

    submitReview(email: string, rating: number, review: string, clinicID: number){
        this.http
            .post("https://healthconnection.io/hcAPI/web/index.php/api/v1/review", {email: email, rating: rating, review: review, clinicID: clinicID})
            .toPromise()
            .then(data => {
            
            })
    }

    setPin(userID: string, pin: string): Promise<any> {
        const url = 'https://healthconnection.io/hcPassword/php/setPasswordFromApp.php'
        return this.http
            .post(url, {userID: userID, password: pin}, {})
            .toPromise();
    }

    scheduleAptPush(time, date) {
        
        const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NDk1ZWRhZi00OGY2LTQ1NjItYTFiNi1jNTBlY2NkY2UzMTcifQ.zOgUM1zB3NAE4KWk0LnZ9UGRaaZ3tPoPZgovz_YbhLs'
            })

        var message = "Reminder: You have an appointment tomorrow at " + time;
        var tok = [this.patient.attributes.deviceToken];
        var profile = 'production_push';

        return this.http
        .post('https://api.ionic.io/push/notifications', 
            {
                "tokens": tok,
                "profile": profile, 
                "scheduled": date,
                 "notification": {
                    "message": message
                }
            },
            {headers: headers})
        .toPromise()
        
    }

    getMessages(token: string, accountType: string, userID: string): Promise<any> {
       
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(token + ':')
        })
        const url = 'https://api.truevault.com/v1/vaults/' + VaultID[accountType].MessageVault + '/search'
        var queryParams = JSON.stringify({
            "filter": {
                "PatientID": {
                    "type": "eq",
                    "value": userID
                }
            },
            "filter_type": 'and',
            "full_document": true,
            "schema_id": VaultID[accountType].MessageSchema
        });

        return this.http
            .post(url, this.formatData({search_option: btoa(queryParams)}), {headers: headers})
            .toPromise()
            .then(res => {
                for (let item of res.json().data.documents) {
                    var message = JSON.parse(atob(item.document));
                    let newMsg: ChatMessage = {
                        From: message.From,
                        Timestamp: message.Timestamp,
                        PatientID: message.PatientID,
                        Title: message.Title,
                        Message: message.Message,
                        ClinicID: message.ClinicID
                    };
                    this.messages.push(newMsg);
                }
            });
    }

    SendMessage(token: string, accountType: string, message: string, title: string, patientID: string, clinicID: number, timeStamp: string){
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(token + ':')
        })
        const url = 'https://api.truevault.com/v1/vaults/' + VaultID[accountType].MessageVault + '/documents'
        var data = JSON.stringify({
            From: 'patient',
            Title: title,
            PatientID: patientID,
            ClinicID: clinicID,
            Message: message,
            Timestamp: timeStamp
        });

        return this.http
            .post(url, this.formatData({document: btoa(data), schema_id: VaultID[accountType].MessageSchema}), {headers: headers})
            .toPromise()
            .then(res => {
                console.log(res)
            });
    }

    SendPush(deviceToken){
                //deviceToken = "dLZIiU2kykM:APA91bEFVvMfOHjaQDRn-Hghm9SGC9sqELT97oxEUGsXfJOYeYRlnaC9e1Kb2NZOtdUDBTnMZMmosaEoJl_bz0Jq2huMZqy8USWbW2cTm8z38Zq3gdTueDKC5npzCgE_7z9LB6ConnH6";
                if(deviceToken){
                    const headers = new Headers({
                            'Content-Type': 'application/json',
                            'Authorization': 'key=AAAACBgJucY:APA91bEuZIrz85fyGnvErsKYjskhrdpODX93L7v0BnOdB-bJ5R7VM7n-1h7ynTxGMtgc42EDcVq8KLgdmB1GnP_6Mo8L-A8_1QjUcOF3luNC1Ulwmc-nTWYIApT80rCiLI-hmTuV16cj'
                        })
        
                    var message = "A patient has sent you a message";
                    var tok = deviceToken;
                    var profile = 'push';
        
                    return this.http
                     .post('https://fcm.googleapis.com/fcm/send', 
                {
                    "to": tok,
                    "priority": "high", 
                    "notification": {
                        "body": "A Patient has sent you a message",
                        'title': 'New Message',
                        'icon': "myicon",
                        'sound': "mySound"
                    }
                },
                {headers: headers})
            .toPromise()
        }
    }

    recordTouchpoint(){
        this.http
            .post("https://healthconnection.io/testAPI/web/index.php/api/v1/touchpoint", {PatientID: this.patient.user_id, ClinicID: this.patient.attributes.ClinicID})
            .toPromise()
            .then(data => {

            })
    }

    private handleError(error){
        alert("Error: incorrect username or password");            
    }
    private formatData(data){
        let returnData = '';
        let count = 0;
        for (let i in data){
            if(count == 0){
                returnData += i+'='+data[i];
            }else{
                returnData += '&'+i+'='+data[i];
            }
            count = count + 1;
        }
        return returnData;
    }

    
}
