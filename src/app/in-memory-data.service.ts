import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: 12, name: 'Dr. Misterio' },
      { id: 13, name: 'Homem-Aranha' },
      { id: 14, name: 'Venom' },
      { id: 15, name: 'Magneto' },
      { id: 16, name: 'BatMan' },
      { id: 17, name: 'SuperMan' },
      { id: 18, name: 'Dr Bugiganga' },
      { id: 19, name: 'Vampira' },
      { id: 20, name: 'Chama' }
    ];
    return {heroes};
  }

  // Substitui o método genId para garantir que um herói sempre tenha um id.
  //Se o array de heróis estiver vazio,
  // o método abaixo retorna o número inicial (11).
  // se o array de heróis não estiver vazio, o método abaixo retorna o maior
  // id do herói + 1.
  genId(heroes: Hero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11;
  }
}
