import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  initialObject = {};
  initialData: Object[];
  isRequest: boolean = false;
  errors = [];
  nonValidAttributes = [];
  iterableDataKeys = [];
  url: string;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get('assets/host.json').subscribe((urlAddress: string) => this.url = urlAddress);

    this.http.get('/assets/trades.json').subscribe((data: Object) => {
      this.initialObject = data;
      this.initialData = data["test"];
      this.initialData.forEach(element => {
        let keys = this.getKeys(element);
        this.iterableDataKeys.push(keys);
      });
    });
  }



  getKeys(obj: Object): string[] {
    let keys = [];
    for (let key in obj) {
      keys.push(key)
    }
    return keys;
  }

  createAnswerArray(arr: string[][]) {
    arr.forEach(function (item, index, arr) {
      if (!item) {
        item[0] = "valid"
      } else {
        item.unshift["not valid"];
      }
    })
  }

  getResponse() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    this.http.post(this.url +'/validate', this.initialObject, httpOptions)
      .subscribe((response: Array<string[]>) => {
        response.forEach(item => {
          this.errors.push(this.getErrors(item)[0]);
          this.nonValidAttributes.push(this.getErrors(item)[1]);
        });
        this.isRequest = true;
      });
  }

  private getErrors(str: string[]): [string[], string[]] {
    let errors = [];
    let mySet = new Set<string>();
    str.forEach(item => {
      let err = item.split(";");
      errors.push(err[0]);
      for (let k = 1; k < err.length; k++) {
        mySet.add(err[k].trim());
      }
    });
    return [errors, Array.from(mySet)];
  }

  isValid(i: number, key: string): boolean {
    if (this.nonValidAttributes[i]) {
      if (this.nonValidAttributes[i].indexOf(key) > -1) {
        return true;
      }
    }
    return false;
  }
}
