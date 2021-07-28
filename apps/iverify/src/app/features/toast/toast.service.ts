import {
  ComponentFactoryResolver,
  Inject,
  Injectable,
  ViewContainerRef,
  ViewRef
} from '@angular/core';
import { ToastComponent, ToastType } from './toast.component';
import { ToastModule } from './toast.module';

const DEFAULT_DURATION = 5000;

@Injectable({
  providedIn: ToastModule
})
export class ToastService {
  constructor(
    @Inject(ComponentFactoryResolver)
    private factoryResolver: ComponentFactoryResolver
  ) {}

  private viewContainerRef: ViewContainerRef = null;

  setViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

  private lastViewRef: ViewRef;

  show(
    type: ToastType,
    message: string,
    dismissible: boolean = true,
    duration = DEFAULT_DURATION
  ) {
    if (this.lastViewRef) this.lastViewRef.destroy();
    const factory = this.factoryResolver.resolveComponentFactory(
      ToastComponent
    );
    const component = factory.create(this.viewContainerRef.parentInjector);
    const toastComponent = <ToastComponent>component.instance;
    toastComponent.config = { type, message, dismissible };
    const viewRef = this.viewContainerRef.insert(component.hostView);
    setTimeout(() => {
      viewRef.destroy();
    }, duration);
    toastComponent.destroy.subscribe(() => viewRef.destroy());
    this.lastViewRef = viewRef;
  }
}

export interface ToastPayload {
  message: string;
  duration?: number;
}
