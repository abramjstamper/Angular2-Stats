import { Team } from '../interface/team';
import { Player } from '../interface/player';

export const TEAMS: Team[] = [
  <Team>{
    id: 0,
    name: 'Kokomo High School',
    hometown: 'Kokomo, IN',
    coachName: 'Matt Moore',
    mascot: 'Wildkats',
    displayName: 'Kokomo',
    gender: 'M',
    textColor: 'red-text',
    bgColor: 'blue darken-4',
    assistantCoach1: 'Assistant',
    assistantCoach2: 'Assistant 2',
    trainer: 'Trainer',
    athleticDirector: 'Jason Snyder',
    players: [
      <Player>{
        id: 0,
        firstName: 'Sam',
        lastName: 'Moore',
        homeNumber: 0,
        awayNumber: 0,
        isActive: true,
        heightInInches: 60,
        weightInPounds: 200
      },
      <Player>{
        id: 1,
        firstName: 'Abram',
        lastName: 'Stamper',
        homeNumber: 1,
        awayNumber: 1,
        isActive: true,
        heightInInches: 60,
        weightInPounds: 200
      },
      <Player>{
        id: 2,
        firstName: 'Lilly',
        lastName: 'Burton',
        homeNumber: 2,
        awayNumber: 2,
        isActive: true,
        heightInInches: 60,
        weightInPounds: 200
      },
      <Player>{
        id: 3,
        firstName: 'Oscar',
        lastName: 'Robertson',
        homeNumber: 3,
        awayNumber: 3,
        isActive: true,
        heightInInches: 60,
        weightInPounds: 200
      },
      <Player>{
        id: 4,
        firstName: 'Larry',
        lastName: 'Bird',
        homeNumber: 4,
        awayNumber: 4,
        isActive: true,
        heightInInches: 60,
        weightInPounds: 200
      }
    ]
  },
  <Team>{
    id: 1,
    name: 'Western High School',
    hometown: 'Kokomo, IN',
    coachName: 'Head Coach',
    mascot: 'Panthers',
    displayName: 'Western',
    gender: 'M',
    textColor: 'black-text',
    bgColor: 'white',
    assistantCoach1: 'Assistant',
    assistantCoach2: 'Assistant 2',
    trainer: 'Trainer',
    athleticDirector: 'AD',
    players: [
      <Player>{
        id: 5,
        firstName: 'Jim',
        lastName: 'Moore',
        homeNumber: 0,
        awayNumber: 0,
        isActive: true,
        heightInInches: 60,
        weightInPounds: 200
      },
      <Player>{
        id: 6,
        firstName: 'Adam',
        lastName: 'Stamper',
        homeNumber: 1,
        awayNumber: 1,
        isActive: true,
        heightInInches: 60,
        weightInPounds: 200
      },
      <Player>{
        id: 7,
        firstName: 'Courtney',
        lastName: 'Burton',
        homeNumber: 2,
        awayNumber: 2,
        isActive: true,
        heightInInches: 60,
        weightInPounds: 200
      },
      <Player>{
        id: 8,
        firstName: 'Phil',
        lastName: 'Moore',
        homeNumber: 3,
        awayNumber: 3,
        isActive: true,
        heightInInches: 60,
        weightInPounds: 200
      },
      <Player>{
        id: 9,
        firstName: 'Noah',
        lastName: 'Moore',
        homeNumber: 4,
        awayNumber: 4,
        isActive: true,
        heightInInches: 60,
        weightInPounds: 200
      }
    ]
  }
];