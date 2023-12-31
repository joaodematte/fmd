import { Configuration, OpenAIApi } from 'openai-edge';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(config);

export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  if (process.env.NODE_ENV != 'development' && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get('x-forwarded-for');

    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, '1 d')
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(`fmd_ratelimit_${ip}`);

    if (!success) {
      return new Response('You have reached your request limit for the day.', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString()
        }
      });
    }
  }

  let { prompt } = await req.json();

  const parsedPrompt = String(prompt).replace(/\n/g, ' ').replace(/\/$/, '').slice(0, 5000);

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You are an AI writing assistant that continues existing text based on context from prior text. ' +
          'Give more weight/priority to the later characters than the beginning ones. Make sure to construct complete sentences.'
      },
      {
        role: 'user',
        content: parsedPrompt
      }
    ],
    max_tokens: 100,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
