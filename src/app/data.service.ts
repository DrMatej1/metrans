// data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {Todo} from "./material-table/material-table.component";

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // Subject to store and share the data with subscribers
  private dataSource = new BehaviorSubject<Todo[]>([]);
  // Observable to allow components to subscribe to changes in the data
  data$ = this.dataSource.asObservable();

  // Set the initial data in the service
  setData(todos: Todo[]): void {
    this.dataSource.next(todos);
  }

  // Update the data in the service based on the provided Todo
  updateData(updatedTodo: Todo): void {
    const currentData = this.dataSource.getValue();

    // Check if the Todo with the same ID already exists in the data
    const existingIndex = currentData.findIndex((todo) => todo.id === updatedTodo.id);

    if (existingIndex !== -1) {
      // If the ID already exists, update the existing row
      currentData[existingIndex] = updatedTodo;
    } else {
      // If the ID doesn't exist, add a new row
      currentData.push(updatedTodo);
    }

    // Notify subscribers about the change in the data
    this.dataSource.next([...currentData]);
  }

  // Delete a Todo with the specified ID from the data
  deleteTodo(id: number): void {
    const currentData = this.dataSource.getValue();
    // Filter out the Todo with the specified ID
    const updatedData = currentData.filter((todo) => todo.id !== id);
    // Notify subscribers about the change in the data
    this.dataSource.next(updatedData);
  }
}
