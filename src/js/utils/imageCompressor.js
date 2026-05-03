// ============================================
// COLORMART - IMAGE COMPRESSOR UTILITY
// ============================================

class ImageCompressor {
    constructor(options = {}) {
        this.maxSizeKB = options.maxSizeKB || 500;
        this.maxWidthOrHeight = options.maxWidthOrHeight || 1920;
        this.quality = options.quality || 0.8;
        this.useWebWorker = options.useWebWorker !== false;
    }

    async compressImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const img = new Image();
                    img.src = e.target.result;
                    
                    await new Promise((resolveImg) => {
                        img.onload = resolveImg;
                    });

                    const canvas = document.createElement('canvas');
                    let { width, height } = img;

                    // Resize if needed
                    if (width > this.maxWidthOrHeight || height > this.maxWidthOrHeight) {
                        if (width > height) {
                            height *= this.maxWidthOrHeight / width;
                            width = this.maxWidthOrHeight;
                        } else {
                            width *= this.maxWidthOrHeight / height;
                            height = this.maxWidthOrHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Initial compression
                    let blob = await this.canvasToBlob(canvas, file.type, this.quality);
                    
                    // If still too large, reduce quality until under max size
                    let currentQuality = this.quality;
                    while (blob.size > this.maxSizeKB * 1024 && currentQuality > 0.1) {
                        currentQuality -= 0.1;
                        blob = await this.canvasToBlob(canvas, file.type, currentQuality);
                    }

                    const compressedFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now()
                    });

                    console.log(`Image compressed: ${(file.size / 1024).toFixed(2)}KB → ${(compressedFile.size / 1024).toFixed(2)}KB`);
                    resolve(compressedFile);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    canvasToBlob(canvas, type, quality) {
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Canvas to Blob conversion failed'));
                }
            }, type, quality);
        });
    }

    async compressMultipleImages(files) {
        const compressedFiles = [];
        for (const file of files) {
            if (file.type.startsWith('image/')) {
                try {
                    const compressed = await this.compressImage(file);
                    compressedFiles.push(compressed);
                } catch (error) {
                    console.error(`Error compressing ${file.name}:`, error);
                    compressedFiles.push(file); // Keep original if compression fails
                }
            } else {
                compressedFiles.push(file);
            }
        }
        return compressedFiles;
    }

    getFileSize(file) {
        return file.size;
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
}

const imageCompressor = new ImageCompressor({
    maxSizeKB: 500,
    maxWidthOrHeight: 1920,
    quality: 0.8
});

export default imageCompressor;