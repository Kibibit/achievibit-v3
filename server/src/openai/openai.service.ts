import { configService, Logger } from '@kb-config';
import { Injectable } from '@nestjs/common';
import { Axios } from 'axios';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private readonly logger = new Logger(OpenaiService.name);
  private readonly openai: OpenAI;
  private readonly imgProxyAxiosInstance = new Axios({
    baseURL: 'https://imgproxy.kibibit.io'
  });

  constructor() {
    if (configService.config.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: configService.config.OPENAI_API_KEY
      });
    }
  }

  async generateAvatar(repoName: string, description: string, languages: string[]) {
    try {
      if (!this.openai) {
        return;
      }

      const prompt = `
    A square, pixel art-style avatar for a GitHub project named '${repoName}'.
    The avatar will be used as a profile picture for the project on the project profile page,
    and represents the project, not a person. The avatar should be simple and recognizable.
    It should ABSOLUTELY NOT include any text!
    The project is ${description} and is built with ${languages.join(', ')}.
    Design the avatar with a dark background suitable for dark mode, and use a pixelated,
    retro-inspired style. Reflect the purpose and tone of the project through
    simple iconography or visual metaphors, such as symbolic shapes, tools, or characters.
    Do not include any text in the avatar.
    `.trim();

      this.logger.verbose('OpenAI prompt:', { prompt });

      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      });

      const originalUrl = response.data[0].url;
      const encodedUrl = Buffer.from(originalUrl).toString('base64url');

      const resizedUrl = `/unsafe/rs:fit:200:200/${encodedUrl}`;

      // resize image to 200x200
      const result = await this.imgProxyAxiosInstance.get<Buffer>(resizedUrl, {
        responseType: 'arraybuffer'
      });

      return result.data.toString('base64');
    } catch (error) {
      this.logger.error('Error generating avatar', error);

      // should not fail the request
      return undefined;
    }
  }
}
