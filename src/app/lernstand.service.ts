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

  async themaAnlegen(neu: {titel: string; kategorie_id: number; notiz: string | null}): Promise<Thema> {
    const antwort = await fetch(`${this.url}/themen`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(neu),
    });
    if (!antwort.ok) {
      const fehler = await antwort.json();
      throw new Error(fehler.detail ?? `HTTP ${antwort.status}`);
    }
    return antwort.json();
  }

  async themaAendern(
    id: number,
    aenderung: {status?: string; titel?: string; notiz?: string | null},
  ): Promise<Thema> {
    const antwort = await fetch(`${this.url}/themen/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(aenderung),
    });
    if (!antwort.ok) {
      const fehler = await antwort.json();
      throw new Error(fehler.detail ?? `HTTP ${antwort.status}`);
    }
    return antwort.json();
  }

  async themaLoeschen(id: number): Promise<void> {
    const antwort = await fetch(`${this.url}/themen/${id}`, {
      method: 'DELETE',
    });
    if (!antwort.ok) {
      const fehler = await antwort.json();
      throw new Error(fehler.detail ?? `HTTP ${antwort.status}`);
    }
  }

  async getThemenNachStatus(status: string): Promise<Thema[]> {
    const antwort = await fetch(`${this.url}/themen?status=${status}`);
    return (await antwort.json()) ?? [];
  }
}