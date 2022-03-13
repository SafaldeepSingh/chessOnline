import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {FirebaseService} from "../services/firebase.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DialogJoinGameComponent} from "../dialog-join-game/dialog-join-game.component";
import firebase from "firebase/compat";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(
    private firebase: FirebaseService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  createNewGame() {
    this.firebase.createNewGame()
      .then( code => {
        this.router.navigate(['game/'+code])
      })
      .catch(e => console.error(e))
  }

  joinGame() {
    const dialogRef = this.dialog.open(DialogJoinGameComponent, {width: '250px'});
    dialogRef.afterClosed().subscribe(code => {
    })
  }
}
