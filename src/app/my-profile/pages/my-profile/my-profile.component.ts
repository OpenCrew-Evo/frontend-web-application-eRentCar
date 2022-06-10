import {Component, OnInit} from '@angular/core';
import {Client} from "../../model/client";
import {Car} from "../../../search-car/model/car";
import {Language} from "../../model/language";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  client !: Client;
  clientCars !: Car[];
  clientLanguages !: Language[];
  breakpoint: number;

  constructor(public editProfile: MatDialog,
              private router: Router) {
    this.client = JSON.parse(localStorage.getItem("clientInfo") || "{}");
    this.breakpoint = (window.innerWidth <= 900) ? 1 : 2;
  }

  ngOnInit(): void { }

  handleSize(event: Event) {
    this.breakpoint = (window.innerWidth <= 900) ? 1 : 2;
  }

  getMoreInformationCarUrl(carId: number) {
    return `${this.router.url}/car/${carId}`;
  }
}
