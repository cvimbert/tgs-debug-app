import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GameStructureRoutingModule } from './game-structure-routing.module';
import { MainStructureComponent } from './main-structure/main-structure.component';
import { TgsLoadingService } from './tgs-loading.service';
import { DebugViewComponent } from './debug-view/debug-view.component';
import { BlockComponent } from './block/block.component';
import { TextBlockLineComponent } from './text-block-line/text-block-line.component';
import { TgsMainService } from './tgs-main.service';
import { TagDisplayComponent } from './tag-display/tag-display.component';
import { ToolsPanelComponent } from './tools-panel/tools-panel.component';
import { VariablesInspectorComponent } from './variables-inspector/variables-inspector.component';
import { VariableItemSlotComponent } from './variable-item-slot/variable-item-slot.component';

@NgModule({
  declarations: [
    MainStructureComponent,
    DebugViewComponent,
    BlockComponent,
    TextBlockLineComponent,
    TagDisplayComponent,
    ToolsPanelComponent,
    VariablesInspectorComponent,
    VariableItemSlotComponent,
  ],
  imports: [
    CommonModule,
    GameStructureRoutingModule,
    FormsModule
  ],
  providers: [
    TgsLoadingService,
    TgsMainService
  ]
})
export class GameStructureModule { }
