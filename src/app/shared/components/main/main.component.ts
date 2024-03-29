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
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import { AuthService } from 'src/app/services/shared/auth.service';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';

import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('drawer')
  appDrawer!: ElementRef;
  @Output() cierreSesion = new EventEmitter();
  destroyed = new Subject<void>();
  currentScreenSize: string;

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

    // Create a map to display breakpoint names for demonstration purposes.
    displayNameMap = new Map([
      [Breakpoints.XSmall, 'XSmall'],
      [Breakpoints.Small, 'Small'],
      [Breakpoints.Medium, 'Medium'],
      [Breakpoints.Large, 'Large'],
      [Breakpoints.XLarge, 'XLarge'],
    ]);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) =>  result.matches),
      shareReplay()
    );

  showSubmenu: boolean = false;
  showSubmenuEjemplos: boolean = false;
  panelOpenState = true;

  lottielogoutOptions: AnimationOptions = {
    path: '../../../../assets/lottie/logout.json',
  };
  isContactSelected = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private navService: NavService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public router:Router,
    public dialog: MatDialog,
    public authService: AuthService,
    private _snackBarService:SnackbarService
  ) {
    breakpointObserver
    .observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ])
    .pipe(takeUntil(this.destroyed))
    .subscribe(result => {
      for (const query of Object.keys(result.breakpoints)) {
        if (result.breakpoints[query]) {
          this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
        }
      }
    });

    this.matIconRegistry.addSvgIcon(
      'user',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/svg/user.svg'),
    );

   }

  ngOnInit(): void {
    this.dataUser = this.authService.getDataUser();
    // this.isContactSelected=
    console.log('router');


  }

  ngAfterViewInit(){
    this._snackBarService.customSnackbar('Bienvenido a la aplicacion','ok',5000)

  }


  ngOnDestroy(){
    // if(this.userSubs){
    //   this.userSubs.unsubscribe();
    // }

  }

  logUp(){
    this.authService.SignOut();
  }

  animationCreated(animationItem: AnimationItem): void {
    animationItem.playSpeed = 1.0,
    animationItem
  }


}
