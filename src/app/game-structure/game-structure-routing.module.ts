import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainStructureComponent } from './main-structure/main-structure.component';

const routes: Routes = [
  {
    path: "structure/:id",
    component: MainStructureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameStructureRoutingModule { }
