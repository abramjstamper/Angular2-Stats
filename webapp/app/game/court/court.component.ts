import { Component, Input, OnInit, HostListener } from '@angular/core';

import { EventService } from '../../shared/service/event.service';
import { GameService } from '../../shared/service/game.service';
import { TimerService } from '../../shared/service/timer.service';

import { Event } from '../../shared/interface/event';
import { Point } from '../../shared/interface/point';

@Component({
  moduleId: module.id,
  selector: 'court',
  templateUrl: 'court.html'
})
export class CourtComponent implements OnInit {

  @Input() gameID: number;

  court: HTMLImageElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  shots:Point[] = [];
  eventOptionsSymbolTable: String[] = []

  constructor(
    private eventService: EventService,
    private gameService: GameService,
    private timerService: TimerService,
  ) {
    this.eventOptionsSymbolTable = this.eventService.getGameEventOptions();
  }

  ngOnInit() {
    this.court = <HTMLImageElement>document.getElementById('court');
    this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
    this.ctx = this.canvas.getContext("2d");
    this.court.onload = () => { this.ctx.drawImage(this.court, 0, 0, this.court.width, this.court.height); };
  }

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    if (e) {
      let x = e.pageX - this.canvas.offsetLeft;
      let y = e.pageY - this.canvas.offsetTop;
      if (x > 0 && x < this.canvas.width && y > 0 && y < this.canvas.height)
        this.drawMiss(x, y);
        this.shots.push(new Point(x,y));
        let newEvent: Event = new Event(this.timerService.getTimer().secondsRemaining,
          this.timerService.getPeriod(), null,
          this.eventOptionsSymbolTable.findIndex(str => str == 'field goal missed'), 
          this.gameID, null, new Point(x,y));
        this.eventService.createGameEvent(this.gameID, newEvent);
    }
  }

  drawMiss(x: number, y: number) {
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'red';
    this.ctx.moveTo(x - 5, y - 5);
    this.ctx.lineTo(x + 5, y + 5);
    this.ctx.moveTo(x + 5, y - 5);
    this.ctx.lineTo(x - 5, y + 5);
    this.ctx.stroke();
  }

  convertToMake(){
    let p:Point = this.shots.pop();
    this.eventService.convertToMake(this.gameID);
    this.ctx.beginPath();
    this.ctx.strokeStyle = "rgba(255, 153, 0, 0)";
    this.ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'orange';
    this.ctx.fill();
          this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = '#003300';
    this.ctx.stroke();
  }

  clearCourt(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.court, 0, 0, this.court.width, this.court.height);
    this.shots = [];
  }
}
