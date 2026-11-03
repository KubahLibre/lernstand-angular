import {Component, ChangeDetectorRef, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {LernstandService} from './lernstand.service';
import {Thema, Kategorie} from './thema';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  lernstandService = inject(LernstandService);
  themen: Thema[] = [];
  kategorien: Kategorie[] = [];
  statusFilter = '';
  bearbeitenId: number | null = null;
  fehler: string | null = null;

  neuForm = new FormGroup({
    titel: new FormControl('', {nonNullable: true}),
    kategorieId: new FormControl('', {nonNullable: true}),
    notiz: new FormControl('', {nonNullable: true}),
  });

  aendernForm = new FormGroup({
    titel: new FormControl('', {nonNullable: true}),
    notiz: new FormControl('', {nonNullable: true}),
  });

  kategorieForm = new FormGroup({
    name: new FormControl('', {nonNullable: true}),
  });

  constructor() {
    this.lernstandService.getKategorien()
      .then((kategorien) => {
        this.kategorien = kategorien;
        this.changeDetectorRef.markForCheck();
      })
      .catch(this.fehlerUmschreiben);
    this.themenFrischLaden();
  }

  kategorieName(id: number): string {
    return this.kategorien.find((kategorie) => kategorie.id === id)?.name ?? `Unbekannte Kategorie (${id})`;
  }

  themenFrischLaden() {
    const laden = this.statusFilter
      ? this.lernstandService.getThemenNachStatus(this.statusFilter)
      : this.lernstandService.getThemen();
    laden
      .then((themen) => {
        this.themen = themen;
        this.changeDetectorRef.markForCheck();
      })
      .catch(this.fehlerUmschreiben);
  }

  anlegen() {
    const werte = this.neuForm.getRawValue();
    if (!werte.kategorieId) {
      return;
    }
    this.lernstandService.themaAnlegen({
      titel: werte.titel.trim() || 'Ohne Titel',
      kategorie_id: Number(werte.kategorieId),
      notiz: werte.notiz.trim() || null,
    })
      .then(() => {
        this.fehler = null;
        this.themenFrischLaden();
      })
      .catch(this.fehlerUmschreiben);
  }

  statusGeaendert(thema: Thema, neuerStatus: string) {
    this.lernstandService.themaAendern(thema.id, {status: neuerStatus})
      .then(() => {
        this.fehler = null;
        this.themenFrischLaden();
      })
      .catch(this.fehlerUmschreiben);
  }

  bearbeitenStarten(thema: Thema) {
    this.bearbeitenId = thema.id;
    this.aendernForm.setValue({titel: thema.titel, notiz: thema.notiz ?? ''});
  }

  bearbeitenAbbrechen() {
    this.bearbeitenId = null;
  }

  speichern(thema: Thema) {
    const werte = this.aendernForm.getRawValue();
    this.lernstandService.themaAendern(thema.id, {
      titel: werte.titel.trim() || thema.titel,
      notiz: werte.notiz.trim() || null,
    })
      .then(() => {
        this.bearbeitenId = null;
        this.fehler = null;
        this.themenFrischLaden();
      })
      .catch(this.fehlerUmschreiben);
  }

  loeschen(thema: Thema) {
    if (!window.confirm(`Thema „${thema.titel}" wirklich löschen?`)) {
      return;
    }
    this.lernstandService.themaLoeschen(thema.id)
      .then(() => {
        this.fehler = null;
        this.themenFrischLaden();
      })
      .catch(this.fehlerUmschreiben);
  }

  filterAuswaehlen(status: string) {
    this.statusFilter = status;
    this.themenFrischLaden();
  }

  kategorieNeuAnlegen() {
    const werte = this.kategorieForm.getRawValue();
    const name = werte.name.trim();
    if (!name) {
      return;
    }
    this.lernstandService.kategorieAnlegen(name)
      .then(() => {
        this.kategorieForm.patchValue({name: ''});
        this.fehler = null;
        return this.lernstandService.getKategorien();
      })
      .then((kategorien) => {
        this.kategorien = kategorien;
        this.changeDetectorRef.markForCheck();
      })
      .catch(this.fehlerUmschreiben);
  }

  kategorieLoeschen(kategorie: Kategorie) {
    const benutzt = this.themen.some((thema) => thema.kategorie_id === kategorie.id);
    const hinweis = benutzt
      ? ' Sie wird noch von Themen benutzt — der Server wird das verweigern.'
      : '';
    if (!window.confirm(`Kategorie „${kategorie.name}" löschen?${hinweis}`)) {
      return;
    }
    this.lernstandService.kategorieLoeschen(kategorie.id)
      .then(() => {
        this.fehler = null;
        return this.lernstandService.getKategorien();
      })
      .then((kategorien) => {
        this.kategorien = kategorien;
        this.changeDetectorRef.markForCheck();
      })
      .catch(this.fehlerUmschreiben);
  }

  fehlerUmschreiben = (aufruf: unknown) => {
    this.fehler = aufruf instanceof Error
      ? aufruf.message
      : `Unerwarteter Fehler: ${String(aufruf)}`;
    this.changeDetectorRef.markForCheck();
  };

  fehlerWeg() {
    this.fehler = null;
    this.changeDetectorRef.markForCheck();
  }
}