import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPageComponent} from "./main-page/main-page.component";
import {ChessBoardComponent} from "./chess-board/chess-board.component";

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'game/:id', component: ChessBoardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
