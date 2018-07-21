import { Component, ElementRef, HostBinding, Inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FuseConfigService } from '../core/services/config.service';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import {Router} from "@angular/router";

@Component({
    selector     : 'fuse-main',
    templateUrl  : './main.component.html',
    styleUrls    : ['./main.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FuseMainComponent implements OnInit, OnDestroy
{
    onSettingsChanged: Subscription;
    fuseSettings: any;
    @HostBinding('attr.fuse-layout-mode') layoutMode;

    constructor(
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private fuseConfig: FuseConfigService,
        private platform: Platform,
        router: Router,
        @Inject(DOCUMENT) private document: any
    )
    {
      //router.events.subscribe((url:any) => console.log(url));
      //console.log("router.url ",router.url);  // to print only path eg:"/login"

        this.onSettingsChanged =
            this.fuseConfig.onSettingsChanged
                .subscribe(
                    (newSettings) => {
                        this.fuseSettings = newSettings;
                        this.layoutMode = this.fuseSettings.layout.mode;
                    }
                );

        if ( this.platform.ANDROID || this.platform.IOS )
        {
            this.document.body.className += ' is-mobile';
        }
    }

    ngOnInit()
    {
    }

    ngOnDestroy()
    {
        this.onSettingsChanged.unsubscribe();
    }

    addClass(className: string)
    {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }

    removeClass(className: string)
    {
        this._renderer.removeClass(this._elementRef.nativeElement, className);
    }
}