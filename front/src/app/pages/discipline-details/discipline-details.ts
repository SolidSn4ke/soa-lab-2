import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Discipline } from '../../interfaces/Discipline';
import { ActivatedRoute, Router } from '@angular/router';
import { DisciplineService } from '../../services/discipline.service';
import { DisciplineForm } from '../../components/discipline-form/discipline-form';
import { Subject, timer, merge, switchMap, takeUntil, catchError, EMPTY, finalize } from 'rxjs';

@Component({
  imports: [DisciplineForm],
  selector: 'app-discipline-details',
  styleUrl: './discipline-details.scss',
  templateUrl: './discipline-details.html',
})
export class DisciplineDetails implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly refresh$ = new Subject<void>();
  private readonly pollingInterval = 10_000;

  public disciplineDetails: WritableSignal<Discipline | null> = signal(null);
  public isLoading: WritableSignal<boolean> = signal(false);

  public isMakingHardcore: WritableSignal<boolean> = signal(false);

  public constructor(private readonly router: Router, private readonly route: ActivatedRoute, private readonly disciplineService: DisciplineService) { }

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      console.error('discipline id is null');
      this.router.navigate(['/not-found']);
      return;
    }

    merge(
      timer(0, this.pollingInterval),
      this.refresh$
    )
      .pipe(
        switchMap(() => {
          this.isLoading.set(true);

          return this.disciplineService.getById(id).pipe(
            catchError((error) => {
              console.error('Error loading discipline details:', error);
              return EMPTY;
            }),
            finalize(() => this.isLoading.set(false))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (discipline) => {
          this.disciplineDetails.set(discipline);
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.refresh$.complete();
  }

  public loadDisciplineDetails(): void {
    this.refresh$.next();
  }

  public isFormOpen: boolean = false;

  public closeForm(): void {
    this.isFormOpen = false;
  }

  public onDisciplineSaved(): void {
    this.closeForm();
    this.loadDisciplineDetails();
  }

  public onEditClick(): void {
    this.isFormOpen = true;
  }

  public onDeleteClick(): void {
    const confirmed = confirm('Are you sure you want to delete this discipline? This action cannot be undone.');

    if (!confirmed) {
      return;
    }

    this.deleteDiscipline();
  }

  private deleteDiscipline(): void {
    const discipline = this.disciplineDetails();

    if (!discipline) {
      console.error('No discipline details available to delete.');
      return;
    }

    this.disciplineService.deleteDiscipline(discipline.name).subscribe({
      next: () => {
        console.log('Discipline deleted successfully.');
        this.router.navigate(['/disciplines']);
      },
      error: (error) => {
        console.error('Error deleting discipline:', error);
      }
    });
  }

  public onMakeHardcoreClick(): void {
    const discipline = this.disciplineDetails();

    if (discipline) {
      this.isMakingHardcore.set(true);

      this.disciplineService.makeHardcore(discipline.name).subscribe({
        next: () => {
          console.log('Discipline made hardcore successfully.');
          this.isMakingHardcore.set(false);
        },
        error: (error) => {
          console.error('Error making discipline hardcore:', error);
          this.isMakingHardcore.set(false);
        }
      });
    }
  }
}
