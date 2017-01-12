import { Component, OnInit, HostListener } from '@angular/core';

import { EventService } from '../../shared/service/event.service';
import { GameService } from '../../shared/service/game.service';


import { Event } from '../../shared/interface/event';

@Component({
  moduleId: module.id,
  selector: 'court',
  templateUrl: 'court.html'
})
export class CourtComponent implements OnInit {

  court: HTMLImageElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(
    private eventService: EventService,
    private gameService: GameService,
  ) {
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
        this.drawX(x, y);
    }
  }

  drawX(x: number, y: number) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'red';
    this.ctx.moveTo(x - 5, y - 5);
    this.ctx.lineTo(x + 5, y + 5);
    this.ctx.moveTo(x + 5, y - 5);
    this.ctx.lineTo(x - 5, y + 5);
    this.ctx.stroke();
  }
}
