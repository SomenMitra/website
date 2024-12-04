// Used to store key value pairs
export class KeyValuePair<T>
{
    public key: string;
    public value: T;

    constructor(key: string, value: T) {
        this.key = key;
        this.value = value;
    }
}

// Start of Event Service code
import { Observable, of, Subject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class EventService<T>
{
    protected events: KeyValuePair<Subject<T>>[];

    constructor()
    {
        this.events = [];
    }
    
    public BroadcastEvent(key: string, value: any)
    {
        var keyValuePair = this.events.find((event) => {
            return event.key == key;
        });

        if(!keyValuePair)
        {
            this.events.push(
                new KeyValuePair<Subject<T>>(
                    key, 
                    new Subject<T>()
                )
            );
        }
        else
        {
            keyValuePair.value.next(value);
        }
    }

    public GetEvent(key: string): Observable<T>
    {
        var keyValuePair = this.events.find((sub) => {
            return sub.key == key;
        });

        if(keyValuePair)
        {
            return keyValuePair.value.asObservable();        
        }
        else
        {
            var subject = new Subject<T>();
            this.events.push(
                new KeyValuePair<Subject<T>>(
                    key, 
                    subject
                )
            );
            return subject.asObservable();
        }
    }
}