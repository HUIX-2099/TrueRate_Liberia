export async function GET() {
  return new Response('Backend OK on 3001', {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  })
}
