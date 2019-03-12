import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameStructureRoutingModule } from './game-structure-routing.module';
import { MainStructureComponent } from './main-structure/main-structure.component';
import { TgsLoadingService } from './tgs-loading.service';

@NgModule({
  declarations: [
    MainStructureComponent
  ],
  imports: [
    CommonModule,
    GameStructureRoutingModule
  ],
  providers: [
    TgsLoadingService
  ]
})
export class GameStructureModule { }
