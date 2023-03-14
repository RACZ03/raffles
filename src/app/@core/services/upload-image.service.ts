import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  public uploadPercent:  Observable<number|undefined> = new Observable<number>();
  urlImage!: Observable<string>;

  constructor(
    private storage: AngularFireStorage
  ) {

  }



  validateFile(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
    let allowedExtensions = /(\.png)$/i;
    if (!allowedExtensions.exec(file.name)) {
      reject('Invalid format, only .png images are allowed');
    }
    // else if(file.size > 4000000) {
    //   reject('Tamaño maximo permitido es de 4 megabits');
    // }
    else{
      resolve(true);
    }
    });
  }

  // type: 1 = staff, 2 = patient
  onUpload(path: string, file: any): Promise<any> {
    let id = Math.random().toString(36).substring(2);
    const filePath = `${path}/${ id }`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges() || new BehaviorSubject(0);
    return new Promise((resolve, reject) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe( async (url) => {
            resolve(url);
          });
        })
      ).subscribe();
    });
  }

  delete(downloadUrl: string) {
    return this.storage.storage.refFromURL(downloadUrl).delete()
                .catch((error) => {
                  console.log('File does not exist');
                });
  }

}
