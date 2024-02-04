// material-table.component.ts
import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {EditDialogComponent} from '../edit-dialog/edit-dialog.component';
import {DataService} from "../data.service";

// Interface defining the structure of a Todo item
export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
// Table component
@Component({
  selector: 'app-material-table',
  templateUrl: './material-table.component.html'
})
export class MaterialTableComponent {
  // Component variables for sorting, columns, data and action
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['id', 'userId', 'title', 'completed', 'actions'];
  dataSource = new MatTableDataSource<Todo>([]);
  action: 'edit' | 'add' = 'edit';

  // User roles mapping for displaying user roles based on userId
  userRoles: { [userId: number]: string } = {
    1: 'Admin',
    2: 'Tester',
  };

  /**
   * Constructor for MaterialTableComponent.
   * @param http HttpClient for making HTTP requests.
   * @param dialog Reference to the MatDialog for controlling the dialog.
   * @param dataService Service for managing shared data.
   */
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private dataService: DataService) {
  }

// Open the edit dialog for a specific Todo item
  openEditDialog(todo: Todo): void {
    this.action = 'edit';
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {...todo, action:this.action},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Updated record:', result);
      }
    });
  }

  // Open the add dialog with pre-filled data
  openAddDialog(): void {
    // Find the last ID and increase by 1
    this.action = 'add';
    const lastId = this.dataSource.data.length > 0 ? Math.max(...this.dataSource.data.map(todo => todo.id)) + 1 : 1;

    // Open the dialog with pre-filled data
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { id: lastId , action: this.action},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Updated record:', result);
      }
    });
  }

// Component initialization
  ngOnInit(): void {
    this.subscribeToDataChanges();
    this.fetchTodos();
  }

  // Subscribe to changes in shared data using the data service
  subscribeToDataChanges(): void {
    this.dataService.data$.subscribe((data) => {
      // Update your local dataset when the shared data changes
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
    });
  }

  // Fetch initial Todo data from the server
  fetchTodos(): void {
    this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos').subscribe(
      (todos) => {
        // Update the service with initial data
        this.dataService.setData(todos);
      },
      (error) => {
        console.error('Error fetching todos:', error);
      }
    );
  }

// Get the user role based on userId
  getUserRole(userId: number): string {
    return this.userRoles[userId] || 'Unknown User';
  }

  // Handle the delete button click for a specific Todo item
  onDelete(id: number): void {
    const url = `https://jsonplaceholder.typicode.com/todos/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Make the delete request
    this.http.delete(url, {headers}).subscribe(
      () => {
        console.log(`Delete request successful for ID: ${id}`);
        this.dataService.deleteTodo(id);
        // You may want to update your local data or perform other actions after successful deletion
      },
      (error) => {
        console.error(`Error deleting todo with ID ${id}:`, error);
        // Handle errors if needed
      }
    );
  }
}
