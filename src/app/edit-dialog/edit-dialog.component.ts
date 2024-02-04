import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Todo } from "../material-table/material-table.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DataService} from "../data.service";

   // Component for the edit dialog that allows editing or adding a Todo item.

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html'
})
export class EditDialogComponent implements OnInit {

   // Variable declaration for the form and edit mode

  editForm!: FormGroup;
  isEditMode: boolean;

  /**
   * Constructor for EditDialogComponent.
   * @param dialogRef Reference to the MatDialog for controlling the dialog.
   * @param data Injected data containing the Todo and the action ('edit' or 'add').
   * @param fb FormBuilder for creating the reactive form.
   * @param dataService Service for managing shared data.
   * @param http HttpClient for making HTTP requests.
   */
  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Todo & {action: 'edit' | 'add'},
    private fb: FormBuilder,
    private dataService: DataService,
    private http: HttpClient,
  ) {
    this.isEditMode = this.data.action === 'edit';
  }


    // Initialization method to set up the form.

  ngOnInit(): void {
    this.editForm = this.fb.group({
      userId: [this.data.userId],
      id: [{value: this.data.id, disabled: true}],
      title: [this.data.title],
      completed: [this.data.completed],
    });
  }

  /**
   * Handles the cancel button click event.
   * Closes the dialog without any action.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Handles the update button click event.
   * Updates the record, sends a PUT request, and closes the dialog.
   */
  onUpdateClick(): void {
    // Create the updated Todo object
    const updatedTodo: Todo = {
      userId: this.editForm.value.userId,
      id: this.data.id, // Use the original ID
      title: this.editForm.value.title,
      completed: this.editForm.value.completed,
    };

    // Update the shared data using the service
    this.dataService.updateData(updatedTodo);

    // Make a PUT request to update the data on the server
    const url = `https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.put(url, updatedTodo, { headers }).subscribe(
      () => {
        console.log(`PUT request successful for ID: ${updatedTodo.id}`);
      },
      (error) => {
        console.error(`Error updating todo with ID ${updatedTodo.id}:`, error);
      }
    );

    // Close the dialog
    this.dialogRef.close(this.editForm.value);
  }

  /**
   * Handles the add button click event.
   * Adds a new record, sends a POST request, and closes the dialog.
   */
  onAddClick(): void {
    const newTodo: Todo = {
      userId: this.editForm.value.userId,
      id: this.editForm.value.id,
      title: this.editForm.value.title,
      completed: this.editForm.value.completed,
    };

    // Make a POST request to send the data to the server
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post<Todo>('https://jsonplaceholder.typicode.com/todos', newTodo, { headers }).subscribe(
      (addedTodo) => {
        console.log('Add request successful:', addedTodo);

        // Update the shared data using the service
        this.dataService.updateData(addedTodo);

        // Close the dialog
        this.dialogRef.close(addedTodo);
      },
      (error) => {
        console.error('Error adding new todo:', error);
      }
    );
  }
}
