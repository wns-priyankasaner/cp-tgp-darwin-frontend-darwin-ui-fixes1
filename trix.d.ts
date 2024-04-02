declare module 'trix' {
    export interface SpellcheckProvider {
      create(element: HTMLElement): void;
    }
  }
  