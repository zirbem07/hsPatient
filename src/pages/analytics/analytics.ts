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
    datasource: any;
  constructor(public navCtrl: NavController, private session: SessionService) {
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
                    "data": [
                        { "value" : "100" },
                        { "value" : "80" },
                        { "value" : "40" },
                        { "value" : "70" },
                        { "value" : "20" },
                        { "value" : "100" },
                        { "value" : "80" }
                    ]
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
                    "data": [
                        { "value" : "4" },
                        { "value" : "4" },
                        { "value" : "2" },
                        { "value" : "5" },
                        { "value" : "3" },
                        { "value" : "1" },
                        { "value" : "1" }
                    ]
                }
            ]
      })
  }

  ionViewDidLoad() {
    // this.renderChart();
  }

//   renderChart(){
//        var revenueChart = new chart({
//         type: 'line',
//         renderAt: 'chart-container',
//         width: '400',
//         height: '300',
//         dataFormat: 'json',
//         dataSource: {
//             "chart": {
//                 "caption": "Monthly revenue for last year",
//                 "subCaption": "Harry's SuperMart",
//                 "xAxisName": "Month",
//                 "yAxisName": "Revenues (In USD)",
//                 "numberPrefix": "$",
//                 "theme": "fint"
//             },
//             "data": [
//                 {
//                     "label": "Jan",
//                     "value": "420000"
//                 },
//                 {
//                     "label": "Feb",
//                     "value": "810000"
//                 },
//                 {
//                     "label": "Mar",
//                     "value": "720000"
//                 },
//                 {
//                     "label": "Apr",
//                     "value": "550000"
//                 },
//                 {
//                     "label": "May",
//                     "value": "910000"
//                 },
//                 {
//                     "label": "Jun",
//                     "value": "510000"
//                 },
//                 {
//                     "label": "Jul",
//                     "value": "680000"
//                 },
//                 {
//                     "label": "Aug",
//                     "value": "620000"
//                 },
//                 {
//                     "label": "Sep",
//                     "value": "610000"
//                 },
//                 {
//                     "label": "Oct",
//                     "value": "490000"
//                 },
//                 {
//                     "label": "Nov",
//                     "value": "900000"
//                 },
//                 {
//                     "label": "Dec",
//                     "value": "730000"
//                 }
//             ]

//         }
//     });

//     revenueChart.render();
//   }

}