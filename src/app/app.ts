import {Component, ChangeDetectorRef, inject} from '@angular/core';
import {LernstandService} from './lernstand.service';
import {Thema, Kategorie} from './thema';

@Component({
  imports: [],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  lernstandService = inject(LernstandService);
  themen: Thema[] = [];
  kategorien: Kategorie[] = [];

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
}