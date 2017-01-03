import { Player } from './player';

export interface Team {
  id: number;
  name: string;
  hometown: string;
  coachName: string;
  mascot: string;
  displayName: string;
  gender: string;
  textColor: string;
  bgColor: string;
  assistantCoach1: string;
  assistantCoach2: string;
  trainer: string;
  athleticDirector: string;
  players: Player[];
}