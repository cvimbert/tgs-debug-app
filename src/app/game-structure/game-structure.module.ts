import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameStructureRoutingModule } from './game-structure-routing.module';
import { MainStructureComponent } from './main-structure/main-structure.component';
import { TgsLoadingService } from './tgs-loading.service';
import { DebugViewComponent } from './debug-view/debug-view.component';
import { BlockComponent } from './block/block.component';
import { TextBlockLineComponent } from './text-block-line/text-block-line.component';
import { TgsMainService } from './tgs-main.service';
import { TagDisplayComponent } from './tag-display/tag-display.component';
import { ToolsPanelComponent } from './tools-panel/tools-panel.component';

@NgModule({
  declarations: [
    MainStructureComponent,
    DebugViewComponent,
    BlockComponent,
    TextBlockLineComponent,
    TagDisplayComponent,
    ToolsPanelComponent
  ],
  imports: [
    CommonModule,
    GameStructureRoutingModule
  ],
  providers: [
    TgsLoadingService,
    TgsMainService
  ]
})
export class GameStructureModule { }
