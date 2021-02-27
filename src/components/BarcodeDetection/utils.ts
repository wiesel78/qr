import jsQR from "jsqr";

export type BarcodeFormat = 
    "aztec" |
    "code_128" |
    "code_39" | 
    "code_93" |
    "codabar" | 
    "data_matrix" |
    "ean_13" |
    "ean_8" |
    "itf" |
    "pdf417" |
    "qr_code" |
    "unknown" |
    "upc_a" |
    "upc_e";

export interface BarcodeDetectorOptions {
    formats: BarcodeFormat[];
};

export interface Point2D {
    x : number;
    y : number;
}

export interface DetectedBarcode {
    boundingBox : DOMRectReadOnly;
    rawValue : string;
    format : BarcodeFormat;
    cornerPoints : Point2D[];
}

export interface BarcodeDetector {
    new (barcodeDetectorOptions : BarcodeDetectorOptions) : BarcodeDetector;
    getSupportedFormats() : Promise<BarcodeFormat[]>;
    detect(image : ImageBitmapSource) : Promise<DetectedBarcode[]>;
}

export declare var BarcodeDetector : BarcodeDetector;


export async function getBarcode(imageData : ImageData) : Promise<string | undefined> {
    if (
        "BarcodeDetector" in window &&
        (await BarcodeDetector.getSupportedFormats()).includes("qr_code")
    ) {
        const barcodeDetector = new BarcodeDetector({
            formats: [
                "aztec",
                "code_128",
                "code_39",
                "code_93",
                "codabar",
                "data_matrix",
                "ean_13",
                "ean_8",
                "itf",
                "pdf417",
                "qr_code",
                "upc_a",
                "upc_e",
            ],
        });

        try {
            const barcodes = await barcodeDetector.detect(imageData);
            
            return barcodes[0].rawValue;
        } catch (e) {
            console.error("Barcode detection failed:", e);
            return ;
        }
    }
    else
    {
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        return code?.data;
    }
}