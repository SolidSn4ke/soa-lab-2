import { Component, signal, WritableSignal } from '@angular/core';
import { Discipline } from '../../interfaces/Discipline';
import { ActivatedRoute, Router } from '@angular/router';
import { DisciplineService } from '../../services/discipline.service';
import { DisciplineForm } from '../../components/discipline-form/discipline-form';

@Component({
  imports: [DisciplineForm],
  selector: 'app-discipline-details',
  styleUrl: './discipline-details.scss',
  templateUrl: './discipline-details.html',
})
export class DisciplineDetails {
  public disciplineDetails: WritableSignal<Discipline | null> = signal(null);

  public constructor(private readonly router: Router, private readonly route: ActivatedRoute, private readonly disciplineService: DisciplineService) { }

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('discipline id is null');
      return;
    }
    this.loadDisciplineDetails(id);
  }

  public loadDisciplineDetails(id: string): void {
    this.disciplineService.getById(id).subscribe({
      next: (discipline) => {
        this.disciplineDetails.set(discipline);
      },
      error: (error) => {
        console.error('Error loading discipline details:', error);
        this.router.navigate(['/not-found']);
      }
    });
  }


  public isFormOpen: boolean = false;

  public closeForm(): void {
    this.isFormOpen = false;
  }

  public onDisciplineSaved(): void {
    this.closeForm();
    const discipline = this.disciplineDetails();

    if (discipline) {
      this.loadDisciplineDetails(discipline.name);
    }
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
      this.disciplineService.makeHardcore(discipline.name);
    }
  }
}
