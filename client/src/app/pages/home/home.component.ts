import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

import { GeneralApiService } from '../../services/api/general.service';

@Component({
  selector: 'kb-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  constructor(
    private readonly generalApiService: GeneralApiService
  ) {
  }
  // Define the original widths of the images
  private imageSizes = {
    'far-clouds': 128,
    'near-clouds': 144,
    'far-mountains': 160,
    'mountains': 320,
    'trees': 240
  };

  private readonly originalHeight = 240;

  @ViewChild('parallaxContainer', { static: true })
    parallaxRef!: ElementRef;

  private resizeListener = () => this.calculateScrollRatios();

  ngAfterViewInit(): void {
    window.addEventListener('load', this.resizeListener);
    window.addEventListener('resize', this.resizeListener);
    this.calculateScrollRatios();
  }

  ngOnDestroy(): void {
    window.removeEventListener('load', this.resizeListener);
    window.removeEventListener('resize', this.resizeListener);
  }

  // Function to calculate the ratio and set CSS custom properties
  private calculateScrollRatios(): void {
    const parallax = this.parallaxRef.nativeElement as HTMLElement;
    const containerHeight = parallax.offsetHeight;

    const layers = parallax.querySelectorAll('.layer');

    layers.forEach((layer: Element) => {
      const classList = Array.from(layer.classList);
      const layerClass = classList.find((cls) => this.imageSizes[cls as keyof typeof this.imageSizes]);

      if (layerClass) {
        const ratio = containerHeight / this.originalHeight;
        const actualImageWidth = this.imageSizes[layerClass as keyof typeof this.imageSizes] * ratio;
        (layer as HTMLElement).style.setProperty('--scroll-width', `${ Math.floor(actualImageWidth) }px`);
      }
    });
  }
}
