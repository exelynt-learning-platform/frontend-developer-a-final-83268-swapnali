import { A11yModule } from '@angular/cdk/a11y';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

/**
 * Reusable confirmation dialog (used before delete and similar actions).
 * Returns true when the user confirms, false/undefined when cancelled.
 */
@Component({
  selector: 'app-confirm-dialog',
  imports: [A11yModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title id="confirm-dialog-title">{{ data.title }}</h2>
    <mat-dialog-content>
      <p id="confirm-dialog-message">{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" cdkFocusInitial [mat-dialog-close]="false">
        {{ data.cancelLabel || 'Cancel' }}
      </button>
      <button
        mat-flat-button
        color="warn"
        type="button"
        [mat-dialog-close]="true"
        [attr.aria-label]="data.confirmLabel || 'Confirm'"
      >
        {{ data.confirmLabel || 'Delete' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    :host {
      display: block;
      max-width: 100%;
    }

    p {
      margin: 0;
      line-height: 1.5;
    }

    mat-dialog-actions {
      flex-wrap: wrap;
      gap: 8px;
    }

    mat-dialog-actions button {
      min-width: 88px;
    }
  `,
})
export class ConfirmDialog {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ConfirmDialog, boolean>);
}
