import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor/editor.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import './tgs';
import 'codemirror/addon/hint/show-hint';
import './anyword-hint';
import { GameStructureModule } from '../game-structure/game-structure.module';
import { SequencesManagerComponent } from './sequences-manager/sequences-manager.component';
import { GraphViewComponent } from './graph-view/graph-view.component';
import { GraphViewBlockComponent } from './graph-view-block/graph-view-block.component';

@NgModule({
  declarations: [
    EditorComponent,
    SequencesManagerComponent,
    GraphViewComponent,
    GraphViewBlockComponent
  ],
  imports: [
    CommonModule,
    EditorRoutingModule,
    BrowserModule,
    CodemirrorModule,
    FormsModule,
    GameStructureModule
  ]
})
export class EditorModule { }
