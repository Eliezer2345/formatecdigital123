import { Directive, Input, HostListener, ElementRef, inject } from '@angular/core';

@Directive({
  selector: 'img[appImgFallback]',
  standalone: true
})
export class ImgFallbackDirective {
  @Input() appImgFallback = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=400&auto=format&fit=crop'; // Default error image

  private el = inject(ElementRef);

  @HostListener('error')
  onError() {
    const element: HTMLImageElement = this.el.nativeElement;
    if (element.src !== this.appImgFallback) {
      element.src = this.appImgFallback;
    }
  }
}
