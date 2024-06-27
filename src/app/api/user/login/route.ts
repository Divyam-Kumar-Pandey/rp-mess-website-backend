export async function POST(req: Request) {
    const userData = await req.json();

    // do something with userData

    console.log(userData);

    return Response.json(userData);
    
}