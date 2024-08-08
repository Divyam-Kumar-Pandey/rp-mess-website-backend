import { UNAUTHORISED_RESPONSE } from '@/app/constants';
import { isAuthorizedAsAnyOfThem } from '@/lib/services/auth';
import { google } from 'googleapis';
import { Readable } from 'node:stream';
// import credentials from './credentials.json'
const SCOPE = ['https://www.googleapis.com/auth/drive'];
const FILE_ID = process.env.GOOGLE_DRIVE_FILE_ID;

async function authorize(){
    const jwtClient = new google.auth.JWT(
        // credentials.client_email,
        process.env.GOOGLE_CLIENT_EMAIL,
        undefined,
        // credentials.private_key,
        process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/gm, '\n'),
        SCOPE
    );
    await jwtClient.authorize();
    return jwtClient;
}

async function uploadFile(authClient : any, image: File){
    try{
        const drive = google.drive({version:'v3',auth:authClient}); 
        const fileBuffer = image.stream()
        var fileMetaData = {
            name: Date.now() + '.png',    
            parents:[FILE_ID as string] // A folder ID to which file will get uploaded
        }
        const media = {
            mimeType: image.type,
            body: Readable.from(fileBuffer as any)
        }
        const res = await drive.files.create({
            requestBody: {
                ...fileMetaData,
            },
            media: media,
            fields: 'id'
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function POST(request: Request): Promise<Response> {

    const token = request.headers.get("Authorization")?.split(" ")[1];
    const auth = await isAuthorizedAsAnyOfThem(token!, ["ADMIN", "SUPERADMIN"]);
    if(!auth.success){
        return UNAUTHORISED_RESPONSE;
    }

    const formData = await request.formData();
    const image = formData.get('image') as File;
    console.log(image.size);

    try{
        const authClient = await authorize();
        const file = await uploadFile(authClient,image);
        const imgUrl = `https://drive.google.com/uc?id=${file.id}&export=view`;
        return new Response(JSON.stringify({
            success: true,
            data: {
                imgUrl: imgUrl,
            },
            error: null,
        }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            data: null,
            error: error,
        }), { status: 500 });
    }
}

