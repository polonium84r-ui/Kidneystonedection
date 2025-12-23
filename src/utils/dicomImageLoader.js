import cornerstone from 'cornerstone-core'
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import dicomParser from 'dicom-parser'

// Configure WADO Image Loader
cornerstoneWADOImageLoader.external.cornerstone = cornerstone
cornerstoneWADOImageLoader.external.dicomParser = dicomParser

// Configure Web Workers
// Note: In a production Vite setup, you might need to copy these workers to the public folder
// or import them differently. For this setup, we'll try a configuration that works with most modern bundlers
// or fallback to fetching from unpkg if local paths fail.

const config = {
    webWorkerPath: 'https://unpkg.com/cornerstone-wado-image-loader@4.1.5/dist/cornerstoneWADOImageLoaderWebWorker.min.js',
    taskConfiguration: {
        decodeTask: {
            codecsPath: 'https://unpkg.com/cornerstone-wado-image-loader@4.1.5/dist/cornerstoneWADOImageLoaderCodecs.min.js',
        },
    },
}

cornerstoneWADOImageLoader.webWorkerManager.initialize(config)

export default cornerstone
