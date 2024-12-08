import { Injectable } from '@nestjs/common';
import { Attributes, Experiment, GrowthBook, Result } from "@growthbook/growthbook";
import { configService } from '@kb-config';
import { User } from '@kb-models';
import { Request } from 'express';

@Injectable()
export class GrowthbookService {
private readonly growthbookInstance = new GrowthBook({
  apiHost: configService.config.GROWTHBOOK_API_HOST,
  clientKey: configService.config.GROWTHBOOK_API_KEY,
  enableDevMode: true,
  trackingCallback: (experiment: Experiment<any>, result: Result<any>) => {
    // TODO: Use your real analytics tracking system
    console.log("Viewed Experiment", {
      experimentId: experiment.key,
      variationId: result.key
    });
  }
});

  async init() {
    // Wait for features to be available
    await this.growthbookInstance.init({ streaming: true });
  }

  setUserAttributes(request: Request) {
    const attributes: Attributes = {};

    // get the url from the request
    if (request.headers.referer) {
      attributes.url = request.headers.referer;
    }

    // get the user from the request
    const loggedInUser = request.user as User;

    if (loggedInUser) {
      attributes.userId = loggedInUser.id;
      attributes.email = loggedInUser.email;
      attributes.name = loggedInUser.username;
      attributes.browser = request.headers['user-agent'];
    }

    this.growthbookInstance.setAttributes(attributes);
  }

  isOn(featureKey: string): boolean {
    return this.growthbookInstance.isOn(featureKey);
  }

  getFeatureValue<T>(featureKey: string, fallback: T) {
    return this.growthbookInstance.getFeatureValue<T>(featureKey, fallback);
  }
}
