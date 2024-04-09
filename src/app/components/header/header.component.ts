import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { createPopper } from "@popperjs/core";

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit { //extends AuthorizationViewHelper

  logo: string = "assets/img/logoekan-494x125.png"
  @Input() user: any;
  @Input() company: any;
  
  constructor (
  ) { }

  ngAfterViewInit(): void { 
    console.log("OPSSS ")
    this.company = JSON.parse(localStorage.getItem('company') || '{}')
    this.user = JSON.parse(localStorage.getItem('user') || '{}')
    console.log("AQUIJNSJN " + this.company)

    //this.user = "Pedro Sousa Filho"
    //this.company = "ConsuQualy"
   } 

}

/*
export const faHome: IconDefinition;
export const faHomeAlt: IconDefinition;
export const faHomeLgAlt: IconDefinition;*/