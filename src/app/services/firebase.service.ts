import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private IP = ''
  constructor(
    private fireStore: AngularFirestore,
    private http: HttpClient
  ) {}
  get IPAddress() {
    return this.IP
  }
  fetchIP() {
    return this.http.get("http://api.ipify.org/?format=json")
  }

  createNewGame() {
    return new Promise((resolve, reject) => {
      this.fetchIP()
        .subscribe({
          next: (res:any) => {
            this.IP = res.ip
            this.fireStore.collection('games')
              .add({player1: this.IP})
              .then(doc => {
                resolve(doc.id)
              })
              .catch(error => {
                reject(error)
              })
          },
          error: (e) => {
            reject(e)
        }
        })
    })
  }

  checkGameId(id: string){
    return this.fireStore.collection('games').doc(id).get()
  }

  updateGameState(fen: string, id: string) {
    return this.fireStore.collection('games').doc(id).update({game: fen})
  }

  syncGameState(id: string) {
    return this.fireStore.collection('games').doc(id).snapshotChanges()
  }

  addPlayer2(id: string) {
    return new Promise(((resolve, reject) => {
      this.fetchIP().subscribe({
        next: (res: any) => {
          this.fireStore.collection('games').doc(id).update({player2: res.ip})
            .then(res => {
              resolve(res)
            })
            .catch(error => reject(error))
        },
        error: e => reject(e)
      })
    }))
  }
}
