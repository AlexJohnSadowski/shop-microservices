import { createClient } from 'redis'

export const client = createClient({
    url: 'redis://redis:6379',
});

export async function connectToRedis() {
    await client.connect().then(() => console.log('redis connected!'))
}
