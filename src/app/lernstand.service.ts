import {Injectable} from '@angular/core';
import {Thema, Kategorie} from './thema';

@Injectable({providedIn: 'root'})
export class LernstandService {
  url = 'http://localhost:8001';

  async getKategorien(): Promise<Kategorie[]> {
    const antwort = await fetch(`${this.url}/kategorien`);
    return (await antwort.json()) ?? [];
  }

  async getThemen(): Promise<Thema[]> {
    const antwort = await fetch(`${this.url}/themen`);
    return (await antwort.json()) ?? [];
  }
}