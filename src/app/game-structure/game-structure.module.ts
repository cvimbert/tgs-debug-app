import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameStructureRoutingModule } from './game-structure-routing.module';
import { MainStructureComponent } from './main-structure/main-structure.component';
import { TgsLoadingService } from './tgs-loading.service';
import { DebugViewComponent } from './debug-view/debug-view.component';
import { BlockComponent } from './block/block.component';

@NgModule({
  declarations: [
    MainStructureComponent,
    DebugViewComponent,
    BlockComponent
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
