import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL para web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** OBTER heróis do servidor */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('heróis buscasdos')),
        catchError(this.handleError<Hero[]>('obter heróis', []))
      );
  }

  /** GET herói por id. Retorna `indefinido` quando o id não é encontrado */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // retorna uma matriz de elementos {0|1}
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /** GET herói por id. Será 404 se o id não for encontrado */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /* GET heróis cujo nome contém o termo de pesquisa */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // se não for o termo de pesquisa, retorna um array de heróis vazio.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`encontrei heróis correspondentes "${term}"`) :
        this.log(`nenhum herói correspondente "${term}"`)),
      catchError(this.handleError<Hero[]>('pesquisar heróis', []))
    );
  }

  //////// Salvar Metodos //////////

  /** POST: adiciona um novo herói ao servidor */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: exclui o herói do servidor */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /** PUT: atualiza o herói no servidor */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /**
   * Lidar com operação HTTP que falhou.
   * Deixe o aplicativo continuar.
   *
   * @param operation - nome da operação que falhou
   * @param result - valor opcional para retornar como resultado observável
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: envie o erro para a infraestrutura de log remoto
      console.error(error); // logar no console em vez disso

      // TODO: melhor trabalho de transformação de erros para consumo do usuário
      this.log(`${operation} failed: ${error.message}`);

      // Deixe o aplicativo continuar em execução retornando um resultado vazio.
      return of(result as T);
    };
  }

    //Registra uma mensagem HeroService com o MessageService
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
