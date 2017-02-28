import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { VaultID } from '../app/vaultIDs';
import { Patient } from '../app/patient';

@Injectable()
export class SessionService {
    private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    public patient: Patient;
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

        return this.http
            .put(url, this.formatData({document: btoa(JSON.stringify(this.patient.attributes)), schema_id: VaultID[accountType].PatientSchema}), {headers: headers})
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
                    .post('https://healthconnection.io/hcMailgun/sendPasswordResetEmail.php', 
                            this.formatData({email: email, link: 'https://healthconnection.io/hcPassword/index.html#/resetPasswordCode/' + text}),
                            {headers: headers})
                    .toPromise()
            })
    }

    private handleError(error){

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
