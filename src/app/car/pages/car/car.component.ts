import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CarsService} from "../../../search-car/services/cars.service";
import {Car} from "../../../search-car/model/car";
import {Location} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {RentDialogComponent} from "../../../search-car/pages/rent-dialog/rent-dialog.component";
import {MyFavouritesService} from "../../../my-favourites/services/my-favourites.service";
import {CarModelsService} from "../../../search-car/services/car-models.service";
import {CarBrandsService} from "../../../search-car/services/car-brands.service";
import {MyFavourites} from "../../../my-favourites/model/my-favourites";

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  carId!: string;
  carData!: Car;
  clientId!: string | null;
  days: number = 1;
  isFavourite: boolean;

  /*isFavourite = false;*/
  favourite: MyFavourites = {
    id: 0,
    clientId: 0,
    carId: 0,
    localStorageIndex: -1
  };

  constructor(
    private route: ActivatedRoute,
    private carService: CarsService,
    private location: Location,
    public rentDialog: MatDialog,
    private favouriteService: MyFavouritesService,
    private carModelsService: CarModelsService,
    private carBrandsService: CarBrandsService,
  ) {
    this.carId = this.route.snapshot.params.carId;
    this.clientId = localStorage.getItem('clientId');
    this.carData = {} as Car;
    this.isFavourite = false;
  }

  ngOnInit(): void {
    this.getCar();
    this.getFavourites();
  }

  getCar(): void {
    this.carService.getById(this.carId).subscribe((response: any) => {
      this.carData = response;
    });
  }

  getFavourites() {
    let value = localStorage.getItem('clientInfo');
    let client = typeof value === "string" ? JSON.parse(value) : "";

    for(let i = 0; i < client.favourites.length; i++){
      if(client.favourites[i].car.id == this.carId){
        this.isFavourite = true;
        this.favourite = {
          clientId: client.clientId,
          carId: client.favourites[i].car.id,
          id: client.favourites[i].id,
          localStorageIndex: i
        };
      }
    }
  }

  getPrice(): number {
    return this.days * this.carData.rentAmountDay;
  }

  goBack(): void {
    this.location.back();
  }

  openRentDialog(): void {
    this.rentDialog.open(RentDialogComponent, {
      width: '300px',
      data: {
        car: this.carData,
        clientId: this.clientId
      }
    });
  }

  addFavourite() {
    this.favourite.carId = Number(this.carId);
    this.favourite.clientId = Number(this.clientId);

    const newFav = {clientId:Number(this.clientId), carId:Number(this.carId)}

    this.favouriteService.create(Number(this.clientId)-4, Number(this.carId), newFav).subscribe((response: any) => {
      this.isFavourite = true;
      this.favourite = response;

      // Agregar el item al localStorage
      let value = localStorage.getItem('clientInfo');
      let client = typeof value === "string" ? JSON.parse(value) : "";

      client.favourites.push(this.favourite);
      localStorage.setItem("clientInfo", JSON.stringify(client));
    })
  }

  deleteFavourite(id: string) {
    this.favouriteService.delete(id).subscribe((response: any) => {
      this.isFavourite = false;

      // Eliminar el item del localStorage
      let value = localStorage.getItem('clientInfo');
      let client = typeof value === "string" ? JSON.parse(value) : "";
      let newFav = [];

      for(let i = 0; i < client.favourites.length; i++) {
        if (client.favourites[i].car.id != this.carId)
          newFav.push(client.favourites[i])
      }

      client.favourites = newFav;
      localStorage.setItem("clientInfo", JSON.stringify(client));

    })
  }

  actionFavourite(id: number) {
    if (this.isFavourite) {
      this.deleteFavourite(id.toString());
    }
    else {
      this.addFavourite();
    }
  }

}
