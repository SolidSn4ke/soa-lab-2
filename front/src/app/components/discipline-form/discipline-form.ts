import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Modal } from '../modal/modal';
import { Discipline } from '../../interfaces/Discipline';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DisciplineService } from '../../services/discipline.service';

@Component({
  imports: [Modal, ReactiveFormsModule],
  selector: 'app-discipline-form',
  styleUrl: './discipline-form.scss',
  templateUrl: './discipline-form.html',
})
export class DisciplineForm implements OnChanges {
  @Input() public discipline: Discipline | null = null;

  @Output() public saved = new EventEmitter<void>();
  @Output() public closed = new EventEmitter<void>();

  public isSaving: boolean = false;
  public errorMessage: string | null = null;
  public form: FormGroup;

  public constructor(private formBuilder: FormBuilder, private disciplineService: DisciplineService) {
    this.form = this.formBuilder.nonNullable.group({
      name: ['', [Validators.required]],
      labsCount: [0, [Validators.required]],
    });
  }


  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['discipline']) {
      this.form.reset({
        name: this.discipline?.name ?? '',
        labsCount: this.discipline?.labsCount ?? 0,
      });
    }
  }

  public get isEditMode(): boolean {
    return this.discipline !== null;
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
      ? this.disciplineService.updateDiscipline(this.discipline!.name, data)
      : this.disciplineService.createDiscipline(data);

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
