export async function GET(request: Request) {
  const message: string = "success";
  return Response.json({
    message: message,
  });
}
