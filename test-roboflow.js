import axios from 'axios';
import fs from 'fs';

const filePath = 'C:/Users/Admin/.gemini/antigravity/brain/dfdeac03-cba3-4898-b707-99f10276a5c1/uploaded_image_1766508888318.png';
const ROBOFLOW_API_KEY = 'R8FMaPoYSNTZ8c7cw4aa';
const WORKFLOW_ID = 'rit-radar';
const WORKSPACE = 'deva-yc5op';
const API_URL = `https://serverless.roboflow.com/${WORKSPACE}/workflows/${WORKFLOW_ID}`;

async function test() {
    try {
        console.log('Reading file...');
        const fileBuffer = fs.readFileSync(filePath);
        const base64Image = fileBuffer.toString('base64');
        console.log('File read. Base64 length:', base64Image.length);

        console.log(`Sending to ${API_URL}...`);

        const response = await axios.post(API_URL, {
            api_key: ROBOFLOW_API_KEY,
            inputs: {
                "image": {
                    "type": "base64",
                    "value": base64Image
                }
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Success!');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('Error!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

test();
