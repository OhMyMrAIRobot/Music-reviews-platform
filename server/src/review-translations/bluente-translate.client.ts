import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';

const BLUENTE_URL = 'https://api.bluente.com/api/20250924/blu_translate/text';

type BluenteTranslateBody = {
  from: string;
  to: string;
  text: string;
};

type BluenteSuccessResponse = {
  message: string;
  code: number;
  data?: { text?: string };
};

@Injectable()
export class BluenteTranslateClient {
  private readonly timeoutMs = 30_000;

  async translateText(body: BluenteTranslateBody): Promise<string> {
    const key = process.env.BLUENTE_API_KEY;
    if (!key) {
      throw new InternalServerErrorException(
        'BLUENTE_API_KEY is not configured',
      );
    }

    try {
      const { data } = await axios.post<BluenteSuccessResponse>(
        BLUENTE_URL,
        body,
        {
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
          timeout: this.timeoutMs,
        },
      );

      if (data.code !== 0 || typeof data.data?.text !== 'string') {
        throw new BadGatewayException(
          typeof data.message === 'string'
            ? data.message
            : 'Bluente translation failed',
        );
      }

      return data.data.text;
    } catch (err) {
      if (
        err instanceof BadGatewayException ||
        err instanceof InternalServerErrorException
      ) {
        throw err;
      }
      if (axios.isAxiosError(err)) {
        const payload = (err as AxiosError<{ message?: string }>).response
          ?.data;
        const msg =
          payload && typeof payload.message === 'string'
            ? payload.message
            : err.message;
        throw new BadGatewayException(msg);
      }
      throw err;
    }
  }
}
