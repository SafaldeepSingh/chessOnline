import { Component, OnInit } from '@angular/core';
import {FirebaseService} from "../services/firebase.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dialog-join-game',
  templateUrl: './dialog-join-game.component.html',
  styleUrls: ['./dialog-join-game.component.css']
})
export class DialogJoinGameComponent implements OnInit {
  code: string = ''
  invalidCode = false
  constructor(
    private firebase: FirebaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  checkCode() {
    this.firebase.checkGameId(this.code).subscribe( {
      next: (doc) =>
      {
        const data: any = doc.data()
        if(!data)
          this.invalidCode = true
        else{
          this.invalidCode = false
          this.router.navigate(['game/'+this.code])
        }
      },
      error: (e) => {
        console.error(e)
      }
    })

  }
}
