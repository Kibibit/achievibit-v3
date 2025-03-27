import { configService } from '@kb-config';
import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import * as tls from 'tls';

@Injectable()
export class CertificateHealthIndicator extends HealthIndicator {
  private readonly domain = configService.config.BASE_BACKEND_URL;
  
  // Warn if the cert expires in ≤30 days
  private readonly warningThresholdDays = 30;

  async isHealthy(): Promise<HealthIndicatorResult> {
    if (this.isLocalhost(this.domain)) {
      return this.getStatus('ssl certificate', true, {
        status: 'up',
        message: 'SSL check skipped for localhost'
      });
    }

    try {
      const certificate = await this.getSSLCertificate(this.domain);
      const expiryDate = new Date(certificate.valid_to);
      const now = new Date();
      const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysRemaining <= 0) {
        throw new HealthCheckError('SSL certificate has expired', {
          ssl: { status: 'down', message: 'SSL certificate has expired' },
        });
      }

      if (daysRemaining <= this.warningThresholdDays) {
        return this.getStatus('ssl certificate', true, {
          status: 'warning',
          message: `SSL certificate will expire in ${daysRemaining} days`,
          expiryDate: expiryDate.toISOString(),
        });
      }

      return this.getStatus('ssl certificate', true, {
        status: 'up',
        expiryDate: expiryDate.toISOString(),
      });
    } catch (error) {
      throw new HealthCheckError('SSL certificate check failed', {
        ssl: { status: 'down', message: error.message },
      });
    }
  }

  private getSSLCertificate(host: string): Promise<tls.PeerCertificate> {
    return new Promise((resolve, reject) => {
      const socket = tls.connect(443, host, { servername: host }, () => {
        const certificate = socket.getPeerCertificate();
        if (!certificate || Object.keys(certificate).length === 0) {
          reject(new Error('Could not retrieve SSL certificate'));
        } else {
          resolve(certificate);
        }
        socket.end();
      });

      socket.on('error', (err) => reject(err));
    });
  }

  private isLocalhost(domain: string): boolean {
    const host = new URL(domain).hostname;
    return host === 'localhost' || host === '127.0.0.1' || host === '::1';
  }
}
