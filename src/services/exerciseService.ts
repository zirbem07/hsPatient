import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { VaultID } from '../app/vaultIDs';
import { Exercise } from '../models/exercise';


@Injectable()
export class ExerciseService {
   
    
    exercises: Exercise[] = [];
    constructor(public http: Http){ }

    getAssignedExercises(token: string, accountType: string, userID: string): Promise<any> {
       
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(token + ':')
        })
        const url = 'https://api.truevault.com/v1/vaults/' + VaultID[accountType].AssignedExerciseVault + '/search'
        var queryParams = JSON.stringify({
            "filter": {
                "PatientID": {
                    "type": "eq",
                    "value": userID
                },
                "Deleted": {
                    "type": "eq",
                    "value": false
                }
            },
            "filter_type": 'and',
            "full_document": true,
            "schema_id": VaultID[accountType].AssignedExerciseSchema
        });

        return this.http
            .post(url, this.formatData({search_option: btoa(queryParams)}), {headers: headers})
            .toPromise()
            .then(res => {
                for (let item of res.json().data.documents) {
                    var exercise = JSON.parse(atob(item.document));
                    exercise.document_id = item.document_id;
                    this.exercises.push(exercise); 
                }
            });
    }

    getBlobImg(token: string, accountType: string, blobID: string): Promise<any>{
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(token + ':')
        })
        const url = 'https://api.truevault.com/v1/vaults/' + VaultID[accountType].PatientImg + '/blobs/'+ blobID;

        return this.http
            .get(url, {headers: headers})
            .toPromise();
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