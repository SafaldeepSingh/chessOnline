import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ActivatedRoute, Router} from "@angular/router";
import {FirebaseService} from "../services/firebase.service";
import firebase from "firebase/compat";
import {NgxChessBoardView} from "ngx-chess-board";

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {
  gameId = ''
  player = 1
  bothPlayersJoined = false
  currentPlayerTurn = true
  @ViewChild('board', {static: false}) board: NgxChessBoardView | undefined;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public firebase: FirebaseService,
  ) {}

  ngOnInit(): void {
    this.checkGameId()
    this.syncGameState()
  }

  onPieceMove() {
    if(!this.board)
      return
    const fen = this.board.getFEN()
    this.firebase.updateGameState(fen, this.gameId)
      .then(result => {
        console.log(result)
      })
      .catch(error => console.error('Move not Updated', error))
  }

  private checkGameId() {
    this.route.params.subscribe((res: any) => {
      this.gameId = res.id
      if(this.gameId === '')
        this.router.navigate(['/'])
      this.firebase.checkGameId(this.gameId)
        .subscribe({
          next: (doc) =>
          {
            const data: any = doc.data()
            if(!data)
              this.router.navigate(['/'])
            if(data.player1 !== this.firebase.IPAddress){
              this.player = 2
              this.firebase.addPlayer2(this.gameId)
                .then(res => {
                  console.log(res)
                })
                .catch(e => console.error("Problem Adding Player 2", e))
            }
          },
          error: (e) => {
            console.error(e)
          }
        })

    })
  }

  private syncGameState() {
    this.firebase.syncGameState(this.gameId)
      .subscribe({
        next: snapshot => {
          const data: any = snapshot.payload.data()
          console.log(data)
          console.log('IP', this.firebase.IPAddress)
          if(data.player1 && data.player2)
            this.bothPlayersJoined = true
          if(data.game){
            this.board?.setFEN(data.game)
            this.currentPlayerTurn = (data.game.split(' ')[1]=='w' && this.player == 1) ||
              (data.game.split(' ')[1]=='b' && this.player == 2)
          }
          if(data.player1 !== this.firebase.IPAddress)
          {
            this.board?.reverse()
            this.player = 2
          }
        },
        error: e => {
          console.error('Error Syncing Game State', e)
        }
      })
  }
}
