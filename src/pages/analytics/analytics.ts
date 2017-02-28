import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { SessionService } from '../../services/sessionService';
import 'datejs';
// import { FusionChartsComponent } from 'angular2-fusioncharts';


@Component({
  selector: 'page-analytics',
  templateUrl: 'analytics.html',
})
export class AnalyticsPage { 
  
  DateJs: IDateJSStatic = <any>Date;
  datasource: any;
  today: string;
  pain: [any] = [0,0,0,0,0,0,0]
  compliance: [any] = [0,0,0,0,0,0,0]
  totalComplete: number;
  totalAssigned: number;
  complianceScore: number;
  
  constructor(public navCtrl: NavController, private session: SessionService) {
     
      this.today = this.DateJs.today().toString('M-dd-yyyy');
      this.readLog()
      this.datasource = JSON.stringify({
            "chart": {
                "caption": "Compliance and Pain",
                "subCaption": "For last week",
                "xAxisname": "Day",
                "pYAxisName": "Compliance %",
                "sYAxisName": "Pain Ratng (10 worst pain)",
                "numberSuffix": "%",
                // "sNumberSuffix" : "%",
                "sYAxisMaxValue" : "10",
                "pYAxisMaxValue" : "100",

                //Cosmetics
                "paletteColors" : "#03A9F4,#f2c500,#1aaf5d",
                "baseFontColor" : "#333333",
                "baseFont" : "Helvetica Neue,Arial",
                "captionFontSize" : "14",
                "subcaptionFontSize" : "14",
                "subcaptionFontBold" : "0",
                "showBorder" : "0",
                "bgColor" : "#ffffff",
                "showShadow" : "0",
                "canvasBgColor" : "#ffffff",
                "canvasBorderAlpha" : "0",
                "divlineAlpha" : "100",
                "divlineColor" : "#999999",
                "divlineThickness" : "1",
                "divLineIsDashed" : "1",
                "divLineDashLen" : "1",
                "divLineGapLen" : "1",
                "usePlotGradientColor" : "0",
                "showplotborder" : "0",
                "showXAxisLine" : "1",
                "xAxisLineThickness" : "1",
                "xAxisLineColor" : "#999999",
                "showAlternateHGridColor" : "0",
                "showAlternateVGridColor" : "0",
                "legendBgAlpha" : "0",
                "legendBorderAlpha" : "0",
                "legendShadow" : "0",
                "legendItemFontSize" : "10",
                "legendItemFontColor" : "#666666"
            },
            "categories": [{
                "category": [
                    { "label": "Mon" }, 
                    { "label": "Tues" }, 
                    { "label": "Wed" }, 
                    { "label": "Thur" }, 
                    { "label": "Fri" }, 
                    { "label": "Sat" }, 
                    { "label": "Sun" }
                ]
            }
                          ],
            "dataset": [
                {
                    "seriesName": "Compliance %",
                    "data": this.compliance
                }, 
                // {
                //     "seriesName": "Feeling",
                //     "renderAs": "area",
                //     "showValues": "0",
                //     "data": [
                //         { "value" : "40" },
                //         { "value" : "50" },
                //         { "value" : "30" },
                //         { "value" : "40" },
                //         { "value" : "10" },
                //         { "value" : "70" },
                //         { "value" : "10" }
                //     ]
                // }, 
                {
                    "seriesName": "Pain",
                    "parentYAxis": "S",
                    "renderAs": "line",
                    "showValues": "0",
                    "data": this.pain
                }
            ]
      })
  }

  readLog() {
    let i = 0;
    this.totalAssigned = 0;
    this.totalComplete = 0;
    for(i = 0; i < 7; i++){
        this.pain[i] = {"value": this.session.patient.patientLog[this.DateJs.today().addDays(-i).toString('M-dd-yyyy')].pain || "5"};
        var complete = this.session.patient.patientLog[this.DateJs.today().addDays(-i).toString('M-dd-yyyy')].completed;
        this.totalComplete += complete;
        var assigned = this.session.patient.patientLog[this.DateJs.today().addDays(-i).toString('M-dd-yyyy')].assigned;
        this.totalAssigned += assigned;
        this.compliance[i] = {"value": complete / assigned * 100}
    }
    this.complianceScore = Math.floor(this.totalComplete / this.totalAssigned * 100);
  }

}