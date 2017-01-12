import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";
import { EVENT_OPTIONS } from '../mockData/mock-event-options';

@Pipe({
    name: "printEventType"
})
export class EventTypePipe implements PipeTransform {

    transform(eventOptionsID:any): any {
        return EVENT_OPTIONS[eventOptionsID];
    }
}