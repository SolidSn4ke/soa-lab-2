import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Modal } from '../modal/modal';
import { Labwork } from '../../interfaces/Labwork';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LabworkService } from '../../services/labwork.service';
import { DisciplineService } from '../../services/discipline.service';
import { Discipline } from '../../interfaces/Discipline';

@Component({
  imports: [Modal, ReactiveFormsModule],
  selector: 'app-labwork-form',
  styleUrl: './labwork-form.scss',
  templateUrl: './labwork-form.html',
})
export class LabworkForm implements OnChanges, OnInit {
  @Input() public labwork: Labwork | null = null;

  @Output() public saved = new EventEmitter<void>();
  @Output() public closed = new EventEmitter<void>();

  public isSaving: boolean = false;
  public errorMessage: string | null = null;
  public form: FormGroup;
  public disciplines: Discipline[] = [];

  public constructor(private formBuilder: FormBuilder, private labworkService: LabworkService, private disciplineService: DisciplineService) {
    this.form = this.formBuilder.nonNullable.group({
      name: ['', [Validators.required]],
      coordinates: this.formBuilder.group({
        x: [0, [Validators.required]],
        y: [0, [Validators.required]],
      }),
      minimalPoint: [0, [Validators.required]],
      averagePoint: [0, [Validators.required]],
      difficulty: ['EASY', [Validators.required]],
      disciplineId: ['', [Validators.required]],
    });
  }

  public ngOnInit() {
    this.disciplineService.getDisciplines().subscribe({
      next: (disciplines) => {
        this.disciplines = disciplines;
      },
      error: (error) => {
        console.error('Failed to load disciplines', error);
      }
    });
  }


  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['labwork']) {
      this.form.reset({
        name: this.labwork?.name ?? ''
      })
    }
  }

  public get isEditMode(): boolean {
    return this.labwork !== null;
  }

  public close(): void {
    if (!this.isSaving) {
      this.closed.emit();
    }
  }

  public onSubmit(): void {
    if (this.form.invalid || this.isSaving) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    const data = this.form.getRawValue();

    const request = this.isEditMode
      ? this.labworkService.updateLabwork(this.labwork!.id, data)
      : this.labworkService.createLabwork(data);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.saved.emit();
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Failed'
      }
    })
  }
}
