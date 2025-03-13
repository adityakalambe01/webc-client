import { Component } from '@angular/core';
import { RemoteComponent } from '../remote/remote.component';


@Component({
  selector: 'app-candidate',
  imports: [RemoteComponent],
  templateUrl: './candidate.component.html',
  styleUrl: './candidate.component.css'
})
export class CandidateComponent {

}
