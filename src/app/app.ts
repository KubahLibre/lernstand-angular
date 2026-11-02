import {Component, ChangeDetectorRef, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {LernstandService} from './lernstand.service';
import {Thema, Kategorie} from './thema';

@Component({
  imports: [ReactiveFormsModule],                              // neu
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  lernstandService = inject(LernstandService);
  themen: Thema[] = [];
  kategorien: Kategorie[] = [];

  neuForm = new FormGroup({                                    // neu
    titel: new FormControl('', {nonNullable: true}),
    kategorieId: new FormControl('', {nonNullable: true}),
    notiz: new FormControl('', {nonNullable: true}),
  });

  constructor() {
    this.lernstandService.getThemen().then((themen) => {
      this.themen = themen;
      this.changeDetectorRef.markForCheck();
    });
    this.lernstandService.getKategorien().then((kategorien) => {
      this.kategorien = kategorien;
      this.changeDetectorRef.markForCheck();
    });
  }

  kategorieName(id: number): string {
    return this.kategorien.find((kategorie) => kategorie.id === id)?.name ?? `Unbekannte Kategorie (${id})`;
  }

  async anlegen() {                                            // neu
    const werte = this.neuForm.getRawValue();
    if (!werte.kategorieId) {
      return;                                                  // ohne Kategorie: nichts aufgeben
    }
    await this.lernstandService.themaAnlegen({
      titel: werte.titel.trim() || 'Ohne Titel',
      kategorie_id: Number(werte.kategorieId),
      notiz: werte.notiz.trim() || null,
    });
    this.themen = await this.lernstandService.getThemen();     // Liste neu laden
    this.changeDetectorRef.markForCheck();
  }
}