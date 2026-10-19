import { Component, OnInit, inject, signal } from '@angular/core';
import { Tarea, TareasService } from './tareas.service';

@Component({
  selector: 'app-root',
  template: `
    <main>
      <h1>Tareas</h1>
      <p class="subtitulo">Angular (Nginx) → Express → MySQL, con Docker Compose</p>

      <form (submit)="$event.preventDefault(); agregar(campo)">
        <input #campo placeholder="Nueva tarea" aria-label="Título de la nueva tarea" />
        <button type="submit">Agregar</button>
      </form>

      @if (error()) {
        <p class="error">{{ error() }}</p>
      }

      <ul>
        @for (tarea of tareas(); track tarea.id) {
          <li [class.hecha]="tarea.completada">
            <span>{{ tarea.titulo }}</span>
            <button (click)="eliminar(tarea.id)" aria-label="Eliminar tarea">✕</button>
          </li>
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
    li { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #ddd; }
    li.hecha span { text-decoration: line-through; color: #777; }
    .error { color: #b00020; }
  `,
})
export class App implements OnInit {
  private readonly servicio = inject(TareasService);
  protected readonly tareas = signal<Tarea[]>([]);
  protected readonly error = signal('');

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.servicio.listar().subscribe({
      next: (tareas) => {
        this.tareas.set(tareas);
        this.error.set('');
      },
      error: () => this.error.set('No se pudo conectar con la API. ¿Está levantado el backend?'),
    });
  }

  agregar(campo: HTMLInputElement) {
    const titulo = campo.value.trim();
    if (!titulo) return;
    this.servicio.crear(titulo).subscribe({
      next: () => {
        campo.value = '';
        this.cargar();
      },
      error: () => this.error.set('No se pudo guardar la tarea.'),
    });
  }

  eliminar(id: number) {
    this.servicio.eliminar(id).subscribe(() => this.cargar());
  }
}
