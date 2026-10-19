import { Component, OnInit, inject, signal } from '@angular/core';
import { Tarea, TareasService } from './tareas.service';

@Component({
  selector: 'app-root',
  template: `
    <main>
      <h1>Tareas</h1>
      <p class="subtitulo">Angular + Express + MySQL con Docker</p>

      <form (submit)="$event.preventDefault(); agregar(campo)">
        <input #campo placeholder="Nueva tarea" aria-label="Nueva tarea" />
        <button type="submit">Agregar</button>
      </form>

      @if (error()) {
        <p class="error">{{ error() }}</p>
      }

      <ul>
        @for (tarea of tareas(); track tarea.id) {
          <li>{{ tarea.titulo }}</li>
        } @empty {
          <li>No hay tareas todavía.</li>
        }
      </ul>
    </main>
  `,
  styles: `
    main { max-width: 32rem; margin: 3rem auto; padding: 0 1rem; }
    .subtitulo { color: #555; }
    form { display: flex; gap: 0.5rem; margin: 1.5rem 0; }
    input { flex: 1; padding: 0.5rem; }
    ul { padding: 0; list-style: none; }
    li { padding: 0.5rem 0; border-bottom: 1px solid #ddd; }
    .error { color: #b00020; }
  `,
})
export class App implements OnInit {
  private servicio = inject(TareasService);
  protected tareas = signal<Tarea[]>([]);
  protected error = signal('');

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.servicio.listar().subscribe({
      next: (tareas) => this.tareas.set(tareas),
      error: () => this.error.set('No se pudo conectar con la API.'),
    });
  }

  agregar(campo: HTMLInputElement) {
    const titulo = campo.value.trim();
    if (!titulo) return;
    this.servicio.crear(titulo).subscribe(() => {
      campo.value = '';
      this.cargar();
    });
  }
}
