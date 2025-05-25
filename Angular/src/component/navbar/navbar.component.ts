import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [    RouterLinkActive, 
    RouterLink,
    RouterOutlet,MatToolbarModule,  // ✅ הוספנו את ה-Toolbar
        MatButtonModule,    MatIconModule    

],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
           letter:string=sessionStorage.getItem('UserName')||'';
        
}
