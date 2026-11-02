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

  neuForm = new FormGroup({
    titel: new FormControl('', {nonNullable: true}),
    kategorieId: new FormControl('', {nonNullable: true}),
    notiz: new FormControl('', {nonNullable: true}),
  });

  constructor() {
    this.lernstandService.getKategorien().then((kategorien) => {
      this.kategorien = kategorien;
      this.changeDetectorRef.markForCheck();
    });
    this.themenFrischLaden();
  }

  kategorieName(id: number): string {
    return this.kategorien.find((kategorie) => kategorie.id === id)?.name ?? `Unbekannte Kategorie (${id})`;
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
    }).then(() => this.themenFrischLaden());
  }

  themenFrischLaden() {
    const laden = this.statusFilter
      ? this.lernstandService.getThemenNachStatus(this.statusFilter)
      : this.lernstandService.getThemen();
        laden.then((themen) => {
      console.log('geladene Themen:', this.statusFilter, themen.length);
      this.themen = themen;
      this.changeDetectorRef.markForCheck();
    });
  }

  statusGeaendert(thema: Thema, neuerStatus: string) {
    this.lernstandService.themaAendern(thema.id, neuerStatus).then(() => {
      this.themenFrischLaden();
    });
  }

  filterAuswaehlen(status: string) {
    this.statusFilter = status;
    this.themenFrischLaden();
  }
}