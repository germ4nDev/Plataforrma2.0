import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements  OnInit {
    classList!: { toggle: (arg0: string) => void };

    constructor () {

    }

   ngOnInit() {

    const toggleActualPassword = document.querySelector('#toggleActualPassword');
    const actualPassword = document.querySelector('#actualPassword');
    const toggleNewPassword = document.querySelector('#toggleNewPassword');
    const newPassword = document.querySelector('#newPassword');
    const toggleRetypePassword = document.querySelector('#toggleRetypePassword');
    const retypePassword = document.querySelector('#retypePassword');

     toggleActualPassword?.addEventListener('click', () => {
       // toggle the type attribute
       const type = actualPassword?.getAttribute('type') === 'password' ? 'text' : 'password';
       actualPassword?.setAttribute('type', type);

       // toggle the icon
       this.classList.toggle('icon-eye-off');
     });

     toggleNewPassword?.addEventListener('click', () => {
        // toggle the type attribute
        const type = newPassword?.getAttribute('type') === 'password' ? 'text' : 'password';
        newPassword?.setAttribute('type', type);

        // toggle the icon
        this.classList.toggle('icon-eye-off');
      });

      toggleRetypePassword?.addEventListener('click', () => {
        // toggle the type attribute
        const type = retypePassword?.getAttribute('type') === 'password' ? 'text' : 'password';
        retypePassword?.setAttribute('type', type);

        // toggle the icon
        this.classList.toggle('icon-eye-off');
      });
   }
}
