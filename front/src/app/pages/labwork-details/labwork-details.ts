import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LabworkService } from '../../services/labwork.service';
import { Labwork } from '../../interfaces/Labwork';

@Component({
  imports: [],
  selector: 'app-labwork-details',
  styleUrl: './labwork-details.scss',
  templateUrl: './labwork-details.html',
})
export class LabworkDetails implements OnInit {
  public labworkDetails: Labwork | null = null;

  public constructor(private readonly router: Router, private readonly route: ActivatedRoute, private readonly labworkService: LabworkService) { }

  public ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      console.error('Invalid labwork ID:', id);
      this.router.navigate(['/not-found']);
    }

    this.loadLabworkDetails(id);
  }

  public loadLabworkDetails(id: number): void {
    this.labworkService.getById(id).subscribe({
      next: (labwork) => {
        this.labworkDetails = labwork;
      },
      error: (error) => {
        console.error('Error loading labwork details:', error);
        this.router.navigate(['/not-found']);
      }
    });
  }

  public onEditClick(): void { }

  public onDeleteClick(): void {
    const confirmed = confirm('Are you sure you want to delete this labwork? This action cannot be undone.');

    if (!confirmed) {
      return;
    }

    this.deleteLabwork();
  }

  private deleteLabwork(): void {
    if (!this.labworkDetails) {
      console.error('No labwork details available to delete.');
      return;
    }

    this.labworkService.deleteLabwork(this.labworkDetails.id).subscribe({
      next: () => {
        console.log('Labwork deleted successfully.');
        this.router.navigate(['/labworks']);
      },
      error: (error) => {
        console.error('Error deleting labwork:', error);
      }
    });
  }
}
