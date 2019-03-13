import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainStructureComponent } from './main-structure/main-structure.component';
import { DebugViewComponent } from './debug-view/debug-view.component';

const routes: Routes = [
  {
    path: "structure/:id",
    component: MainStructureComponent
  },
  {
    path: "debug/:id",
    component: DebugViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameStructureRoutingModule { }
