import {
  Component,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  AfterViewInit,
  EventEmitter,
  Output,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {  MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NavItem } from '../../../models/shared/navItem.model';
import { NavService } from 'src/app/services/shared/nav.service';
import { faBars,faUser,faArrowRight,faSignOut } from '@fortawesome/free-solid-svg-icons';


import { AuthService } from 'src/app/services/shared/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('drawer')
  appDrawer!: ElementRef;
  @Output() cierreSesion = new EventEmitter();
  navItems: NavItem[] = [];
  nombre:string;
  email:string;
  photo:string;
  userSubs : Subscription;
  apellido: string;
  public identity:any;
  isIdentity = false;
  //icons
  faBars = faBars;
  faUser = faUser;
  faSignOut = faSignOut;
  faArrowRight = faArrowRight;
  dataUser:any;


  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  showSubmenu: boolean = false;
  showSubmenuEjemplos: boolean = false;
  panelOpenState = false;


  constructor(
    private breakpointObserver: BreakpointObserver,
    private navService: NavService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public router:Router,
    public dialog: MatDialog,
    public authService: AuthService
  ) {


    this.matIconRegistry.addSvgIcon(
      'user',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/svg/user.svg'),
    );

   }

  ngOnInit(): void {
    this.dataUser = this.authService.getDataUser();

  }

  ngAfterViewInit(){

  }


  ngOnDestroy(){
    // if(this.userSubs){
    //   this.userSubs.unsubscribe();
    // }

  }

  logUp(){
    this.authService.SignOut();
  }

}
