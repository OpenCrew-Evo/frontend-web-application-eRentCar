import {Component, Input, OnInit} from '@angular/core';
import {Client} from "../../model/client";
import {ClientService} from "../../services/client.service";
import {Car} from "../../../search-car/model/car";
import {Comment} from "../../model/comment";
import {CommentsService} from "../../services/comments.service";
import {Language} from "../../model/language";
import {LanguageService} from "../../services/language.service";
import {Social} from "../../model/social";
import {SocialService} from "../../services/social.service";
import {MatDialog} from "@angular/material/dialog";
import {EditProfileComponent} from "../edit-profile/edit-profile.component";
import {CarsService} from "../../../search-car/services/cars.service";
import {CarModelsService} from "../../../search-car/services/car-models.service";
import {CarBrandsService} from "../../../search-car/services/car-brands.service";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  clientUsers !: Client;
  clientId !: string | null;
  clientCars !: Car[];
  userComments !: Comment[];
  clientLanguages !: Language[];
  clientSocial !: Social[];

  constructor(private clientUsersService: ClientService,
              private commentsServices: CommentsService,
              private languagesServices: LanguageService,
              private socialService: SocialService,
              private carsService: CarsService,
              private carModelsService: CarModelsService,
              private carBrandsService: CarBrandsService,
              public editProfile: MatDialog) {
    this.clientUsers = {} as Client;
    this.clientId = localStorage.getItem('clientId');
  }

  ngOnInit(): void {
    this.getUsers();
    this.getCars();
    this.getComments();
    this.getLanguages();
    this.getSocial();
  }

  getUsers() {
    this.clientUsersService.getById(this.clientId).subscribe((response:any) => {
      this.clientUsers = response;
    })
  }
  getCars(): void {
    this.carsService.getCarsByClientId(this.clientId).subscribe((response: any) => {
      this.clientCars = response.content;

      for (let i = 0; i < this.clientCars.length; i++) {
        this.getModelName(i, this.clientCars[i].carModelId);
      }
    });
  }

  getModelName(index: number, carModelId: number): any {
    this.carModelsService.getById(carModelId).subscribe((response: any) => {
      this.clientCars[index].model = response.name;
      this.getBrandName(index, response.carBrandId);
    });
  }

  getBrandName(index: number, carBrandId: number): any {
    this.carBrandsService.getById(carBrandId).subscribe((response: any) => {
      this.clientCars[index].brand = response.name;
    });
  }
  getComments() {
    /*this.commentsServices.getCommentsByIdClient(this.currentUser).subscribe((response:any) => {
      this.userComments = response;
    })*/
  }
  getLanguages() {
    this.languagesServices.getLanguagesByIdClient(this.clientId).subscribe((response:any) => {
      this.clientLanguages = response;
    })
  }
  getSocial() {
    this.socialService.getSocialNetworksByIdClient(this.clientId).subscribe((response:any) => {
      this.clientSocial = response;
    })
  }
  editDialogClient(): void {
     this.editProfile.open(EditProfileComponent, {
       width: "500px",
       data: {
         client: this.clientUsers,
         clientId: this.clientId,
       }
     })

  }
}
