import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LabworkService } from '../../services/labwork.service';
import { Labwork } from '../../interfaces/Labwork';
import { LabworkForm } from '../../components/labwork-form/labwork-form';
import { Subject, timer, merge, switchMap, takeUntil, catchError, EMPTY, finalize } from 'rxjs';

@Component({
  imports: [LabworkForm],
  selector: 'app-labwork-details',
  styleUrl: './labwork-details.scss',
  templateUrl: './labwork-details.html',
})
export class LabworkDetails implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly refresh$ = new Subject<void>();
  private readonly pollingInterval = 10_000;

  public isLoading: WritableSignal<boolean> = signal(false);

  public labworkDetails: WritableSignal<Labwork | null> = signal(null);

  public constructor(private readonly router: Router, private readonly route: ActivatedRoute, private readonly labworkService: LabworkService) { }

  public ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      console.error('Invalid labwork ID:', id);
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

          return this.labworkService.getById(id).pipe(
            catchError((error) => {
              console.error('Error loading labwork details:', error);
              return EMPTY;
            }),
            finalize(() => this.isLoading.set(false))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (labwork) => {
          this.labworkDetails.set(labwork);
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.refresh$.complete();
  }

  public loadLabworkDetails(): void {
    this.refresh$.next();
  }


  public isFormOpen: boolean = false;

  public closeForm(): void {
    this.isFormOpen = false;
  }

  public onLabworkSaved(): void {
    this.closeForm();
    this.loadLabworkDetails();
  }

  public onEditClick(): void {
    this.isFormOpen = true;
  }

  public onDeleteClick(): void {
    const confirmed = confirm('Are you sure you want to delete this labwork? This action cannot be undone.');

    if (!confirmed) {
      return;
    }

    this.deleteLabwork();
  }

  private deleteLabwork(): void {
    const labwork = this.labworkDetails();

    if (!labwork) {
      console.error('No labwork details available to delete.');
      return;
    }

    this.labworkService.deleteLabwork(labwork.id).subscribe({
      next: () => {
        console.log('Labwork deleted successfully.');
        this.router.navigate(['/labworks']);
      },
      error: (error) => {
        console.error('Error deleting labwork:', error);
      }
    });
  }

  public onRemoveDisciplineClick(): void {
    const labwork = this.labworkDetails();

    if (labwork) {
      this.labworkService.removeDiscipline(labwork);
    }
  }
}
