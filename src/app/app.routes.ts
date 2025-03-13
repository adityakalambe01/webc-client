import { Routes } from '@angular/router';
import { CandidateComponent } from './candidate/candidate.component';
import { InterviwerComponent } from './interviwer/interviwer.component';

export const routes: Routes = [
    {
        path: 'candi',
        component: CandidateComponent
    },
    {
      path: 'inti',
      component:InterviwerComponent
    }
];
